import { z } from "zod";
import { BusinessId, GovernedBase, IsoDate, SopLifecycle } from "./common";

/**
 * Governed SOP model.
 *
 * An `Sop` is the stable registry entry (number, title, owner). Each `SopVersion`
 * is immutable once approved; the SOP's `effectiveVersion` points at the version
 * currently in force. History is never overwritten — a new version is added and
 * the previous one becomes `superseded`/`historical`.
 */

export const ApprovalEvidence = z.object({
  approvedBy: z.string().min(1),
  approvedAt: IsoDate,
  note: z.string().default(""),
});
export type ApprovalEvidence = z.infer<typeof ApprovalEvidence>;

export const ProcedureStep = z.object({
  step: z.string().min(1),
  detail: z.string().default(""),
  warning: z.string().optional(),
});

/** Pointer to a protected source file. Files are served only through the authorized file route. */
export const SourceFile = z.object({
  id: BusinessId,
  /** Path relative to `source-documents/` (validated; no traversal). */
  path: z.string().min(1),
  mediaType: z.string().default("application/octet-stream"),
  label: z.string().default(""),
  /** Google Drive location of the same document (webViewLink). Resolved automatically when Drive is connected. */
  driveUrl: z.string().url().optional(),
  driveFileId: z.string().optional(),
});
export type SourceFile = z.infer<typeof SourceFile>;

export const SopVersion = z.object({
  version: z.string().min(1),
  status: SopLifecycle,
  effectiveDate: IsoDate.optional(),
  reviewedAt: IsoDate.optional(),
  changeSummary: z.string().default(""),
  /** Id of the imported content record (extracted sections/chunks) if any. */
  importedContentId: z.string().optional(),
  sourceFile: SourceFile.optional(),
  approval: ApprovalEvidence.optional(),
  purpose: z.string().default(""),
  prerequisites: z.array(z.string()).default([]),
  procedure: z.array(ProcedureStep).default([]),
  verification: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),
});
export type SopVersion = z.infer<typeof SopVersion>;

export const Sop = GovernedBase.extend({
  sopNumber: z.string().default(""),
  kind: z.enum(["sop", "checklist", "guide", "manual", "policy"]).default("sop"),
  category: z.string().default("General"),
  /** Version string of the version currently in force; absent = nothing approved yet. */
  effectiveVersion: z.string().optional(),
  versions: z.array(SopVersion).min(1),
  relatedSystems: z.array(z.string()).default([]),
  /** Importer provenance — which pipeline produced the record. */
  provenance: z
    .object({
      importedFrom: z.string(),
      importedAt: IsoDate.optional(),
      note: z.string().default(""),
      /** Set true after hand-editing so the importer never overwrites the record. */
      locked: z.boolean().default(false),
    })
    .optional(),
});
export type Sop = z.infer<typeof Sop>;

/** Imported, source-backed text content extracted from a governed file. */
export const ImportedContent = z.object({
  id: z.string().min(1),
  sourcePath: z.string().min(1),
  extractedAt: IsoDate.optional(),
  sections: z.array(z.object({ title: z.string(), summary: z.string().default("") })).default([]),
  chunks: z.array(
    z.object({
      id: z.string().min(1),
      section: z.string().default(""),
      content: z.string(),
      keywords: z.array(z.string()).default([]),
      page: z.number().int().positive().optional(),
    }),
  ),
  extractor: z.string().optional(),
  characterCount: z.number().int().nonnegative().optional(),
});
export type ImportedContent = z.infer<typeof ImportedContent>;

export const SOP_STATUS_LABELS: Record<SopLifecycle, string> = {
  draft: "Draft",
  review: "In review",
  approved: "Approved",
  superseded: "Superseded",
  historical: "Historical",
};
