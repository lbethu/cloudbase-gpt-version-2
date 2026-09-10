import { z } from "zod";
import { BusinessId, GovernedBase, IsoDate } from "./common";

/**
 * CROS — Cloudpoint Research Operating System.
 *
 * CROS is authoritative for everything in this file. CloudBase consumes it
 * read-only through `CrosRegistry` (src/server/repositories/cros.ts). When an
 * external CROS backend exists, a second adapter implements the same interface.
 */

export const MaturityLevel = z.enum(["R0", "R1", "R2", "R3", "R4", "R5", "R6", "R7"]);
export type MaturityLevel = z.infer<typeof MaturityLevel>;

export const MATURITY_MODEL: Record<MaturityLevel, { label: string; description: string }> = {
  R0: { label: "Idea", description: "Captured idea, problem, technology or market signal. Not yet evaluated." },
  R1: { label: "Research", description: "Desk research and internal reuse check in progress." },
  R2: { label: "Feasibility", description: "Technical and business feasibility assessed; go/no-go for prototyping." },
  R3: { label: "Prototype", description: "Working prototype exists; not validated against real data or users." },
  R4: { label: "Validated Prototype", description: "Prototype validated with governed evidence against defined success criteria." },
  R5: { label: "Pilot", description: "Used on a real project or with a real client under controlled conditions." },
  R6: { label: "Production Candidate", description: "Hardened, documented, owner assigned; awaiting production decision." },
  R7: { label: "Operational Capability", description: "Reliable, reusable capability with SOPs, owners and support." },
};

export const RndStatus = z.enum(["proposed", "active", "paused", "completed", "stopped"]);

export const RndProject = GovernedBase.extend({
  code: z.string().regex(/^CP-RND-\d{3}$/),
  status: RndStatus.default("proposed"),
  /** Absent until a governed evaluation assigns a level. Never inferred by AI. */
  maturity: MaturityLevel.optional(),
  problem: z.string().default(""),
  hypothesis: z.string().default(""),
  serviceLines: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  leads: z.array(z.string()).default([]),
  startedAt: IsoDate.optional(),
  externalLink: z.string().url().optional(),
});
export type RndProject = z.infer<typeof RndProject>;

export const Capability = GovernedBase.extend({
  code: z.string().regex(/^CAP-\d{3}$/),
  maturity: MaturityLevel.optional(),
  description: z.string().default(""),
  useCases: z.array(z.string()).default([]),
  inputs: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
  technicalApproach: z.string().default(""),
  limitations: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  reusableAssets: z.array(z.string()).default([]),
});
export type Capability = z.infer<typeof Capability>;

export const CapabilityCluster = GovernedBase.extend({
  code: z.string().regex(/^CLUSTER-\d{3}$/),
  description: z.string().default(""),
  serviceLines: z.array(z.string()).default([]),
});
export type CapabilityCluster = z.infer<typeof CapabilityCluster>;

export const Idea = GovernedBase.extend({
  submittedBy: z.string().default(""),
  submittedAt: IsoDate.optional(),
  signal: z.enum(["idea", "problem", "technology", "client-need", "market-signal"]).default("idea"),
  status: z.enum(["new", "triaged", "evaluating", "accepted", "declined"]).default("new"),
});
export type Idea = z.infer<typeof Idea>;

export const Evaluation = GovernedBase.extend({
  subject: z.object({ type: z.enum(["idea", "rnd-project", "capability"]), id: BusinessId }),
  decision: z.enum(["pending", "proceed", "hold", "stop"]).default("pending"),
  evaluators: z.array(z.string()).default([]),
  criteria: z.array(z.object({ name: z.string(), score: z.number().min(0).max(5).optional(), note: z.string().default("") })).default([]),
  recommendedMaturity: MaturityLevel.optional(),
  evaluatedAt: IsoDate.optional(),
});
export type Evaluation = z.infer<typeof Evaluation>;

export const Evidence = GovernedBase.extend({
  kind: z.enum(["benchmark", "pilot-result", "client-feedback", "experiment-result", "external-reference", "demo"]),
  status: z.enum(["candidate", "approved", "rejected"]).default("candidate"),
  approvedBy: z.string().optional(),
  approvedAt: IsoDate.optional(),
  findings: z.string().default(""),
  limitations: z.array(z.string()).default([]),
  sourceLinks: z.array(z.string()).default([]),
});
export type Evidence = z.infer<typeof Evidence>;

export const Experiment = GovernedBase.extend({
  question: z.string().default(""),
  method: z.string().default(""),
  status: z.enum(["planned", "running", "completed", "abandoned"]).default("planned"),
  successCriteria: z.array(z.string()).default([]),
  result: z.string().default(""),
});
export type Experiment = z.infer<typeof Experiment>;

export const Decision = GovernedBase.extend({
  decidedBy: z.array(z.string()).default([]),
  decidedAt: IsoDate.optional(),
  outcome: z.enum(["proceed", "hold", "stop", "promote", "retire"]),
  rationale: z.string().default(""),
  fromMaturity: MaturityLevel.optional(),
  toMaturity: MaturityLevel.optional(),
});
export type Decision = z.infer<typeof Decision>;
