import { z } from "zod";
import { BusinessId, ContentRef } from "./common";

/**
 * Platform agents — bounded, auditable units of automated analysis.
 * Deterministic agents run inside CloudBase on the governed registry; AI-capable
 * agents run only when a provider is configured. Agents produce findings and
 * recommendations; they never mutate governed records.
 */
export const AgentKind = z.enum(["deterministic", "ai-assisted"]);

/**
 * Where an agent actually runs. `in-platform` agents are the deterministic ones
 * implemented in this repository; every other value is an agent built on an
 * external platform, reached by link. The distinction is not cosmetic: it
 * decides which data boundary applies and who can see the agent's inputs.
 */
export const AgentPlatform = z.enum(["in-platform", "chatgpt", "copilot-studio", "power-automate", "n8n", "make", "zapier", "claude", "other"]);
export type AgentPlatform = z.infer<typeof AgentPlatform>;

export const AGENT_PLATFORM_LABELS: Record<AgentPlatform, string> = {
  "in-platform": "CloudBase (deterministic)",
  chatgpt: "ChatGPT / custom GPT",
  "copilot-studio": "Microsoft Copilot Studio",
  "power-automate": "Power Automate",
  n8n: "n8n",
  make: "Make",
  zapier: "Zapier",
  claude: "Claude",
  other: "Other platform",
};

/**
 * Where a hosted agent's inputs end up. Recorded per agent because "which AI
 * may I paste this into" is the question people actually get wrong, and it
 * depends on the tenancy of the tool, not on the tool's reputation.
 */
export const DataBoundary = z.enum(["cloudpoint-tenant", "vendor-no-training", "vendor-consumer", "unassessed"]);
export type DataBoundary = z.infer<typeof DataBoundary>;

export const DATA_BOUNDARY_LABELS: Record<DataBoundary, string> = {
  "cloudpoint-tenant": "Stays in the Cloudpoint tenant",
  "vendor-no-training": "Vendor-hosted, contractually excluded from training",
  "vendor-consumer": "Consumer account — treat as public",
  unassessed: "Not assessed",
};

/**
 * Recorded accuracy evidence. An agent or copilot may not be presented as
 * operational without one: "accurate" has to be something a later reader can
 * check, not an opinion held by whoever built it.
 */
export const AgentEvaluation = z.object({
  evaluatedAt: z.string().min(1),
  evaluatedBy: z.string().min(1),
  casesRun: z.number().int().nonnegative(),
  casesPassed: z.number().int().nonnegative(),
  method: z.string().default(""),
  note: z.string().default(""),
});
export type AgentEvaluation = z.infer<typeof AgentEvaluation>;

export const AgentTestCase = z.object({
  id: z.string().min(1),
  input: z.string().min(1),
  expectedBehaviour: z.string().min(1),
  mustNot: z.array(z.string()).default([]),
});

export const AgentDefinition = z.object({
  id: BusinessId,
  title: z.string().min(1),
  purpose: z.string().min(1),
  kind: AgentKind.default("deterministic"),
  platform: AgentPlatform.default("in-platform"),
  owningTeam: z.string().min(1),
  /** Named human accountable for this agent's behaviour. Empty until assigned. */
  owner: z.string().default(""),
  /** Which dashboards surface this agent's findings. */
  audiences: z.array(z.string()).default([]),
  cadence: z.enum(["on-demand", "hourly", "daily", "weekly"]).default("on-demand"),
  status: z.enum(["active", "paused", "planned"]).default("active"),
  authorityBoundaries: z.array(z.string()).default([]),
  /** Implementation key resolved in src/server/agents/registry.ts — in-platform agents only. */
  implementation: z.string().default(""),
  /** Where to open a hosted agent. Left empty until a real deployment exists; never fabricated. */
  accessUrl: z.string().url().optional(),
  dataBoundary: DataBoundary.default("unassessed"),
  /** What this agent is allowed to be given. */
  permittedInputs: z.array(z.string()).default([]),
  testCases: z.array(AgentTestCase).default([]),
  evaluation: AgentEvaluation.optional(),
  /** The solution this agent belongs to, when it was built through the intake pipeline. */
  solutionId: z.string().default(""),
});
export type AgentDefinition = z.infer<typeof AgentDefinition>;

export const FindingSeverity = z.enum(["info", "low", "medium", "high"]);
export type FindingSeverity = z.infer<typeof FindingSeverity>;

export const AgentFinding = z.object({
  id: z.string(),
  agentId: BusinessId,
  severity: FindingSeverity,
  title: z.string(),
  detail: z.string().default(""),
  target: ContentRef.optional(),
  url: z.string().optional(),
  owningTeam: z.string().default(""),
  recommendedAction: z.string().default(""),
  requiredPermission: z.string().optional(),
});
export type AgentFinding = z.infer<typeof AgentFinding>;

export const AgentRun = z.object({
  id: z.string(),
  agentId: BusinessId,
  startedAt: z.string(),
  finishedAt: z.string(),
  actor: z.string(),
  status: z.enum(["completed", "failed", "skipped"]),
  findingCount: z.number().int().nonnegative(),
  summary: z.string().default(""),
});
export type AgentRun = z.infer<typeof AgentRun>;
