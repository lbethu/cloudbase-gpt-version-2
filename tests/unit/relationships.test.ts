import { describe, expect, it } from "vitest";
import { buildKnowledgeIndex } from "@/server/services/knowledge-index";
import { relatedTo } from "@/server/services/relationships";
import { repos } from "../support/repos";

const index = buildKnowledgeIndex(repos);

describe("relationship queries", () => {
  it("answers 'which capabilities did this R&D project create?'", () => {
    const groups = relatedTo(repos, { type: "rnd-project", id: "CP-RND-004" }, index);
    const caps = groups.find((g) => g.type === "capability")?.entries ?? [];
    expect(caps.map((c) => c.ref.id)).toContain("CAP-004");
    expect(caps[0].confidence).toBe("proposed");
    expect(caps[0].label).toBe("Creates");
  });
  it("answers the inverse with an inverse label", () => {
    const groups = relatedTo(repos, { type: "capability", id: "CAP-004" }, index);
    const rnd = groups.find((g) => g.type === "rnd-project")?.entries ?? [];
    expect(rnd[0].ref.id).toBe("CP-RND-004");
    expect(rnd[0].label).toBe("Created by");
  });
  it("answers 'which capabilities belong to a cluster?'", () => {
    const members = relatedTo(repos, { type: "capability-cluster", id: "CLUSTER-001" }, index).find((g) => g.type === "capability")?.entries ?? [];
    expect(members.map((m) => m.ref.id).sort()).toEqual(["CAP-003", "CAP-004"]);
  });
  it("answers 'which SOP governs this copilot?'", () => {
    const sops = relatedTo(repos, { type: "copilot", id: "project-reference-assistant" }, index).find((g) => g.type === "sop")?.entries ?? [];
    expect(sops.map((s) => s.ref.id)).toContain("sop-223");
  });
  it("hides related objects the viewer cannot see", () => {
    const limited = index.filter((i) => i.ref.type !== "capability");
    const groups = relatedTo(repos, { type: "rnd-project", id: "CP-RND-004" }, limited);
    expect(groups.find((g) => g.type === "capability")).toBeUndefined();
  });
});
