import { describe, expect, it } from "vitest";
import { buildKnowledgeIndex } from "@/server/services/knowledge-index";
import { danglingRelationships } from "@/server/services/relationships";
import { repos } from "../support/repos";

describe("registry", () => {
  it("loads and validates every collection", () => {
    expect(repos.teams.list().length).toBeGreaterThan(0);
    expect(repos.roles.list().length).toBeGreaterThan(0);
    expect(repos.sops.list().length).toBeGreaterThan(0);
    expect(repos.cros.rndProjects().map((p) => p.code)).toEqual(["CP-RND-001", "CP-RND-002", "CP-RND-003", "CP-RND-004", "CP-RND-005", "CP-RND-006"]);
    expect(repos.cros.capabilities().map((c) => c.code)).toEqual(["CAP-001", "CAP-002", "CAP-003", "CAP-004", "CAP-005", "CAP-006"]);
    expect(repos.cros.clusters().map((c) => c.code)).toEqual(["CLUSTER-001"]);
  });
  it("has unique ids per collection", () => {
    const ids = repos.sops.list().map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    const cids = repos.copilots.list().map((c) => c.id);
    expect(new Set(cids).size).toBe(cids.length);
  });
  it("every owning team exists", () => {
    const teams = new Set(repos.teams.list().map((t) => t.id));
    for (const item of buildKnowledgeIndex(repos)) {
      if (item.ref.type === "team") continue;
      expect(teams.has(item.owningTeam), `${item.ref.type}:${item.ref.id} owning team ${item.owningTeam}`).toBe(true);
      for (const t of item.teams) expect(teams.has(t), `${item.ref.id} shared team ${t}`).toBe(true);
    }
  });
  it("relationship endpoints all resolve (no broken deep links)", () => {
    expect(danglingRelationships(repos, buildKnowledgeIndex(repos))).toEqual([]);
  });
  it("contains no fictional prototype corpus", () => {
    const index = buildKnowledgeIndex(repos);
    expect(index.some((i) => /mock prototype|placeholder only/i.test(i.body))).toBe(false);
    expect(index.some((i) => i.ref.id.startsWith("mock-"))).toBe(false);
  });
  it("does not mark any copilot operational or any capability mature without evidence", () => {
    expect(repos.copilots.list().every((c) => c.status !== "operational")).toBe(true);
    expect(repos.copilots.list().every((c) => !c.accessUrl)).toBe(true);
    expect(repos.cros.capabilities().every((c) => c.maturity === undefined)).toBe(true);
  });
  it("imported SOPs are in review with source files and never claim approval", () => {
    for (const sop of repos.sops.list()) {
      expect(sop.effectiveVersion).toBeUndefined();
      for (const v of sop.versions) {
        expect(v.status).toBe("review");
        expect(v.sourceFile?.path).toMatch(/\.(docx|pdf)$/);
        expect(v.sourceFile?.path.includes("..")).toBe(false);
        expect(v.importedContentId && repos.sops.importedContent(v.importedContentId)).toBeTruthy();
      }
    }
  });
  it("keeps duplicate source files as versions of one SOP", () => {
    expect(repos.sops.get("sop-105-2")?.versions.length).toBe(2);
    expect(repos.sops.get("sop-216")?.versions.length).toBe(2);
    expect(repos.sops.list().filter((s) => s.sopNumber === "105.2").length).toBe(1);
  });
});
