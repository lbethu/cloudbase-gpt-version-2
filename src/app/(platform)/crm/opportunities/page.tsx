import type { Metadata } from "next";
import Link from "next/link";
import { Target } from "lucide-react";
import { OPPORTUNITY_STAGE_LABELS, type OpportunityStage } from "@/domain";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, PageHeader } from "@/components/ui/primitives";
import { crmAccounts, crmOpportunities, PIPELINE_ORDER } from "@/server/services/crm";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "Opportunities" };
const money = (n?: number) => (n === undefined ? "—" : `$${n.toLocaleString()}`);

export default async function OpportunitiesPage({ searchParams }: { searchParams: Promise<{ stage?: string; q?: string }> }) {
  const viewer = await getViewer();
  const { stage, q = "" } = await searchParams;
  const { items } = await crmOpportunities(viewer.identity!);
  const accounts = new Map((await crmAccounts(viewer.identity!)).items.map((a) => [a.id, a.title]));
  const list = items.filter((o) => !stage || o.stage === stage).filter((o) => !q || `${o.title} ${accounts.get(o.accountId ?? "") ?? ""} ${o.serviceLine}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => PIPELINE_ORDER.indexOf(a.stage) - PIPELINE_ORDER.indexOf(b.stage) || (b.value ?? 0) - (a.value ?? 0));
  return (
    <>
      <PageHeader title="Opportunities" description="Every pursuit with its stage, value, probability, GO / NO_GO decision and next step." />
      <div className="cb-chip-row" style={{ marginBottom: 14 }}>
        <Link className="cb-chip" aria-pressed={!stage} href="/crm/opportunities">All ({items.length})</Link>
        {PIPELINE_ORDER.map((s: OpportunityStage) => <Link key={s} className="cb-chip" aria-pressed={stage === s} href={`/crm/opportunities?stage=${s}`}>{OPPORTUNITY_STAGE_LABELS[s]} ({items.filter((o) => o.stage === s).length})</Link>)}
      </div>
      <form className="cb-toolbar" method="get">{stage && <input type="hidden" name="stage" value={stage} />}<input className="cb-input cb-search-input" name="q" defaultValue={q} placeholder="Filter opportunities…" aria-label="Filter opportunities" /><button className="cb-btn" type="submit">Apply</button></form>
      {list.length === 0 ? <EmptyState icon={<Target size={18} />} title={items.length ? "No opportunities match" : "No opportunities recorded"} description="Opportunities come from governed records (content/registry/crm/opportunities.yaml) or the Pipedrive connector." /> : (
        <div className="cb-table-wrap cb-card"><table className="cb-table"><thead><tr><th>Opportunity</th><th>Account</th><th>Stage</th><th>Value</th><th>Prob.</th><th>Decision</th><th>Expected close</th><th>Next step</th></tr></thead><tbody>
          {list.map((o) => <tr key={o.id}><td><Link href={urlFor({ type: "opportunity", id: o.id })} style={{ fontWeight: 600 }}>{o.title}</Link>{o.serviceLine && <div className="cb-subtle cb-small">{o.serviceLine}</div>}</td><td>{o.accountId ? <Link href={urlFor({ type: "account", id: o.accountId })}>{accounts.get(o.accountId) ?? o.accountId}</Link> : "—"}</td><td><Badge tone={o.stage === "won" ? "success" : o.stage === "lost" ? "outline" : "accent"}>{OPPORTUNITY_STAGE_LABELS[o.stage]}</Badge></td><td className="cb-mono">{money(o.value)}</td><td>{o.probability ?? "—"}{o.probability !== undefined ? "%" : ""}</td><td>{o.rfpDecision ? <Badge tone={o.rfpDecision === "GO" ? "success" : o.rfpDecision === "NO_GO" ? "danger" : "warning"}>{o.rfpDecision}</Badge> : <span className="cb-subtle">—</span>}</td><td>{o.expectedClose ?? "—"}</td><td className="cb-muted">{o.nextStep || <span className="cb-sev cb-sev--medium" style={{ fontSize: 10.5 }}>missing</span>}</td></tr>)}
        </tbody></table></div>
      )}
    </>
  );
}
