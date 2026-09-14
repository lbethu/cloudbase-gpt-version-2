import "server-only";
import path from "node:path";
import { Sop, type SopVersion } from "@/domain";
import type { Identity } from "@/server/auth/identity";
import { can, canRead } from "@/server/authz";
import { ensureRepositories, getRepositories } from "@/server/repositories";
import { getRegistryWriter } from "@/server/repositories/writer";
import { getBlobStorage } from "@/server/storage/blob";
import { recordAudit } from "./audit";
import { extractAndIndex, slug } from "./extraction";

/**
 * Governed SOP write workflows — the only code that mutates SOP registry files.
 *
 *   author  (sop.author)   upload a document → new SOP or new version, status DRAFT
 *   submit  (sop.author)   DRAFT → REVIEW
 *   approve (sop.approve)  REVIEW → APPROVED, becomes the effective version;
 *                          any previously approved version → SUPERSEDED
 *   sendBack(sop.review)   REVIEW → DRAFT with a note
 *
 * Every transition is validated against the schema, written atomically, audited,
 * and locks the record against the legacy importer. AI never calls these.
 */

export type WorkflowResult = { ok: true; sopId: string; version: string; message: string } | { ok: false; status: 400 | 403 | 404 | 409; error: string };

const today = () => new Date().toISOString().slice(0, 10);

function readSop(id: string) {
  const sop = getRepositories().sops.get(id);
  return sop ? { sop: Sop.parse(structuredClone(sop)) } : null;
}

/** Validates, persists through the active storage (file YAML or Postgres) and refreshes the read model. */
async function writeSop(sop: ReturnType<typeof Sop.parse>, actor: string) {
  const validated = Sop.parse(sop); // fail loudly before touching storage
  const effective = validated.versions.find((v) => v.version === validated.effectiveVersion) ?? validated.versions[validated.versions.length - 1];
  await getRegistryWriter().upsertRecord("sop", { id: validated.id, title: validated.title, owningTeam: validated.owningTeam, classification: validated.classification, status: effective.status, data: validated as unknown as Record<string, unknown> }, actor);
  // Refresh the read model immediately: an approver acting straight after a
  // submit must see the version they just moved, not the previous snapshot.
  await ensureRepositories();
}

type Loaded = { ok: true; sop: ReturnType<typeof Sop.parse> };
type Failure = Extract<WorkflowResult, { ok: false }>;

async function guard(identity: Identity, permission: Parameters<typeof can>[1], sopId: string): Promise<Loaded | Failure> {
  if (!can(identity, permission)) {
    await recordAudit({ actor: identity.subject, action: permission, target: { type: "sop", id: sopId }, outcome: "denied", detail: { reason: "not-granted" } });
    return { ok: false, status: 403, error: `${permission} is required.` };
  }
  const loaded = readSop(sopId);
  if (!loaded || !canRead(identity, { type: "sop", classification: loaded.sop.classification, owningTeam: loaded.sop.owningTeam, teams: loaded.sop.teams, accessGrants: loaded.sop.accessGrants })) {
    return { ok: false, status: 404, error: "SOP not found." };
  }
  return { ok: true, ...loaded };
}

export async function approveSopVersion(identity: Identity, sopId: string, version: string, note: string): Promise<WorkflowResult> {
  const g = await guard(identity, "sop.approve", sopId);
  if (!g.ok) return g;
  const target = g.sop.versions.find((v) => v.version === version);
  if (!target) return { ok: false, status: 404, error: "Version not found." };
  if (target.status !== "review") return { ok: false, status: 409, error: `Only versions in review can be approved (this one is ${target.status}).` };
  for (const v of g.sop.versions) if (v.status === "approved") v.status = "superseded";
  target.status = "approved";
  target.approval = { approvedBy: identity.email || identity.subject, approvedAt: today(), note: note.trim() };
  target.effectiveDate = target.effectiveDate ?? today();
  target.reviewedAt = today();
  g.sop.effectiveVersion = version;
  g.sop.lastReviewedAt = today();
  g.sop.updatedAt = today();
  g.sop.version = version;
  if (g.sop.provenance) g.sop.provenance.locked = true;
  await writeSop(g.sop, identity.subject);
  await recordAudit({ actor: identity.subject, action: "sop.approve", target: { type: "sop", id: sopId }, outcome: "allowed", detail: { version, note: note.slice(0, 200) } });
  return { ok: true, sopId, version, message: `Version ${version} approved and set as the effective version.` };
}

export async function sendBackSopVersion(identity: Identity, sopId: string, version: string, note: string): Promise<WorkflowResult> {
  const g = await guard(identity, "sop.review", sopId);
  if (!g.ok) return g;
  const target = g.sop.versions.find((v) => v.version === version);
  if (!target) return { ok: false, status: 404, error: "Version not found." };
  if (target.status !== "review") return { ok: false, status: 409, error: `Only versions in review can be sent back (this one is ${target.status}).` };
  if (!note.trim()) return { ok: false, status: 400, error: "A note explaining what must change is required." };
  target.status = "draft";
  target.changeSummary = `${target.changeSummary ? target.changeSummary + " " : ""}[Sent back ${today()} by ${identity.email || identity.subject}: ${note.trim()}]`;
  g.sop.updatedAt = today();
  if (g.sop.provenance) g.sop.provenance.locked = true;
  await writeSop(g.sop, identity.subject);
  await recordAudit({ actor: identity.subject, action: "sop.send-back", target: { type: "sop", id: sopId }, outcome: "allowed", detail: { version, note: note.slice(0, 200) } });
  return { ok: true, sopId, version, message: `Version ${version} sent back to draft.` };
}

