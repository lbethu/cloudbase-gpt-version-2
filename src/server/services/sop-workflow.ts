import "server-only";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { Sop, type SopVersion } from "@/domain";
import type { Identity } from "@/server/auth/identity";
import { can, canRead } from "@/server/authz";
import { getConfig } from "@/server/config";
import { getRepositories } from "@/server/repositories";
import { clearRegistryCache } from "@/server/repositories/registry";
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
const sopFile = (id: string) => path.join(getConfig().contentDir, "registry", "sops", `${id}.yaml`);

function readSop(id: string) {
  const file = sopFile(id);
  if (!fs.existsSync(file)) return null;
  return { file, sop: Sop.parse(YAML.parse(fs.readFileSync(file, "utf8"))) };
}

function writeSop(file: string, sop: ReturnType<typeof Sop.parse>) {
  const validated = Sop.parse(sop); // fail loudly before touching disk
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, YAML.stringify(validated, { lineWidth: 0 }));
  fs.renameSync(tmp, file);
  clearRegistryCache();
}

type Loaded = { ok: true; file: string; sop: ReturnType<typeof Sop.parse> };
type Failure = Extract<WorkflowResult, { ok: false }>;

function guard(identity: Identity, permission: Parameters<typeof can>[1], sopId: string): Loaded | Failure {
  if (!can(identity, permission)) {
    recordAudit({ actor: identity.subject, action: `sop.${permission}`, target: { type: "sop", id: sopId }, outcome: "denied", detail: { reason: "not-granted" } });
    return { ok: false, status: 403, error: `${permission} is required.` };
  }
  const loaded = readSop(sopId);
  if (!loaded || !canRead(identity, { type: "sop", classification: loaded.sop.classification, owningTeam: loaded.sop.owningTeam, teams: loaded.sop.teams, accessGrants: loaded.sop.accessGrants })) {
    return { ok: false, status: 404, error: "SOP not found." };
  }
  return { ok: true, ...loaded };
}

export function approveSopVersion(identity: Identity, sopId: string, version: string, note: string): WorkflowResult {
  const g = guard(identity, "sop.approve", sopId);
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
  writeSop(g.file, g.sop);
  recordAudit({ actor: identity.subject, action: "sop.approve", target: { type: "sop", id: sopId }, outcome: "allowed", detail: { version, note: note.slice(0, 200) } });
  return { ok: true, sopId, version, message: `Version ${version} approved and set as the effective version.` };
}

export function sendBackSopVersion(identity: Identity, sopId: string, version: string, note: string): WorkflowResult {
  const g = guard(identity, "sop.review", sopId);
  if (!g.ok) return g;
  const target = g.sop.versions.find((v) => v.version === version);
  if (!target) return { ok: false, status: 404, error: "Version not found." };
  if (target.status !== "review") return { ok: false, status: 409, error: `Only versions in review can be sent back (this one is ${target.status}).` };
  if (!note.trim()) return { ok: false, status: 400, error: "A note explaining what must change is required." };
  target.status = "draft";
  target.changeSummary = `${target.changeSummary ? target.changeSummary + " " : ""}[Sent back ${today()} by ${identity.email || identity.subject}: ${note.trim()}]`;
  g.sop.updatedAt = today();
  if (g.sop.provenance) g.sop.provenance.locked = true;
  writeSop(g.file, g.sop);
  recordAudit({ actor: identity.subject, action: "sop.send-back", target: { type: "sop", id: sopId }, outcome: "allowed", detail: { version, note: note.slice(0, 200) } });
  return { ok: true, sopId, version, message: `Version ${version} sent back to draft.` };
}

