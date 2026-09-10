import type { Metadata } from "next";
import Link from "next/link";
import { Radar } from "lucide-react";
import { Bars, FindingsList, Kpi } from "@/components/dashboard/widgets";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Callout, EmptyState, PageHeader, Section } from "@/components/ui/primitives";
import { summarizeFindings } from "@/server/agents/engine";
import { agentFindings, listAgentRuns } from "@/server/services/agents";
import { teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "Agents" };

export default async function AgentsPage({ searchParams }: { searchParams: Promise<{ agent?: string; severity?: string }> }) {
  const viewer = await getViewer();
  if (!viewer.has("agent.read")) return <Callout tone="warning" title="Not authorized">The Agents console requires agent.read.</Callout>;
  const { agent, severity } = await searchParams;
  const { findings, agents } = await agentFindings(viewer.identity!);
  const list = findings.filter((f) => !agent || f.agentId === agent).filter((f) => !severity || f.severity === severity);
  const sev = summarizeFindings(findings);
  const runs = await listAgentRuns(12);
  const perAgent = agents.map((a) => ({ label: a.title, value: findings.filter((f) => f.agentId === a.id).length, href: `/agents?agent=${a.id}` }));
  return (
    <>
      <PageHeader eyebrow="AI" title="Agents console" description="Bounded, auditable agents that continuously analyze the governed registry and surface findings with recommended human actions. Agents never mutate records; every explicit run is audited." />
      <div className="cb-kpi-grid">
        <Kpi label="Active agents" value={agents.filter((a) => a.status === "active").length} foot={<span>{agents.filter((a) => a.kind === "ai-assisted").length} AI-assisted (planned)</span>} />
        <Kpi label="Open findings" value={findings.length} tone={sev.high ? "danger" : sev.medium ? "warning" : "success"} foot={<span>{sev.high} high · {sev.medium} medium · {sev.low} low · {sev.info} info</span>} />
        <Kpi label="Explicit runs (recent)" value={runs.length} foot={<span>{runs[0] ? `last ${runs[0].startedAt.slice(0, 16).replace("T", " ")}` : "none recorded"}</span>} />
      </div>
      <div className="cb-grid cb-grid--2" style={{ marginTop: 28, gap: 24, alignItems: "start" }}>
        <Section title="Agents" className="cb-section--flush">
          <div className="cb-card">
            {agents.map((a) => (
              <Link key={a.id} href={urlFor({ type: "agent", id: a.id })} className="cb-item-row">
                <div>
                  <div className="cb-item-row-title"><Radar size={14} /> {a.title}<Badge tone={a.kind === "ai-assisted" ? "violet" : "outline"}>{a.kind}</Badge></div>
                  <div className="cb-item-row-sub">{a.purpose}</div>
                </div>
                <div className="cb-item-row-meta"><StatusBadge status={a.status} /><span>{a.cadence}</span><span>{teamName(a.owningTeam)}</span></div>
              </Link>
            ))}
            {agents.length === 0 && <EmptyState title="No agents registered" />}
          </div>
        </Section>
        <Section title="Findings by agent" className="cb-section--flush">
          <div className="cb-card cb-card--pad"><Bars data={perAgent} /></div>
        </Section>
      </div>
      <Section title={`Findings${agent ? ` · ${agents.find((a) => a.id === agent)?.title ?? agent}` : ""}`} action={agent || severity ? { label: "Clear filters", href: "/agents" } : undefined}>
        <div className="cb-chip-row" style={{ marginBottom: 12 }}>
          {(["high", "medium", "low", "info"] as const).map((s) => <Link key={s} className="cb-chip" aria-pressed={severity === s} href={`/agents?${agent ? `agent=${agent}&` : ""}severity=${s}`}>{s} ({findings.filter((f) => f.severity === s && (!agent || f.agentId === agent)).length})</Link>)}
        </div>
        <FindingsList findings={list} />
      </Section>
      <Section title="Recent explicit runs">
        {runs.length ? (
          <div className="cb-table-wrap cb-card"><table className="cb-table"><thead><tr><th>When</th><th>Agent</th><th>Actor</th><th>Status</th><th>Summary</th></tr></thead><tbody>{runs.map((r) => <tr key={r.id}><td className="cb-mono cb-small">{r.startedAt.slice(0, 19).replace("T", " ")}</td><td>{agents.find((a) => a.id === r.agentId)?.title ?? r.agentId}</td><td>{r.actor}</td><td><StatusBadge status={r.status} /></td><td className="cb-muted">{r.summary}</td></tr>)}</tbody></table></div>
        ) : (
          <p className="cb-muted cb-small">No explicit runs recorded yet. Findings above are computed live on every visit; use “Run now” on an agent to record an audited run.</p>
        )}
      </Section>
    </>
  );
}
