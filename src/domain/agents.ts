import { z } from "zod";
import { BusinessId, ContentRef } from "./common";

/**
 * Platform agents — bounded, auditable units of automated analysis.
 * Deterministic agents run inside CloudBase on the governed registry; AI-capable
 * agents run only when a provider is configured. Agents produce findings and
 * recommendations; they never mutate governed records.
 */
export const AgentKind = z.enum(["deterministic", "ai-assisted"]);

export const AgentDefinition = z.object({
  id: BusinessId,
  title: z.string().min(1),
  purpose: z.string().min(1),
  kind: AgentKind.default("deterministic"),
  owningTeam: z.string().min(1),
  /** Which dashboards surface this agent's findings. */
  audiences: z.array(z.string()).default([]),
  cadence: z.enum(["on-demand", "hourly", "daily", "weekly"]).default("on-demand"),
  status: z.enum(["active", "paused", "planned"]).default("active"),
  authorityBoundaries: z.array(z.string()).default([]),
  /** Implementation key resolved in src/server/agents/registry.ts. */
  implementation: z.string().min(1),
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
