import { describe, expect, it } from "vitest";
import { runAgent, summarizeFindings } from "@/server/agents/engine";
import { decideResource } from "@/server/authz/core";
import { buildGraph } from "@/server/services/graph";
import { buildKnowledgeIndex } from "@/server/services/knowledge-index";
import { repos } from "../support/repos";

const index = buildKnowledgeIndex(repos);
const ctx = { repos, index, now: new Date("2026-09-10") };

describe("platform agents", () => {
  it("loads the agent registry and every active deterministic agent has an implementation", () => {
    for (const a of repos.agents.list().filter((x) => x.status === "active" && x.kind === "deterministic")) {
      expect(runAgent(a, ctx).skipped, a.id).toBeUndefined();
    }
  });
  it("coverage agent flags capabilities without governed maturity", () => {
    const agent = repos.agents.get("coverage-agent")!;
    const { findings } = runAgent(agent, ctx);
    expect(findings.some((f) => f.target?.type === "capability" && /maturity/.test(f.title))).toBe(true);
    expect(findings.every((f) => f.recommendedAction.length > 0)).toBe(true);
  });
  it("duplicate detector flags SOPs with two unreconciled versions", () => {
    const { findings } = runAgent(repos.agents.get("duplicate-detector")!, ctx);
    expect(findings.some((f) => f.target?.id === "sop-105-2" && f.severity === "high")).toBe(true);
  });
  it("relationship agent reports proposed links", () => {
    const { findings } = runAgent(repos.agents.get("relationship-agent")!, ctx);
    expect(findings.some((f) => /proposed/.test(f.title))).toBe(true);
  });
  it("never references objects outside the permitted index", () => {
    const limited = index.filter((i) => i.ref.type !== "capability");
    const { findings } = runAgent(repos.agents.get("coverage-agent")!, { ...ctx, index: limited });
    expect(findings.some((f) => f.target?.type === "capability")).toBe(false);
  });
  it("skips AI-assisted and non-active agents", () => {
    expect(runAgent(repos.agents.get("rfp-appraisal-agent")!, ctx).skipped).toBeTruthy();
  });
  it("summarizes severities", () => {
    const s = summarizeFindings(runAgent(repos.agents.get("freshness-sentinel")!, ctx).findings);
    expect(s.high + s.medium + s.low + s.info).toBeGreaterThan(0);
  });
});

describe("knowledge graph", () => {
  it("builds nodes and edges only from permitted items", () => {
    const g = buildGraph(repos, index);
    expect(g.nodes.length).toBe(index.length);
    expect(g.edges.some((e) => e.confidence === "proposed")).toBe(true);
    const limited = buildGraph(repos, index.filter((i) => i.ref.type !== "capability"));
    expect(limited.nodes.some((n) => n.type === "capability")).toBe(false);
    expect(limited.edges.some((e) => e.source.startsWith("capability:") || e.target.startsWith("capability:"))).toBe(false);
  });
  it("focus mode returns the neighbourhood", () => {
    const g = buildGraph(repos, index, { focus: "capability-cluster:CLUSTER-001", depth: 1, includeTeams: false });
    expect(g.nodes.map((n) => n.id).sort()).toEqual(["capability-cluster:CLUSTER-001", "capability:CAP-003", "capability:CAP-004", "documentation:cros-maturity-model"].sort());
  });
});

describe("CRM authorization", () => {
  const roles = repos.roles.list();
  it("contacts are confidential: employee without sales role cannot read", () => {
    const employee = { subject: "e", roles: ["employee"], teams: ["technical-gis"], tenantId: "cloudpoint" };
    expect(decideResource(employee, roles, { type: "contact", classification: "confidential", owningTeam: "sales-bd", teams: [], accessGrants: [] }).allowed).toBe(false);
    const sales = { subject: "s", roles: ["employee", "sales"], teams: ["sales-bd"], tenantId: "cloudpoint" };
    expect(decideResource(sales, roles, { type: "contact", classification: "confidential", owningTeam: "sales-bd", teams: [], accessGrants: [] }).allowed).toBe(true);
    expect(decideResource({ ...sales, teams: ["technical-gis"] }, roles, { type: "contact", classification: "confidential", owningTeam: "sales-bd", teams: [], accessGrants: [] }).allowed).toBe(false);
  });
});
