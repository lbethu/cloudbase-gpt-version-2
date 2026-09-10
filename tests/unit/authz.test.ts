import { describe, expect, it } from "vitest";
import { decide, decideResource, type Principal } from "@/server/authz/core";
import { repos } from "../support/repos";

const roles = repos.roles.list();
const employee: Principal = { subject: "u1", roles: ["employee"], teams: ["company-wide"], tenantId: "cloudpoint" };
const admin: Principal = { subject: "u2", roles: ["employee", "admin"], teams: ["company-wide"], tenantId: "cloudpoint" };

describe("authorization core", () => {
  it("denies everything without an identity", () => {
    expect(decide(null, roles, "knowledge.read").reason).toBe("no-identity");
    expect(decide(null, roles, "knowledge.read").allowed).toBe(false);
  });
  it("is default-deny for permissions not granted by any role", () => {
    expect(decide(employee, roles, "admin.access").allowed).toBe(false);
    expect(decide(employee, roles, "sop.approve").allowed).toBe(false);
  });
  it("grants what the role grants", () => {
    expect(decide(employee, roles, "sop.read").allowed).toBe(true);
    expect(decide(admin, roles, "admin.access").allowed).toBe(true);
  });
  it("gives explicit deny precedence over grants from other roles", () => {
    const p: Principal = { subject: "u3", roles: ["employee", "restricted-readonly"], teams: [], tenantId: "cloudpoint" };
    expect(decide(p, roles, "files.read")).toEqual({ allowed: false, reason: "explicit-deny" });
    expect(decide(p, roles, "sop.read").allowed).toBe(true);
  });
  it("ignores unknown roles", () => {
    const p: Principal = { subject: "u4", roles: ["superuser"], teams: [], tenantId: "cloudpoint" };
    expect(decide(p, roles, "knowledge.read").allowed).toBe(false);
  });
  it("enforces classification: confidential requires team membership or explicit grant", () => {
    const base = { type: "sop" as const, owningTeam: "sales-bd", teams: ["leadership"], accessGrants: [] as string[] };
    expect(decideResource(employee, roles, { ...base, classification: "internal" }).allowed).toBe(true);
    expect(decideResource(employee, roles, { ...base, classification: "confidential" }).reason).toBe("classification");
    const member: Principal = { ...employee, teams: ["leadership"] };
    expect(decideResource(member, roles, { ...base, classification: "confidential" }).allowed).toBe(true);
    expect(decideResource(employee, roles, { ...base, classification: "confidential", accessGrants: ["u1"] }).allowed).toBe(true);
  });
  it("restricted requires an explicit grant even for team members and admins", () => {
    const res = { type: "rfp" as const, owningTeam: "sales-bd", teams: [], accessGrants: [] as string[], classification: "restricted" as const };
    const member: Principal = { ...admin, teams: ["sales-bd"] };
    expect(decideResource(member, roles, res).allowed).toBe(false);
    expect(decideResource(member, roles, { ...res, accessGrants: ["u2"] }).allowed).toBe(true);
  });
  it("scopes by tenant", () => {
    const res = { type: "sop" as const, owningTeam: "x", teams: [], accessGrants: [], classification: "internal" as const, tenantId: "other" };
    expect(decideResource(employee, roles, res).reason).toBe("tenant");
  });
});
