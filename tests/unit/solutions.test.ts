import { describe, expect, it } from "vitest";
import { Solution } from "@/domain";
import { runAgent } from "@/server/agents/engine";
import { buildKnowledgeIndex } from "@/server/services/knowledge-index";
import { repos } from "../support/repos";

/**
 * The delivery model: every problem is answered with an agent + copilot pair,
 * and nothing claims to be in service without the evidence that justifies it.
 */
describe("solution registry", () => {
  const solutions = repos.solutions.list();

  it("loads and validates every intake record", () => {
    expect(solutions.length).toBeGreaterThan(0);
    for (const s of solutions) expect(() => Solution.parse(s)).not.toThrow();
  });

  it("states a problem, never only a solution", () => {
    for (const s of solutions) expect(s.problem.trim().length, `${s.id} problem`).toBeGreaterThan(40);
  });

  it("claims nothing: no intake record is owned, evaluated or in service", () => {
    for (const s of solutions.filter((x) => x.stage === "intake")) {
      expect(s.deliveryOwner, `${s.id} must not claim an owner at intake`).toBe("");
      expect(s.outcome, `${s.id} must not claim a measured outcome at intake`).toBeUndefined();
    }
    expect(solutions.some((s) => s.stage === "operational")).toBe(false);
  });

  it("never references an agent or copilot that does not exist", () => {
    for (const s of solutions) {
      for (const id of s.agentIds) expect(repos.agents.get(id), `${s.id} -> agent ${id}`).toBeTruthy();
      for (const id of s.copilotIds) expect(repos.copilots.get(id), `${s.id} -> copilot ${id}`).toBeTruthy();
    }
  });

  it("is searchable by the problem, not only the title", () => {
    const index = buildKnowledgeIndex(repos);
    const items = index.filter((i) => i.ref.type === "solution");
    expect(items.length).toBe(solutions.length);
    expect(items[0].body.length).toBeGreaterThan(0);
  });
});

describe("assurance agent", () => {
  const definition = repos.agents.get("assurance-agent")!;
  const ctx = { repos, index: buildKnowledgeIndex(repos), now: new Date("2026-09-14T00:00:00Z"), identity: null };

  it("is registered and deterministic", () => {
    expect(definition).toBeTruthy();
    expect(definition.kind).toBe("deterministic");
    expect(definition.authorityBoundaries.join(" ")).toMatch(/never promotes|never/i);
  });

  it("flags a solution in service with no copilot, no boundaries and no owner", () => {
    const rigged = {
      ...repos,
      solutions: {
        list: () => [
          Solution.parse({
            id: "SOL-TEST",
            title: "In service with nothing behind it",
            problem: "A problem long enough to pass the intake rule about stating the actual problem in real words.",
            stage: "operational",
            owningTeam: "ai-automation",
            createdAt: "2026-09-14",
            updatedAt: "2026-09-14",
          }),
        ],
        get: () => undefined,
      },
    } as unknown as typeof repos;
    const riggedCtx = { ...ctx, repos: rigged, index: [{ ...ctx.index[0], ref: { type: "solution" as const, id: "SOL-TEST" } }] };
    const { findings } = runAgent(definition, riggedCtx);
    const titles = findings.map((f) => f.title).join(" | ");
    expect(titles).toMatch(/no delivery owner/i);
    expect(titles).toMatch(/no copilot/i);
    expect(titles).toMatch(/no authority boundaries/i);
    expect(findings.every((f) => f.recommendedAction.length > 0)).toBe(true);
  });

  it("reports rather than changes anything", () => {
    const before = JSON.stringify(repos.solutions.list());
    runAgent(definition, ctx);
    expect(JSON.stringify(repos.solutions.list())).toBe(before);
  });
});
