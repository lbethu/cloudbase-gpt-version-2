import { z } from "zod";
import { BusinessId, ContentRef, GovernedBase, IsoDate } from "./common";

/** Copilot registry. Nothing is `operational` unless a governed review said so. */
export const CopilotStatus = z.enum(["concept", "draft", "prototype", "pilot", "operational", "deprecated"]);
export type CopilotStatus = z.infer<typeof CopilotStatus>;

export const COPILOT_STATUS_LABELS: Record<CopilotStatus, string> = {
  concept: "Concept",
  draft: "Draft",
  prototype: "Prototype",
  pilot: "Pilot",
  operational: "Operational",
  deprecated: "Deprecated",
};

export const CopilotKnowledgeSource = z.object({
  ref: ContentRef.optional(),
  label: z.string().min(1),
  kind: z.enum(["registry", "documents", "external", "system"]).default("registry"),
  note: z.string().default(""),
});

export const CopilotTestCase = z.object({
  id: z.string().min(1),
  input: z.string().min(1),
  expectedBehaviour: z.string().min(1),
  mustNot: z.array(z.string()).default([]),
});

export const Copilot = GovernedBase.extend({
  status: CopilotStatus.default("concept"),
  purpose: z.string().default(""),
  supportedUsers: z.array(z.string()).default([]),
  description: z.string().default(""),
  /** Master instructions — governed text. May be empty until authored. */
  instructions: z.string().default(""),
  /** Left empty until an approved deployment exists. Never fabricated. */
  accessUrl: z.string().url().optional(),
  knowledgeSources: z.array(CopilotKnowledgeSource).default([]),
  requiredPermissions: z.array(z.string()).default([]),
  securityClassification: z.enum(["internal", "confidential", "restricted"]).default("internal"),
  usageGuide: z.string().default(""),
  limitations: z.array(z.string()).default([]),
  testCases: z.array(CopilotTestCase).default([]),
  authorityBoundaries: z.array(z.string()).default([]),
  outputContract: z.string().default(""),
  humanReview: z.string().default(""),
  releaseNotes: z.array(z.object({ version: z.string(), date: IsoDate.optional(), note: z.string() })).default([]),
});
export type Copilot = z.infer<typeof Copilot>;

export const AutomationStatus = z.enum(["proposed", "in-development", "pilot", "approved", "retired"]);
export type AutomationStatus = z.infer<typeof AutomationStatus>;

export const Automation = GovernedBase.extend({
  status: AutomationStatus.default("proposed"),
  category: z.string().default("Operations"),
  kind: z.enum(["deterministic", "ai-assisted", "hybrid"]).default("deterministic"),
  businessProblem: z.string().default(""),
  trigger: z.string().default(""),
  inputs: z.array(z.string()).default([]),
  workflow: z.array(z.string()).default([]),
  systems: z.array(z.string()).default([]),
  output: z.string().default(""),
  humanReviewPoints: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  documentationUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  failurePath: z.string().default(""),
  logging: z.string().default(""),
  successMetric: z.string().default(""),
});
export type Automation = z.infer<typeof Automation>;

/** Intake form for "Propose a New Automation" — compatible with future CROS intake. */
export const AutomationProposal = z.object({
  problem: z.string().min(10, "Describe the problem in at least a sentence."),
  whoExperiencesIt: z.string().min(2),
  frequency: z.enum(["daily", "weekly", "monthly", "per-project", "ad-hoc"]),
  currentSystem: z.string().default(""),
  deterministicEnough: z.enum(["yes", "no", "unsure"]),
  aiNeeded: z.enum(["yes", "no", "unsure"]),
  dataInvolved: z.string().default(""),
  permissionsRequired: z.string().default(""),
  successDefinition: z.string().min(5),
  proposedTeam: BusinessId.optional(),
});
export type AutomationProposal = z.infer<typeof AutomationProposal>;