export async function submitSopVersion(identity: Identity, sopId: string, version: string): Promise<WorkflowResult> {
  const g = await guard(identity, "sop.author", sopId);
  if (!g.ok) return g;
  const target = g.sop.versions.find((v) => v.version === version);
  if (!target) return { ok: false, status: 404, error: "Version not found." };
  if (target.status !== "draft") return { ok: false, status: 409, error: `Only drafts can be submitted (this one is ${target.status}).` };
  target.status = "review";
  g.sop.updatedAt = today();
  if (g.sop.provenance) g.sop.provenance.locked = true;
  await writeSop(g.sop, identity.subject);
  await recordAudit({ actor: identity.subject, action: "sop.submit", target: { type: "sop", id: sopId }, outcome: "allowed", detail: { version } });
  return { ok: true, sopId, version, message: `Version ${version} submitted for review.` };
}

/**
 * Retires an SOP: every version becomes `historical`, no version stays
 * effective, and it leaves search and the library. The record and its whole
 * history stay in the registry, so an audit can still answer "what did this
 * say, and who withdrew it". Reversible by approving a version again.
 */
export async function retireSop(identity: Identity, sopId: string, reason: string): Promise<WorkflowResult> {
  const g = await guard(identity, "sop.retire", sopId);
  if (!g.ok) return g;
  if (!reason.trim()) return { ok: false, status: 400, error: "A reason for retiring this SOP is required." };
  if (g.sop.versions.every((v) => v.status === "historical")) return { ok: false, status: 409, error: "This SOP is already retired." };
  for (const v of g.sop.versions) v.status = "historical";
  g.sop.effectiveVersion = undefined;
  g.sop.updatedAt = today();
  if (g.sop.provenance) g.sop.provenance.locked = true;
  await writeSop(g.sop, identity.subject);
  await recordAudit({ actor: identity.subject, action: "sop.retire", target: { type: "sop", id: sopId }, outcome: "allowed", detail: { title: g.sop.title, reason: reason.slice(0, 300) } });
  return { ok: true, sopId, version: g.sop.version, message: `${g.sop.title} retired. It no longer appears in the library or in search.` };
}

/**
 * Permanently deletes an SOP — the record, its extracted text and the stored
 * document. For genuine mistakes (a wrong file, a duplicate, a test upload),
 * not for withdrawing guidance: retiring is what preserves history, and this
 * destroys it. Admin-only, a reason is required, and the audit entry survives
 * the record so the deletion itself is never invisible.
 */
export async function deleteSop(identity: Identity, sopId: string, reason: string): Promise<WorkflowResult> {
  const g = await guard(identity, "sop.delete", sopId);
  if (!g.ok) return g;
  if (reason.trim().length < 5) return { ok: false, status: 400, error: "A reason of at least 5 characters is required to delete an SOP." };

  const writer = getRegistryWriter();
  const storage = getBlobStorage();
  const removedFiles: string[] = [];
  const removedContent: string[] = [];

  for (const version of g.sop.versions) {
    if (version.importedContentId) {
      await writer.deleteImportedContent(version.importedContentId);
      removedContent.push(version.importedContentId);
    }
    const file = version.sourceFile;
    // Only documents uploaded through CloudBase are removed from storage. The
    // originals that came with the repository are shared source material and
    // are never destroyed by deleting a record that points at them.
    if (file && file.path.startsWith("uploads/")) {
      await storage.remove(file.path);
      await writer.deleteSourceFile(file.id);
      removedFiles.push(file.path);
    }
  }
  await writer.deleteRecord("sop", sopId, identity.subject);
  await ensureRepositories();

  await recordAudit({
    actor: identity.subject,
    action: "sop.delete",
    target: { type: "sop", id: sopId },
    outcome: "allowed",
    detail: { title: g.sop.title, sopNumber: g.sop.sopNumber, owningTeam: g.sop.owningTeam, versions: g.sop.versions.length, removedFiles, removedContent, reason: reason.slice(0, 300) },
  });
  return { ok: true, sopId, version: g.sop.version, message: `${g.sop.title} deleted permanently${removedFiles.length ? ` (${removedFiles.length} uploaded document${removedFiles.length === 1 ? "" : "s"} removed from storage)` : ""}.` };
}

export interface UploadInput {
  fileName: string;
  bytes: Buffer;
  title: string;
  sopNumber?: string;
  owningTeam: string;
  category?: string;
  summary?: string;
  /** When set, the upload becomes a new version of this SOP instead of a new SOP. */
  existingSopId?: string;
  submitForReview?: boolean;
}

