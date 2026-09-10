import { describe, expect, it } from "vitest";
import type { KnowledgeItem } from "@/domain";
import { decideResource } from "@/server/authz/core";
import { LexicalSearchProvider } from "@/server/search/lexical";
import { applyFilters } from "@/server/search/provider";
import { buildKnowledgeIndex } from "@/server/services/knowledge-index";
import { repos } from "../support/repos";

const index = buildKnowledgeIndex(repos);
const provider = new LexicalSearchProvider([{ concept: "test", terms: ["inbound lead", "lead qualification", "pipedrive"] }]);

describe("lexical search", () => {
  it("finds an SOP by number", async () => {
    const hits = await provider.search({ q: "105.2" }, index);
    expect(hits[0]?.item.ref).toEqual({ type: "sop", id: "sop-105-2" });
  });
  it("finds a capability by id and by topic", async () => {
    expect((await provider.search({ q: "CAP-004" }, index))[0]?.item.ref.id).toBe("CAP-004");
    const hits = await provider.search({ q: "indoor asset detection" }, index);
    expect(hits.some((h) => h.item.ref.id === "CAP-004")).toBe(true);
  });
  it("expands synonyms", async () => {
    const hits = await provider.search({ q: "qualify a prospect from pipedrive" }, index);
    expect(hits.some((h) => h.item.ref.id === "sop-216")).toBe(true);
  });
  it("returns nothing for nonsense", async () => {
    expect(await provider.search({ q: "zzqx plorvian xqzvw" }, index)).toEqual([]);
  });
  it("applies type, team and status filters", () => {
    expect(applyFilters(index, { types: ["copilot"] }).every((i) => i.ref.type === "copilot")).toBe(true);
    expect(applyFilters(index, { team: "sales-bd" }).every((i) => i.owningTeam === "sales-bd" || i.teams.includes("sales-bd"))).toBe(true);
    expect(applyFilters(index, { types: ["sop"], status: "In review" }).length).toBe(repos.sops.list().filter((s) => s.versions.some((v) => v.status === "review") && !s.effectiveVersion).length);
  });
  it("never scores items the principal cannot read", async () => {
    const confidential: KnowledgeItem = { ref: { type: "rfp", id: "secret" }, title: "Secret pursuit plan", summary: "", owningTeam: "sales-bd", teams: [], status: "draft", classification: "confidential", tags: [], url: "/rfp/secret", body: "secret pursuit plan for a named client" };
    const roles = repos.roles.list();
    const outsider = { subject: "o", roles: ["employee"], teams: ["technical-gis"], tenantId: "cloudpoint" };
    const permitted = [...index, confidential].filter((i) => decideResource(outsider, roles, { type: i.ref.type, classification: i.classification, owningTeam: i.owningTeam, teams: i.teams, accessGrants: [] }).allowed);
    const hits = await provider.search({ q: "secret pursuit plan" }, permitted);
    expect(hits.some((h) => h.item.ref.id === "secret")).toBe(false);
  });
});

describe("full-text SOP search (regression: keyword only inside a document)", () => {
  it("finds the Sales Playbook by 'sql' — a term that only appears inside the PDF body", async () => {
    const hits = await provider.search({ q: "sql" }, index);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].item.ref.id).toBe("sop-cloudpoint-sales-playbook-processes-training-manual");
  });
  it("finds SOPs by terms from deep sections (single-word and phrase)", async () => {
    expect((await provider.search({ q: "bigtime" }, index)).some((h) => h.item.ref.type === "sop")).toBe(true);
    expect((await provider.search({ q: "recurring invoices" }, index))[0]?.item.ref.id).toBe("sop-101-1");
  });
  it("short tokens match whole words only", async () => {
    const { countOccurrences } = await import("@/server/search/lexical");
    expect(countOccurrences("the sql lead and sqlite", "sql")).toBe(1);
    expect(countOccurrences("pl pm plorvian", "pl")).toBe(1);
  });
  it("every SOP has full-text chunks with sections", () => {
    for (const sop of repos.sops.list()) {
      const chunks = sop.versions.flatMap((v) => repos.sops.importedContent(v.importedContentId ?? "")?.chunks ?? []);
      expect(chunks.length, sop.id).toBeGreaterThan(0);
      expect(chunks.every((c) => c.section && c.content.length > 0)).toBe(true);
    }
  });
});
