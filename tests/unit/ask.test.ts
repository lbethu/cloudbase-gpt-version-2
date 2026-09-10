import { describe, expect, it } from "vitest";
import { NO_SOURCE_MESSAGE, buildGovernedAnswer, validateModelAnswer, type AskSource } from "@/server/services/ask-core";

const sources: AskSource[] = [
  { index: 0, ref: { type: "sop", id: "sop-201" }, title: "201 - Creating Campaigns", url: "/sops/sop-201", status: "In review", governed: false, passage: "Campaigns use the naming pattern YYYY.##-Title.", section: "Naming", owningTeam: "sales-bd" },
  { index: 1, ref: { type: "documentation", id: "d" }, title: "Doc", url: "/docs/d", status: "published", governed: true, passage: "Approved text.", owningTeam: "ai-automation", updatedAt: "2026-09-01" },
];

describe("ask governance", () => {
  it("abstains explicitly when no source supports an answer", () => {
    const a = buildGovernedAnswer("anything", [], {});
    expect(a.statements).toEqual([{ text: NO_SOURCE_MESSAGE, kind: "UNKNOWN", citations: [] }]);
  });
  it("builds only FACT statements with citations in governed mode and flags unapproved sources", () => {
    const a = buildGovernedAnswer("naming", sources, {});
    expect(a.statements.every((s) => s.kind === "FACT" && s.citations.length === 1)).toBe(true);
    expect(a.notices.some((n) => /not yet approved/.test(n))).toBe(true);
    expect(a.lastUpdated).toBe("2026-09-01");
  });
  it("downgrades uncited FACTs and drops unknown citations from model output", () => {
    const out = validateModelAnswer(JSON.stringify({ statements: [{ text: "x", kind: "FACT", citations: [7] }, { text: "y", kind: "FACT", citations: [1] }] }), sources);
    expect(out).toEqual([{ text: "x", kind: "ASSUMPTION", citations: [] }, { text: "y", kind: "FACT", citations: [1] }]);
  });
  it("rejects malformed model output", () => {
    expect(validateModelAnswer("not json at all", sources)).toBeNull();
    expect(validateModelAnswer(JSON.stringify({ statements: [] }), sources)).toBeNull();
  });
});
