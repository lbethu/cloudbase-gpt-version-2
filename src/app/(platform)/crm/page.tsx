import type { Metadata } from "next";
import Link from "next/link";
import { OPPORTUNITY_STAGE_LABELS } from "@/domain";
import { Kpi } from "@/components/dashboard/widgets";
import { Callout, PageHeader, Section } from "@/components/ui/primitives";
import { crmAccounts, crmOpportunities, PIPELINE_ORDER, pipelineSummary } from "@/server/services/crm";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "Pipeline" };
const money = (n?: number) => (n === undefined ? "—" : n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);

export default async function PipelinePage() {
  const viewer = await getViewer();
  const opps = await crmOpportunities(viewer.identity!);
  const accounts = await crmAccounts(viewer.identity!);
  const accountName = new Map(accounts.items.map((a) => [a.id, a.title]));
  const summary = pipelineSummary(opps.items);
  return (
    <>
      <PageHeader title="Opportunity pipeline" description="Stages follow the Sales Playbook (IQL → MQL → SQL → proposal → negotiation). Qualified deals connect to RFP decisions, project references and the SOPs that govern proposals (209) and lead qualification (216)." actions={<><Link className="cb-btn" href="/rfp">RFP Intelligence</Link><Link className="cb-btn" href="/sops/sop-216">SOP 216</Link><Link className="cb-btn" href="/sops/sop-209">SOP 209</Link></>} />
      <div className="cb-kpi-grid">
        <Kpi label="Open opportunities" value={summary.openCount} foot={<span>{money(summary.openValue)} total</span>} />
        <Kpi label="Weighted pipeline" value={money(Math.round(summary.weighted))} foot={<span>value × probability</span>} />
        <Kpi label="Won" value={summary.wonCount} foot={<span>all time in view</span>} tone="success" />
        <Kpi label="Source" value={opps.source.live ? "Live" : "Registry"} foot={<span>{opps.source.live ? `${opps.source.connector} · ${opps.source.fetchedAt?.slice(0, 16).replace("T", " ")}` : opps.source.reason ?? "governed records"}</span>} href="/governance/integrations" />
      </div>
      {!opps.source.live && <div style={{ marginTop: 16 }}><Callout tone="info" title="Connect Pipedrive for live records">The pipeline shows governed registry records only. Set PIPEDRIVE_API_TOKEN and PIPEDRIVE_COMPANY_DOMAIN to read live deals, organizations and people (read-only). No records are fabricated.</Callout></div>}
      <Section title="Board">
        <div className="cb-kanban">
          {PIPELINE_ORDER.map((stage) => {
            const list = opps.items.filter((o) => o.stage === stage);
            return (
              <div key={stage} className="cb-kanban-col">
                <div className="cb-kanban-head"><span>{OPPORTUNITY_STAGE_LABELS[stage]}</span><b>{list.length}</b></div>
                {list.map((o) => (
                  <Link key={o.id} href={urlFor({ type: "opportunity", id: o.id })} className="cb-kanban-card">
                    <strong>{o.title}</strong>
                    <small>{accountName.get(o.accountId ?? "") ?? o.accountId ?? "No account"} · {money(o.value)}{o.probability !== undefined ? ` · ${o.probability}%` : ""}</small>
                    {o.rfpDecision && <small><span className="cb-badge cb-badge--outline">{o.rfpDecision}</span></small>}
                    {!o.nextStep && stage !== "won" && stage !== "lost" && <small className="cb-sev cb-sev--medium" style={{ fontSize: 10.5 }}>no next step</small>}
                  </Link>
                ))}
                {list.length === 0 && <div className="cb-kanban-empty">Empty</div>}
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
