import { z } from "zod";
import { BusinessId, GovernedBase, IsoDate } from "./common";

/**
 * CRM domain — accounts, contacts, opportunities and activities.
 *
 * Cloudpoint's system of record for sales activity is Pipedrive (SOPs 201, 207,
 * 209, 216). CloudBase mirrors the governed subset needed to connect
 * opportunities to RFP evaluations, project references, capabilities and SOPs,
 * and can read live records through a `CrmConnector` (src/server/integrations).
 * Contacts default to `confidential` (owning team + leadership).
 */

export const AccountKind = z.enum(["municipal", "county", "state", "federal", "utility", "campus", "private", "partner", "other"]);

export const Account = GovernedBase.extend({
  kind: AccountKind.default("other"),
  region: z.string().default(""),
  website: z.string().url().optional(),
  serviceLines: z.array(z.string()).default([]),
  status: z.enum(["prospect", "active", "dormant", "partner"]).default("prospect"),
  externalIds: z.record(z.string(), z.string()).default({}),
});
export type Account = z.infer<typeof Account>;

export const Contact = GovernedBase.extend({
  accountId: BusinessId.optional(),
  role: z.string().default(""),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  externalIds: z.record(z.string(), z.string()).default({}),
  classification: z.enum(["internal", "confidential", "restricted"]).default("confidential"),
});
export type Contact = z.infer<typeof Contact>;

/** Pipeline stages aligned with the Sales Playbook (IQL → MQL → SQL → proposal → won/lost). */
export const OpportunityStage = z.enum(["iql", "mql", "sql", "proposal", "negotiation", "won", "lost"]);
export type OpportunityStage = z.infer<typeof OpportunityStage>;

export const OPPORTUNITY_STAGE_LABELS: Record<OpportunityStage, string> = {
  iql: "Information Qualified",
  mql: "Marketing Qualified",
  sql: "Sales Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

export const Opportunity = GovernedBase.extend({
  accountId: BusinessId.optional(),
  stage: OpportunityStage.default("iql"),
  value: z.number().nonnegative().optional(),
  currency: z.string().default("USD"),
  probability: z.number().min(0).max(100).optional(),
  expectedClose: IsoDate.optional(),
  source: z.string().default(""),
  campaignId: z.string().default(""),
  serviceLine: z.string().default(""),
  rfpDecision: z.enum(["GO", "CONDITIONAL_GO", "NO_GO"]).optional(),
  nextStep: z.string().default(""),
  externalIds: z.record(z.string(), z.string()).default({}),
});
export type Opportunity = z.infer<typeof Opportunity>;

export const Activity = z.object({
  id: BusinessId,
  at: z.string(),
  kind: z.enum(["call", "email", "meeting", "note", "task", "proposal-sent", "stage-change"]),
  subject: z.string().min(1),
  actor: z.string().default(""),
  accountId: BusinessId.optional(),
  contactId: BusinessId.optional(),
  opportunityId: BusinessId.optional(),
  note: z.string().default(""),
});
export type Activity = z.infer<typeof Activity>;
