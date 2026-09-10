import "server-only";
import type { Account, Contact, Opportunity, OpportunityStage } from "@/domain";
import { getConfig } from "@/server/config";

/**
 * CRM connector seam. The registry is the governed mirror; a connector can
 * surface live records read-only. Pipedrive is Cloudpoint's system of record
 * for sales activity (SOPs 201/207/209/216).
 */
export interface CrmSnapshot {
  source: string;
  fetchedAt: string;
  accounts: Account[];
  contacts: Contact[];
  opportunities: Opportunity[];
}

export interface CrmConnector {
  readonly name: string;
  readonly configured: boolean;
  snapshot(): Promise<{ ok: true; data: CrmSnapshot } | { ok: false; reason: string }>;
}

class DisabledConnector implements CrmConnector {
  readonly name = "none";
  readonly configured = false;
  async snapshot() {
    return { ok: false as const, reason: "No CRM connector configured. Set PIPEDRIVE_API_TOKEN and PIPEDRIVE_COMPANY_DOMAIN to read live Pipedrive records." };
  }
}

const STAGE_MAP: Record<string, OpportunityStage> = { iql: "iql", mql: "mql", sql: "sql", proposal: "proposal", negotiation: "negotiation", won: "won", lost: "lost" };

class PipedriveConnector implements CrmConnector {
  readonly name = "pipedrive";
  readonly configured = true;
  private cache: { at: number; value: Awaited<ReturnType<CrmConnector["snapshot"]>> } | null = null;
  constructor(private readonly token: string, private readonly domain: string) {}
  private async get<T>(path: string): Promise<T> {
    const url = `https://${this.domain}.pipedrive.com/api/v1${path}${path.includes("?") ? "&" : "?"}api_token=${encodeURIComponent(this.token)}&limit=200`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Pipedrive ${res.status}`);
    const json = (await res.json()) as { data: T };
    return json.data;
  }
  async snapshot() {
    if (this.cache && Date.now() - this.cache.at < 5 * 60 * 1000) return this.cache.value;
    let value: Awaited<ReturnType<CrmConnector["snapshot"]>>;
    try {
      const [orgs, persons, deals, stages] = await Promise.all([
        this.get<Array<{ id: number; name: string; address?: string }>>("/organizations"),
        this.get<Array<{ id: number; name: string; org_id?: { value: number } | null; email?: Array<{ value: string }>; phone?: Array<{ value: string }> }>>("/persons"),
        this.get<Array<{ id: number; title: string; org_id?: { value: number } | null; value?: number; currency?: string; stage_id?: number; status?: string; probability?: number | null; expected_close_date?: string | null; next_activity_subject?: string | null }>>("/deals?status=all_not_deleted"),
        this.get<Array<{ id: number; name: string }>>("/stages"),
      ]);
      const stageName = new Map((stages ?? []).map((s) => [s.id, s.name.toLowerCase()]));
      const toStage = (deal: { stage_id?: number; status?: string }): OpportunityStage => {
        if (deal.status === "won") return "won";
        if (deal.status === "lost") return "lost";
        const name = stageName.get(deal.stage_id ?? -1) ?? "";
        return STAGE_MAP[Object.keys(STAGE_MAP).find((k) => name.includes(k)) ?? "iql"];
      };
      const base = { owningTeam: "sales-bd", teams: [] as string[], owner: "", accessGrants: [] as string[], tags: [] as string[], version: "live", repositories: [] as never[], summary: "" };
      value = {
        ok: true,
        data: {
          source: "pipedrive",
          fetchedAt: new Date().toISOString(),
          accounts: (orgs ?? []).map((o) => ({ ...base, id: `pd-org-${o.id}`, title: o.name, kind: "other" as const, region: o.address ?? "", serviceLines: [], status: "active" as const, classification: "internal" as const, externalIds: { pipedrive: String(o.id) } })),
          contacts: (persons ?? []).map((p) => ({ ...base, id: `pd-person-${p.id}`, title: p.name, accountId: p.org_id ? `pd-org-${p.org_id.value}` : undefined, role: "", email: p.email?.[0]?.value || undefined, phone: p.phone?.[0]?.value || undefined, classification: "confidential" as const, externalIds: { pipedrive: String(p.id) } })),
          opportunities: (deals ?? []).map((d) => ({ ...base, id: `pd-deal-${d.id}`, title: d.title, accountId: d.org_id ? `pd-org-${d.org_id.value}` : undefined, stage: toStage(d), value: d.value ?? undefined, currency: d.currency ?? "USD", probability: d.probability ?? undefined, expectedClose: d.expected_close_date ?? undefined, source: "pipedrive", campaignId: "", serviceLine: "", nextStep: d.next_activity_subject ?? "", classification: "internal" as const, externalIds: { pipedrive: String(d.id) } })),
        },
      };
    } catch (error) {
      value = { ok: false, reason: error instanceof Error ? error.message : "unreachable" };
    }
    this.cache = { at: Date.now(), value };
    return value;
  }
}

let connector: CrmConnector | null = null;
export function getCrmConnector(): CrmConnector {
  if (connector) return connector;
  const { pipedrive } = getConfig();
  connector = pipedrive.configured && pipedrive.domain ? new PipedriveConnector(pipedrive.token, pipedrive.domain) : new DisabledConnector();
  return connector;
}