const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED = new Map([[".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], [".pdf", "application/pdf"]]);

/**
 * Uploads a governed source document. The file is stored under
 * source-documents/uploads/<year>/ (never under /public), extracted and
 * indexed immediately, and registered as a DRAFT version. Nothing is approved.
 */
export async function uploadSopDocument(identity: Identity, input: UploadInput): Promise<WorkflowResult> {
  if (!can(identity, "sop.author")) {
    await recordAudit({ actor: identity.subject, action: "sop.upload", outcome: "denied", detail: { reason: "not-granted" } });
    return { ok: false, status: 403, error: "sop.author is required to upload documents." };
  }
  const ext = path.extname(input.fileName).toLowerCase();
  const mediaType = ALLOWED.get(ext);
  if (!mediaType) return { ok: false, status: 400, error: "Only .docx and .pdf files are accepted." };
  if (!input.bytes.length || input.bytes.length > MAX_BYTES) return { ok: false, status: 400, error: "File must be between 1 byte and 25 MB." };
  if (!input.title.trim()) return { ok: false, status: 400, error: "Title is required." };
  const repos = getRepositories();
  if (!repos.teams.get(input.owningTeam)) return { ok: false, status: 400, error: "Unknown team." };

  const storage = getBlobStorage();
  const year = new Date().getFullYear();
  const safeBase = path.basename(input.fileName, ext).replace(/[^A-Za-z0-9 ._()&-]+/g, "").trim().slice(0, 120) || "document";
  let relPath = `uploads/${year}/${safeBase}${ext}`;
  let n = 2;
  while (await storage.exists(relPath)) relPath = `uploads/${year}/${safeBase} (${n++})${ext}`;

  let content;
  try {
    content = await extractAndIndex(relPath, input.bytes);
  } catch (error) {
    return { ok: false, status: 400, error: `The file could not be read: ${error instanceof Error ? error.message : "extraction failed"}` };
  }
  await storage.put(relPath, input.bytes, mediaType);
  const fileId = `file-${slug(relPath)}`;
  await getRegistryWriter().registerSourceFile({ id: fileId, path: relPath, mediaType, label: path.basename(relPath), storage: storage.name, storageKey: relPath, bytes: input.bytes.length, uploadedBy: identity.subject });

  const status: SopVersion["status"] = input.submitForReview ? "review" : "draft";
  const existing = input.existingSopId ? readSop(input.existingSopId) : null;
  if (input.existingSopId && !existing) return { ok: false, status: 404, error: "Existing SOP not found." };

  if (existing) {
    const nextNumber = existing.sop.versions.length + 1;
    const version = `${nextNumber}.0`;
    existing.sop.versions.push({ version, status, changeSummary: `Uploaded by ${identity.email || identity.subject} on ${today()}.`, importedContentId: content.id, sourceFile: { id: fileId, path: relPath, mediaType, label: path.basename(relPath) }, purpose: input.summary ?? "", prerequisites: [], procedure: [], verification: [], warnings: [], references: [] });
    existing.sop.updatedAt = today();
    if (existing.sop.provenance) existing.sop.provenance.locked = true;
    await writeSop(existing.sop, identity.subject);
    await recordAudit({ actor: identity.subject, action: "sop.upload", target: { type: "sop", id: existing.sop.id }, outcome: "allowed", detail: { version, path: relPath, bytes: input.bytes.length } });
    return { ok: true, sopId: existing.sop.id, version, message: `Uploaded as version ${version} (${status}).` };
  }

  const baseId = input.sopNumber?.trim() ? `sop-${slug(input.sopNumber)}` : `sop-${slug(input.title)}`;
  let id = baseId;
  let k = 2;
  while (repos.sops.get(id)) id = `${baseId}-${k++}`;
  const sop = Sop.parse({
    id,
    title: input.title.trim(),
    sopNumber: input.sopNumber?.trim() ?? "",
    kind: /checklist/i.test(input.title) ? "checklist" : "sop",
    category: input.category?.trim() || "General",
    summary: input.summary?.trim() ?? "",
    owningTeam: input.owningTeam,
    owner: identity.email || identity.subject,
    version: "1.0",
    createdAt: today(),
    updatedAt: today(),
    versions: [{ version: "1.0", status, changeSummary: `Uploaded by ${identity.email || identity.subject} on ${today()}.`, importedContentId: content.id, sourceFile: { id: fileId, path: relPath, mediaType, label: path.basename(relPath) }, purpose: input.summary ?? "" }],
    provenance: { importedFrom: `uploaded in CloudBase by ${identity.email || identity.subject}`, importedAt: today(), note: "Uploaded through the governed workflow. Awaiting review and approval.", locked: true },
  });
  await writeSop(sop, identity.subject);
  await recordAudit({ actor: identity.subject, action: "sop.upload", target: { type: "sop", id }, outcome: "allowed", detail: { version: "1.0", path: relPath, bytes: input.bytes.length } });
  return { ok: true, sopId: id, version: "1.0", message: `Created ${id} as version 1.0 (${status}).` };
}
