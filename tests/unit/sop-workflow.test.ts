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
    const r = await approveSopVersion(identity(["employee", "reviewer"]), "sop-101-1", "imported.1", "ok");
    expect(r.ok).toBe(false);
    expect(fs.readFileSync(path.join(contentDir, "registry/sops/sop-101-1.yaml"), "utf8")).toBe(before);
  });
  it("approves a version in review, sets it effective and records evidence", async () => {
    const { approveSopVersion } = await import("@/server/services/sop-workflow");
    const { getRepositories } = await import("@/server/repositories");
    const r = await approveSopVersion(identity(["employee", "approver"]), "sop-101-1", "imported.1", "Verified against the finance process.");
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
    expect((await approveSopVersion(identity(["employee", "approver"]), "sop-101-1", "imported.1", "")).ok).toBe(false);
    // two-version SOP: send one back, then approve the other
    const back = await sendBackSopVersion(identity(["employee", "reviewer"]), "sop-105-2", "imported.1", "Duplicate of imported.2 — confirm which is current.");
    expect(back.ok).toBe(true);
    expect((await sendBackSopVersion(identity(["employee", "reviewer"]), "sop-105-2", "imported.2", "")).ok).toBe(false); // note required
    expect((await approveSopVersion(identity(["employee", "approver"]), "sop-105-2", "imported.2", "Current")).ok).toBe(true);
    expect((await submitSopVersion(identity(["employee", "contributor"]), "sop-105-2", "imported.1")).ok).toBe(true);
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

describe("removing an SOP", () => {
  it("refuses to retire without sop.retire, and requires a reason", async () => {
    const { retireSop } = await import("@/server/services/sop-workflow");
    expect((await retireSop(identity(["employee", "contributor"]), "sop-101-2", "wrong")).ok).toBe(false);
    expect((await retireSop(identity(["employee", "approver"]), "sop-101-2", "  ")).ok).toBe(false);
  });

  it("retires an SOP, keeps its history and drops it from the index", async () => {
    const { retireSop } = await import("@/server/services/sop-workflow");
    const { getRepositories } = await import("@/server/repositories");
    const { buildKnowledgeIndex } = await import("@/server/services/knowledge-index");
    const before = buildKnowledgeIndex(getRepositories()).filter((i) => i.ref.id === "sop-101-2").length;
    expect(before).toBe(1);

    const r = await retireSop(identity(["employee", "approver"]), "sop-101-2", "Superseded by the new finance process.");
    expect(r.ok).toBe(true);

    const sop = getRepositories().sops.get("sop-101-2")!;
    expect(sop.versions.every((v) => v.status === "historical")).toBe(true);
    expect(sop.effectiveVersion).toBeUndefined();
    expect(sop.versions.length).toBeGreaterThan(0); // history preserved
    expect(buildKnowledgeIndex(getRepositories()).filter((i) => i.ref.id === "sop-101-2").length).toBe(0);
    expect((await retireSop(identity(["employee", "approver"]), "sop-101-2", "again")).ok).toBe(false); // already retired
  });

  it("only an admin may delete, and a real reason is required", async () => {
    const { deleteSop } = await import("@/server/services/sop-workflow");
    expect((await deleteSop(identity(["employee", "approver"]), "sop-103-1", "wrong file")).ok).toBe(false);
    expect((await deleteSop(identity(["employee", "admin"]), "sop-103-1", "oops")).ok).toBe(false); // too short
    const { getRepositories } = await import("@/server/repositories");
    expect(getRepositories().sops.get("sop-103-1")).toBeTruthy(); // nothing removed by the refusals
  });

  it("deletes the record and its extracted text, but never the original repository document", async () => {
    const { uploadSopDocument, deleteSop } = await import("@/server/services/sop-workflow");
    const { getRepositories } = await import("@/server/repositories");
    const bytes = fs.readFileSync(path.resolve(__dirname, "../../source-documents/sop/223- Project Reference Creation and Updates.docx"));
    const up = await uploadSopDocument(identity(["employee", "contributor"]), { fileName: "901 - Delete Me.docx", bytes, title: "901 - Delete Me", owningTeam: "company-wide" });
    expect(up.ok).toBe(true);
    if (!up.ok) return;

    const sop = getRepositories().sops.get(up.sopId)!;
    const uploaded = path.join(sourceDir, sop.versions[0].sourceFile!.path);
    const contentId = sop.versions[0].importedContentId!;
    expect(fs.existsSync(uploaded)).toBe(true);

    const r = await deleteSop(identity(["employee", "admin"]), up.sopId, "Duplicate upload during testing.");
    expect(r.ok).toBe(true);
    expect(getRepositories().sops.get(up.sopId)).toBeUndefined();
    expect(getRepositories().sops.importedContent(contentId)).toBeUndefined();
    expect(fs.existsSync(uploaded)).toBe(false); // the uploaded copy is gone
    expect(fs.existsSync(path.resolve(__dirname, "../../source-documents/sop/223- Project Reference Creation and Updates.docx"))).toBe(true); // the original is untouched
  });

  it("records the deletion in the audit log, which outlives the record", async () => {
    const { listAuditEvents } = await import("@/server/services/audit");
    const events = await listAuditEvents(100);
    const deletion = events.find((e) => e.action === "sop.delete");
    expect(deletion?.outcome).toBe("allowed");
    expect(deletion?.detail?.reason).toContain("Duplicate upload");
    expect(events.some((e) => e.action === "sop.retire")).toBe(true);
  });
});

describe("hosted deployment guards", () => {
  /**
   * On a serverless host the filesystem is read-only or disposable. Writing
   * there either fails with an unreadable EROFS or, worse, appears to succeed
   * and vanishes on the next deploy — so a production deployment that has not
   * been pointed at a database and a bucket must refuse the upload and say
   * which setting is missing.
   */
  it("refuses uploads in production when storage would hit the filesystem", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { resetConfigForTests } = await import("@/server/config");
    resetConfigForTests();
    const { uploadSopDocument } = await import("@/server/services/sop-workflow");
    const bytes = fs.readFileSync(path.resolve(__dirname, "../../source-documents/sop/223- Project Reference Creation and Updates.docx"));
    const r = await uploadSopDocument(identity(["employee", "contributor"]), { fileName: "x.docx", bytes, title: "Hosted guard", owningTeam: "company-wide" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toMatch(/CLOUDBASE_STORAGE=postgres/);
      expect(r.error).toMatch(/CLOUDBASE_BLOB_STORAGE=s3/);
    }
    vi.stubEnv("NODE_ENV", "test");
    resetConfigForTests();
  });

  it("honours a platform upload cap smaller than the app default", async () => {
    vi.stubEnv("CLOUDBASE_MAX_UPLOAD_MB", "1");
    const { resetConfigForTests, getConfig } = await import("@/server/config");
    resetConfigForTests();
    expect(getConfig().maxUploadMb).toBe(1);
    vi.unstubAllEnvs();
    resetConfigForTests();
  });
});
