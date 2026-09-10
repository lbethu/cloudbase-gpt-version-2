import { describe, expect, it } from "vitest";
import { AutomationProposal, Relationship, Sop } from "@/domain";

describe("schema validation", () => {
  it("rejects SOPs without versions and invalid ids", () => {
    expect(Sop.safeParse({ id: "bad id!", title: "x", owningTeam: "t", versions: [] }).success).toBe(false);
  });
  it("accepts a minimal valid SOP and applies defaults", () => {
    const r = Sop.parse({ id: "sop-1", title: "T", owningTeam: "ops", versions: [{ version: "1", status: "draft" }] });
    expect(r.classification).toBe("internal");
    expect(r.kind).toBe("sop");
    expect(r.versions[0].procedure).toEqual([]);
  });
  it("rejects unknown relationship types", () => {
    expect(Relationship.safeParse({ from: { type: "sop", id: "a" }, to: { type: "copilot", id: "b" }, type: "loves" }).success).toBe(false);
  });
  it("validates automation proposals", () => {
    expect(AutomationProposal.safeParse({ problem: "short", whoExperiencesIt: "me", frequency: "daily", deterministicEnough: "yes", aiNeeded: "no", successDefinition: "ok" }).success).toBe(false);
    expect(AutomationProposal.safeParse({ problem: "Invoices past due are chased manually every week", whoExperiencesIt: "Finance", frequency: "weekly", deterministicEnough: "yes", aiNeeded: "no", successDefinition: "DSO drops" }).success).toBe(true);
  });
});
