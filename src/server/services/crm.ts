import "server-only";
import type { Account, Contact, Opportunity, OpportunityStage } from "@/domain";
import type { Identity } from "@/server/auth/identity";
import { can, canRead } from "@/server/authz";
import { getCrmConnector } from "@/server/integrations/crm-connector";
import { getRepositories } from "@/server/repositories";

/**
 * CRM read model: governed registry records merged with live connector records
 * (live never overrides governed). Everything is classification-checked.
 */
export interface CrmSourceInfo {
  connector: string;
  live: boolean;
  reason?: string;
  fetchedAt?: string;
}

const readable = <T extends Account | Contact | Opportunity>(identity: Identity, type: "account" | "contact" | "opportunity", items: T[]) =>
  items.filter((i) => canRead(identity, { type, classification: i.classification, owningTeam: i.owningTeam, teams: i.teams, accessGrants: i.accessGrants }));

async function merged<T extends Account | Contact | Opportunity>(identity: Identity, type: "account" | "contact" | "opportunity", governed: T[], pick: (s: { accounts: Account[]; contacts: Contact[]; opportunities: Opportunity[] }) => T[]): Promise<{ items: T[]; source: CrmSourceInfo }> {
  if (!can(identity, "crm.read")) return { items: [], source: { connector: "none", live: false, reason: "crm.read required" } };
  const connector = getCrmConnector();
  let live: T[] = [];
  let source: CrmSourceInfo = { connector: connector.name, live: false };
  if (connector.configured) {
    const snap = await connector.snapshot();
    if (snap.ok) {
      live = pick(snap.data);
      source = { connector: connector.name, live: true, fetchedAt: snap.data.fetchedAt };
    } else source = { connector: connector.name, live: false, reason: snap.reason };
  } else source = { connector: "none", live: false, reason: (await connector.snapshot()).ok ? undefined : "No connector configured" };
  const ids = new Set(governed.map((g) => g.id));
  return { items: readable(identity, type, [...governed, ...live.filter((l) => !ids.has(l.id))]), source };
}

export const crmAccounts = (identity: Identity) => merged(identity, "account", getRepositories().crm.accounts(), (s) => s.accounts);
export const crmContacts = (identity: Identity) => merged(identity, "contact", getRepositories().crm.contacts(), (s) => s.contacts);
export const crmOpportunities = (identity: Identity) => merged(identity, "opportunity", getRepositories().crm.opportunities(), (s) => s.opportunities);

export const PIPELINE_ORDER: OpportunityStage[] = ["iql", "mql", "sql", "proposal", "negotiation", "won", "lost"];

export function pipelineSummary(opportunities: Opportunity[]) {
  const byStage = PIPELINE_ORDER.map((stage) => {
    const list = opportunities.filter((o) => o.stage === stage);
    return { stage, count: list.length, value: list.reduce((n, o) => n + (o.value ?? 0), 0) };
  });
  const open = opportunities.filter((o) => o.stage !== "won" && o.stage !== "lost");
  const weighted = open.reduce((n, o) => n + (o.value ?? 0) * ((o.probability ?? 0) / 100), 0);
  return { byStage, openCount: open.length, openValue: open.reduce((n, o) => n + (o.value ?? 0), 0), weighted, wonCount: opportunities.filter((o) => o.stage === "won").length };
}
