import { z } from "zod";

/**
 * Shared primitives for every governed CloudBase entity.
 *
 * Business identifiers (e.g. `CP-RND-001`, `CAP-004`, `sop-101-1`) are stable,
 * human-readable and unique per collection. A `uuid` is optional today and
 * becomes mandatory when the registry is migrated to PostgreSQL.
 */

export const BusinessId = z
  .string()
  .min(2)
  .max(120)
  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, "ids may contain letters, digits, '.', '_' and '-'");

export const Uuid = z.string().uuid();

export const IsoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected an ISO date (YYYY-MM-DD)");

/** Lifecycle shared by knowledge objects. SOPs use the stricter `SopLifecycle`. */
export const Lifecycle = z.enum(["draft", "review", "published", "superseded", "archived"]);
export type Lifecycle = z.infer<typeof Lifecycle>;

/** Governed SOP lifecycle — must not be flattened. */
export const SopLifecycle = z.enum(["draft", "review", "approved", "superseded", "historical"]);
export type SopLifecycle = z.infer<typeof SopLifecycle>;

/**
 * Information classification drives authorization:
 *  - internal:      any authenticated employee
 *  - confidential:  members of the owning team(s) or explicit grants
 *  - restricted:    explicit grants only
 */
export const Classification = z.enum(["internal", "confidential", "restricted"]);
export type Classification = z.infer<typeof Classification>;

export const TeamRef = z.string().min(1);

export const ExternalLink = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});
export type ExternalLink = z.infer<typeof ExternalLink>;

/** Fields every first-class knowledge object carries. */
export const GovernedBase = z.object({
  id: BusinessId,
  uuid: Uuid.optional(),
  title: z.string().min(1),
  summary: z.string().default(""),
  owningTeam: TeamRef,
  /** Additional teams that share this object (no duplication of the record). */
  teams: z.array(TeamRef).default([]),
  owner: z.string().default(""),
  classification: Classification.default("internal"),
  /** Identity subjects with explicit access (required for `restricted`, optional for `confidential`). */
  accessGrants: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  createdAt: IsoDate.optional(),
  updatedAt: IsoDate.optional(),
  lastReviewedAt: IsoDate.optional(),
  version: z.string().default("0.1"),
  /** Source repositories (GitHub) that implement or document this object. */
  repositories: z.array(z.object({ provider: z.literal("github").default("github"), owner: z.string().min(1), repo: z.string().min(1), path: z.string().optional(), label: z.string().optional() })).default([]),
});
export type GovernedBase = z.infer<typeof GovernedBase>;

/**
 * Every searchable/linkable object has one of these types. The value is shown
 * as the type badge in search results and on detail pages.
 */
export const ContentType = z.enum([
  "sop",
  "documentation",
  "research",
  "rnd-project",
  "capability",
  "capability-cluster",
  "evaluation",
  "evidence",
  "experiment",
  "decision",
  "idea",
  "copilot",
  "automation",
  "project-reference",
  "rfp",
  "team",
  "policy",
  "account",
  "contact",
  "opportunity",
  "agent",
  "solution",
]);
export type ContentType = z.infer<typeof ContentType>;

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  sop: "SOP",
  documentation: "Documentation",
  research: "Research",
  "rnd-project": "R&D",
  capability: "Capability",
  "capability-cluster": "Capability Cluster",
  evaluation: "Evaluation",
  evidence: "Evidence",
  experiment: "Experiment",
  decision: "Decision",
  idea: "Idea",
  copilot: "Copilot",
  automation: "Automation",
  "project-reference": "Project Reference",
  rfp: "RFP",
  team: "Team",
  policy: "Policy",
  account: "Account",
  contact: "Contact",
  opportunity: "Opportunity",
  agent: "Agent",
  solution: "Solution",
};

/** A reference to any governed object, used by relationships, citations and search. */
export const ContentRef = z.object({
  type: ContentType,
  id: BusinessId,
});
export type ContentRef = z.infer<typeof ContentRef>;

export const refKey = (ref: ContentRef) => `${ref.type}:${ref.id}`;
