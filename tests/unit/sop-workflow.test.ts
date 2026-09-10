import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Identity } from "@/server/auth/identity";

/**
 * Governed write workflows run against a temporary copy of the registry so
 * the real content/ is never touched by tests.
 */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cloudbase-wf-"));
const contentDir = path.join(tmp, "content");
const sourceDir = path.join(tmp, "source-documents");

const identity = (roles: string[]): Identity => ({ subject: "u-test", name: "Test User", email: "test@cloudpoint.local", roles, teams: ["company-wide"], tenantId: "cloudpoint", provider: "dev" });

beforeAll(() => {
  fs.cpSync(path.resolve(__dirname, "../../content"), contentDir, { recursive: true });
  fs.mkdirSync(sourceDir, { recursive: true });
  vi.stubEnv("CLOUDBASE_CONTENT_DIR", contentDir);
  vi.stubEnv("CLOUDBASE_SOURCE_DOCUMENTS_DIR", sourceDir);
  vi.stubEnv("CLOUDBASE_AUDIT_DIR", path.join(tmp, "audit"));
});
afterAll(() => {
  vi.unstubAllEnvs();
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe("SOP approval workflow", () => {
  it("denies approval without sop.approve and never writes", async () => {
    const { approveSopVersion } = await import("@/server/services/sop-workflow");
    const before = fs.readFileSync(path.join(contentDir, "registry/sops/sop-101-1.yaml"), "utf8");
    const r = approveSopVersion(identity(["employee", "reviewer"]), "sop-101-1", "imported.1", "ok");
    expect(r.ok).toBe(false);
    expect(fs.readFileSync(path.join(contentDir, "registry/sops/sop-101-1.yaml"), "utf8")).toBe(before);
  });
  it("approves a version in review, sets it effective and records evidence", async () => {
    const { approveSopVersion } = await import("@/server/services/sop-workflow");
    const { getRepositories } = await import("@/server/repositories");
    const r = approveSopVersion(identity(["employee", "approver"]), "sop-101-1", "imported.1", "Verified against the finance process.");
    expect(r.ok).toBe(true);
    const sop = getRepositories().sops.get("sop-101-1")!;
    expect(sop.effectiveVersion).toBe("imported.1");
    const v = sop.versions.find((x) => x.version === "imported.1")!;
    expect(v.status).toBe("approved");
    expect(v.approval?.approvedBy).toBe("test@cloudpoint.local");
    expect(sop.provenance?.locked).toBe(true);
  });
  it("refuses to approve an already-approved version and supersedes on re-approval of a newer one", async () => {
    const { approveSopVersion, sendBackSopVersion, submitSopVersion } = await import("@/server/services/sop-workflow");
    expect(approveSopVersion(identity(["employee", "approver"]), "sop-101-1", "imported.1", "").ok).toBe(false);
    // two-version SOP: send one back, then approve the other
    const back = sendBackSopVersion(identity(["employee", "reviewer"]), "sop-105-2", "imported.1", "Duplicate of imported.2 — confirm which is current.");
    expect(back.ok).toBe(true);
    expect(sendBackSopVersion(identity(["employee", "reviewer"]), "sop-105-2", "imported.2", "").ok).toBe(false); // note required
    expect(approveSopVersion(identity(["employee", "approver"]), "sop-105-2", "imported.2", "Current").ok).toBe(true);
    expect(submitSopVersion(identity(["employee", "contributor"]), "sop-105-2", "imported.1").ok).toBe(true);
  });
});

describe("SOP upload workflow", () => {
  it("rejects wrong file types and unauthorized users", async () => {
    const { uploadSopDocument } = await import("@/server/services/sop-workflow");
    const bytes = Buffer.from("hello");
    expect((await uploadSopDocument(identity(["employee"]), { fileName: "x.docx", bytes, title: "X", owningTeam: "company-wide" })).ok).toBe(false);
    expect((await uploadSopDocument(identity(["employee", "contributor"]), { fileName: "x.exe", bytes, title: "X", owningTeam: "company-wide" })).ok).toBe(false);
    expect((await uploadSopDocument(identity(["employee", "contributor"]), { fileName: "x.docx", bytes, title: "X", owningTeam: "nope" })).ok).toBe(false);
  });
  it("stores a real document under source-documents/uploads, indexes it and creates a draft SOP", async () => {
    const { uploadSopDocument } = await import("@/server/services/sop-workflow");
    const { getRepositories } = await import("@/server/repositories");
    const { buildKnowledgeIndex } = await import("@/server/services/knowledge-index");
    const { LexicalSearchProvider } = await import("@/server/search/lexical");
    const bytes = fs.readFileSync(path.resolve(__dirname, "../../source-documents/sop/223- Project Reference Creation and Updates.docx"));
    const r = await uploadSopDocument(identity(["employee", "contributor"]), { fileName: "301.1 - Test Upload.docx", bytes, title: "301.1 - Test Upload", sopNumber: "301.1", owningTeam: "technical-gis", summary: "Upload test", submitForReview: true });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(fs.existsSync(path.join(sourceDir, "uploads", String(new Date().getFullYear()), "301.1 - Test Upload.docx"))).toBe(true);
    const sop = getRepositories().sops.get(r.sopId)!;
    expect(sop.versions[0].status).toBe("review");
    expect(sop.effectiveVersion).toBeUndefined();
    const content = getRepositories().sops.importedContent(sop.versions[0].importedContentId!)!;
    expect(content.chunks.length).toBeGreaterThan(0);
    const hits = await new LexicalSearchProvider([]).search({ q: "project reference" }, buildKnowledgeIndex(getRepositories()));
    expect(hits.some((h) => h.item.ref.id === r.sopId)).toBe(true);
  });
});
