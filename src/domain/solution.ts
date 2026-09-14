import { z } from "zod";
import { GovernedBase, IsoDate } from "./common";

/**
 * The Cloudpoint AI delivery model, as a governed record.
 *
 * Every business problem is submitted to the AI & Automation team, and the
 * team answers it with a **pair**:
 *
 *   agent    — runs on a schedule or a trigger, produces a report or findings,
 *              and has no authority to change anything;
 *   copilot  — interactive, helps a named person do a named job, and
 *              troubleshoots when the agent's output raises a question.
 *
 * The pair is the unit of delivery because either half alone fails in a
 * predictable way: an agent with no copilot produces reports nobody can
 * interrogate, and a copilot with no agent waits to be asked and therefore
 * never catches anything on its own.
 *
 * A Solution is the record of that pairing — the problem in the requester's
 * words, who owns the answer, what evidence exists that it works, and what it
 * is not allowed to decide. It is deliberately not a project-management
 * artifact: it exists so that a year from now someone can ask "why does this
 * agent exist, who asked for it, and how do we know it is right".
 */

export const SolutionStage = z.enum(["intake", "scoping", "building", "pilot", "operational", "retired"]);
export type SolutionStage = z.infer<typeof SolutionStage>;

export const SOLUTION_STAGE_LABELS: Record<SolutionStage, string> = {
  intake: "Intake — submitted, not yet scoped",
  scoping: "Scoping — problem being defined with the requester",
  building: "Building",
  pilot: "Pilot — in use, under evaluation",
  operational: "Operational — evaluated and in service",
  retired: "Retired",
};

/** Stages that claim the solution is in real use. These require recorded evidence. */
export const STAGES_REQUIRING_EVIDENCE: SolutionStage[] = ["operational"];

export const SolutionOutcome = z.object({
  /** How anyone would tell whether this actually helped. Stated before building. */
  measure: z.string().min(1),
  baseline: z.string().default(""),
  target: z.string().default(""),
  observed: z.string().default(""),
});

export const Solution = GovernedBase.extend({
  stage: SolutionStage.default("intake"),
  /** The problem in the requester's own words — not a restatement as a feature. */
  problem: z.string().min(1),
  /** Who is affected and who asked. */
  requestedBy: z.string().default(""),
  requestingTeam: z.string().default(""),
  submittedAt: IsoDate.optional(),
  /** Named human accountable for the answer. Empty until assigned. */
  deliveryOwner: z.string().default(""),
  /** The pair. Ids refer to the agent and copilot registries. */
  agentIds: z.array(z.string()).default([]),
  copilotIds: z.array(z.string()).default([]),
  /** Why this needs an agent, a copilot, or both — recorded so the pairing is a decision, not a habit. */
  pairingRationale: z.string().default(""),
  outcome: SolutionOutcome.optional(),
  /** What the pair must never decide on its own. */
  authorityBoundaries: z.array(z.string()).default([]),
  /** Which humans review the output, and how often. */
  humanReview: z.string().default(""),
  /** Systems and data the solution touches — drives the data-boundary review. */
  dataTouched: z.array(z.string()).default([]),
  notes: z.string().default(""),
});
export type Solution = z.infer<typeof Solution>;