export function submitSopVersion(identity: Identity, sopId: string, version: string): WorkflowResult {
  const g = guard(identity, "sop.author", sopId);
  if (!g.ok) return g;
  const target = g.sop.versions.find((v) => v.version === version);
  if (!target) return { ok: false, status: 404, error: "Version not found." };
  if (target.status !== "draft") return { ok: false, status: 409, error: `Only drafts can be submitted (this one is ${target.status}).` };
  target.status = "review";
  g.sop.updatedAt = today();
  if (g.sop.provenance) g.sop.provenance.locked = true;
  writeSop(g.file, g.sop);
  recordAudit({ actor: identity.subject, action: "sop.submit", target: { type: "sop", id: sopId }, outcome: "allowed", detail: { version } });
  return { ok: true, sopId, version, message: `Version ${version} submitted for review.` };
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
    recordAudit({ actor: identity.subject, action: "sop.upload", outcome: "denied", detail: { reason: "not-granted" } });
    return { ok: false, status: 403, error: "sop.author is required to upload documents." };
  }
  const ext = path.extname(input.fileName).toLowerCase();
  const mediaType = ALLOWED.get(ext);
  if (!mediaType) return { ok: false, status: 400, error: "Only .docx and .pdf files are accepted." };
  if (!input.bytes.length || input.bytes.length > MAX_BYTES) return { ok: false, status: 400, error: "File must be between 1 byte and 25 MB." };
  if (!input.title.trim()) return { ok: false, status: 400, error: "Title is required." };
  const repos = getRepositories();
  if (!repos.teams.get(input.owningTeam)) return { ok: false, status: 400, error: "Unknown team." };

  const cfg = getConfig();
  const year = new Date().getFullYear();
  const safeBase = path.basename(input.fileName, ext).replace(/[^A-Za-z0-9 ._()&-]+/g, "").trim().slice(0, 120) || "document";
  let relPath = `uploads/${year}/${safeBase}${ext}`;
  let n = 2;
  while (fs.existsSync(path.join(cfg.sourceDocumentsDir, relPath))) relPath = `uploads/${year}/${safeBase} (${n++})${ext}`;
  const absPath = path.join(cfg.sourceDocumentsDir, relPath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, input.bytes);

  let content;
  try {
    content = await extractAndIndex(relPath);
  } catch (error) {
    fs.rmSync(absPath, { force: true });
    return { ok: false, status: 400, error: `The file could not be read: ${error instanceof Error ? error.message : "extraction failed"}` };
  }

  const status: SopVersion["status"] = input.submitForReview ? "review" : "draft";
  const existing = input.existingSopId ? readSop(input.existingSopId) : null;
  if (input.existingSopId && !existing) return { ok: false, status: 404, error: "Existing SOP not found." };

  if (existing) {
    const nextNumber = existing.sop.versions.length + 1;
    const version = `${nextNumber}.0`;
    existing.sop.versions.push({ version, status, changeSummary: `Uploaded by ${identity.email || identity.subject} on ${today()}.`, importedContentId: content.id, sourceFile: { id: `file-${slug(relPath)}`, path: relPath, mediaType, label: path.basename(relPath) }, purpose: input.summary ?? "", prerequisites: [], procedure: [], verification: [], warnings: [], references: [] });
    existing.sop.updatedAt = today();
    if (existing.sop.provenance) existing.sop.provenance.locked = true;
    writeSop(existing.file, existing.sop);
    recordAudit({ actor: identity.subject, action: "sop.upload", target: { type: "sop", id: existing.sop.id }, outcome: "allowed", detail: { version, path: relPath, bytes: input.bytes.length } });
    return { ok: true, sopId: existing.sop.id, version, message: `Uploaded as version ${version} (${status}).` };
  }

  const baseId = input.sopNumber?.trim() ? `sop-${slug(input.sopNumber)}` : `sop-${slug(input.title)}`;
  let id = baseId;
  let k = 2;
  while (fs.existsSync(sopFile(id))) id = `${baseId}-${k++}`;
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
    versions: [{ version: "1.0", status, changeSummary: `Uploaded by ${identity.email || identity.subject} on ${today()}.`, importedContentId: content.id, sourceFile: { id: `file-${slug(relPath)}`, path: relPath, mediaType, label: path.basename(relPath) }, purpose: input.summary ?? "" }],
    provenance: { importedFrom: `uploaded in CloudBase by ${identity.email || identity.subject}`, importedAt: today(), note: "Uploaded through the governed workflow. Awaiting review and approval.", locked: true },
  });
  writeSop(sopFile(id), sop);
  recordAudit({ actor: identity.subject, action: "sop.upload", target: { type: "sop", id }, outcome: "allowed", detail: { version: "1.0", path: relPath, bytes: input.bytes.length } });
  return { ok: true, sopId: id, version: "1.0", message: `Created ${id} as version 1.0 (${status}).` };
}
