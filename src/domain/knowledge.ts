import { z } from "zod";
import { BusinessId, ContentRef, ContentType, GovernedBase, IsoDate, Lifecycle } from "./common";

/** Technical documentation authored as markdown with frontmatter under content/docs. */
export const TechnicalDocument = GovernedBase.extend({
  status: Lifecycle.default("draft"),
  category: z.string().min(1),
  /** Documentation domain, e.g. ArcGIS, Experience Builder, CloudBase, CROS. */
  domain: z.string().min(1),
  /** Rendered later by the docs service; raw markdown is kept here. */
  body: z.string().default(""),
  references: z.array(z.string()).default([]),
  slug: z.string().min(1),
});
export type TechnicalDocument = z.infer<typeof TechnicalDocument>;

export const ResearchKind = z.enum([
  "research-proposal",
  "technical-spike",
  "tool-comparison",
  "experiment-plan",
  "architecture-decision-record",
  "research-findings",
  "failure-record",
  "vendor-evaluation",
  "feasibility-study",
  "external-research",
]);
export type ResearchKind = z.infer<typeof ResearchKind>;

export const RESEARCH_KIND_LABELS: Record<ResearchKind, string> = {
  "research-proposal": "Research Proposal",
  "technical-spike": "Technical Spike",
  "tool-comparison": "Tool Comparison",
  "experiment-plan": "Experiment Plan",
  "architecture-decision-record": "Architecture Decision Record",
  "research-findings": "Research Findings",
  "failure-record": "Failure / Limitation Record",
  "vendor-evaluation": "Vendor Evaluation",
  "feasibility-study": "Feasibility Study",
  "external-research": "External Research",
};

export const ResearchDocument = GovernedBase.extend({
  kind: ResearchKind,
  status: Lifecycle.default("draft"),
  question: z.string().default(""),
  findings: z.string().default(""),
  limitations: z.array(z.string()).default([]),
  recommendation: z.string().default(""),
  nextAction: z.string().default(""),
  sources: z.array(z.string()).default([]),
  body: z.string().default(""),
  /** Optional CROS linkage — keeps research from becoming disconnected files. */
  cros: z
    .object({
      evaluationId: BusinessId.optional(),
      rndProjectId: BusinessId.optional(),
      capabilityId: BusinessId.optional(),
      experimentId: BusinessId.optional(),
      evidenceId: BusinessId.optional(),
      decisionId: BusinessId.optional(),
    })
    .default({}),
});
export type ResearchDocument = z.infer<typeof ResearchDocument>;

export const ProjectReference = GovernedBase.extend({
  status: Lifecycle.default("draft"),
  client: z.string().default(""),
  location: z.string().default(""),
  startDate: IsoDate.optional(),
  endDate: IsoDate.optional(),
  serviceLine: z.string().default(""),
  problem: z.string().default(""),
  workPerformed: z.string().default(""),
  technologies: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([]),
  measurableResults: z.array(z.string()).default([]),
  projectTeam: z.array(z.string()).default([]),
  lessons: z.array(z.string()).default([]),
  /** Wording approved for use in proposals. Absent until approved. */
  approvedClientFacingWording: z.string().optional(),
  supportingDocuments: z.array(z.string()).default([]),
});
export type ProjectReference = z.infer<typeof ProjectReference>;

/** RFP & proposal intelligence records (opportunity evaluations, guides, lessons). */
export const RfpRecord = GovernedBase.extend({
  status: Lifecycle.default("draft"),
  kind: z.enum(["opportunity-evaluation", "proposal-guide", "compliance-guidance", "lessons-learned", "approved-prompt", "submission-guide"]),
  decision: z.enum(["GO", "CONDITIONAL_GO", "NO_GO"]).optional(),
  body: z.string().default(""),
});
export type RfpRecord = z.infer<typeof RfpRecord>;

/**
 * Extensible relationship model. One record connects any two governed objects.
 * `confidence: proposed` marks a relationship suggested by naming/AI that a
 * human has not yet confirmed — the UI labels it as such.
 */
export const RelationshipType = z.enum([
  "related-to",
  "governs",
  "supports",
  "creates",
  "strengthens",
  "belongs-to",
  "uses-knowledge-source",
  "assists",
  "produced-evidence-for",
  "owned-by",
  "documents",
  "evaluates",
  "supersedes",
  "informs",
]);
export type RelationshipType = z.infer<typeof RelationshipType>;

export const Relationship = z.object({
  from: ContentRef,
  to: ContentRef,
  type: RelationshipType,
  confidence: z.enum(["declared", "proposed"]).default("declared"),
  note: z.string().default(""),
});
export type Relationship = z.infer<typeof Relationship>;

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  "related-to": "Related to",
  governs: "Governs",
  supports: "Supports",
  creates: "Creates",
  strengthens: "Strengthens",
  "belongs-to": "Belongs to",
  "uses-knowledge-source": "Uses knowledge source",
  assists: "Assists",
  "produced-evidence-for": "Produced evidence for",
  "owned-by": "Owned by",
  documents: "Documents",
  evaluates: "Evaluates",
  supersedes: "Supersedes",
  informs: "Informs",
};

/** Lightweight index entry shared by search, command palette, related panels. */
export const KnowledgeItem = z.object({
  ref: ContentRef,
  title: z.string(),
  summary: z.string().default(""),
  owningTeam: z.string().default(""),
  teams: z.array(z.string()).default([]),
  status: z.string().default(""),
  classification: z.enum(["internal", "confidential", "restricted"]).default("internal"),
  tags: z.array(z.string()).default([]),
  updatedAt: IsoDate.optional(),
  url: z.string(),
  /** Full-text body used by the lexical provider. Not returned to clients. */
  body: z.string().default(""),
  maturity: z.string().optional(),
  category: z.string().optional(),
});
export type KnowledgeItem = z.infer<typeof KnowledgeItem>;

export const isContentType = (value: string): value is ContentType => ContentType.safeParse(value).success;
