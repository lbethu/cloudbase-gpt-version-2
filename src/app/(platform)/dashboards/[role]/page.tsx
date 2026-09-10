import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTENT_TYPE_LABELS, OPPORTUNITY_STAGE_LABELS, type ContentType } from "@/domain";
import { Bars, FindingsList, Kpi } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/Badge";
import { Callout, EmptyState, ItemList, ItemRow, PageHeader, Section } from "@/components/ui/primitives";
import { summarizeFindings } from "@/server/agents/engine";
import { getRepositories } from "@/server/repositories";
import { DASHBOARDS, dashboardData, isDashboardRole } from "@/server/services/dashboards";
import { getViewer } from "@/server/services/viewer";

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role } = await params;
  return { title: isDashboardRole(role) ? `${DASHBOARDS[role].title} dashboard` : "Dashboard" };
}

const money = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);

export default async function DashboardPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const viewer = await getViewer();
  if (!isDashboardRole(role) || !viewer.has("knowledge.read")) notFound();
  const def = DASHBOARDS[role];
  const data = await dashboardData(viewer.identity!, role);
  const sev = summarizeFindings(data.findings);
  const repos = getRepositories();
  const teamName = (id: string) => repos.teams.get(id)?.name ?? id;
  const recent = [...data.teamItems].filter((i) => i.updatedAt).sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")).slice(0, 6);
  const sops = data.teamItems.filter((i) => i.ref.type === "sop").slice(0, 8);
  const copilots = data.items.filter((i) => i.ref.type === "copilot" && (role === "ai" || def.teams.includes(i.owningTeam) || i.teams.some((t) => def.teams.includes(t))));
  const rnd = data.items.filter((i) => i.ref.type === "rnd-project" && (role === "leadership" || role === "ai" || def.teams.includes(i.owningTeam) || i.teams.some((t) => def.teams.includes(t))));
  const typeBars = Object.entries(data.typeCounts).sort((a, b) => b[1] - a[1]).map(([t, v]) => ({ label: CONTENT_TYPE_LABELS[t as ContentType] ?? t, value: v }));

  return (
    <>
      <PageHeader eyebrow="Agentic dashboard" title={`${def.title}`} description={def.description} actions={<><Link className="cb-btn" href="/agents">Agents console</Link><Link className="cb-btn cb-btn--primary" href={`/ask`}>Ask CloudBase</Link></>} />

      <div className="cb-kpi-grid">
        <Kpi label="Knowledge in scope" value={data.teamItems.length} foot={<span>{Object.keys(data.typeCounts).length} content types</span>} href={`/search?team=${def.teams[0]}`} />
        <Kpi label="Agent findings" value={data.findings.length} tone={sev.high ? "danger" : sev.medium ? "warning" : "success"} foot={<span>{sev.high} high · {sev.medium} medium · {sev.low} low</span>} href="/agents" />
        {viewer.has("review.read") && <Kpi label="Awaiting review" value={data.reviewCount} tone={data.reviewCount ? "warning" : "success"} foot={<span>you can act on these</span>} href="/governance/reviews" />}
        {role === "leadership" && <Kpi label="Active R&D" value={rnd.filter((p) => p.status === "active").length} foot={<span>{repos.cros.capabilities().length} capabilities registered</span>} href="/cros/portfolio" />}
        {data.pipeline && <Kpi label="Open pipeline" value={data.pipeline.openCount} unit="deals" foot={<span>{money(data.pipeline.openValue)} · weighted {money(Math.round(data.pipeline.weighted))}</span>} href="/crm" />}
        {data.pipeline && <Kpi label="Won" value={data.pipeline.wonCount} foot={<span>{data.pipeline.live ? `live from ${data.pipeline.source}` : "governed registry"}</span>} href="/crm/opportunities?stage=won" />}
        {role === "ai" && <Kpi label="Copilots" value={copilots.length} foot={<span>{copilots.filter((c) => c.status === "operational").length} operational</span>} href="/copilots" />}
        {role === "ai" && <Kpi label="Automations" value={data.items.filter((i) => i.ref.type === "automation").length} foot={<span>approved: {data.items.filter((i) => i.ref.type === "automation" && i.status === "approved").length}</span>} href="/automations" />}
        {(role === "operations" || role === "field" || role === "gis") && <Kpi label="SOPs owned" value={sops.length ? data.teamItems.filter((i) => i.ref.type === "sop").length : 0} foot={<span>{data.teamItems.filter((i) => i.ref.type === "sop" && i.status === "Approved").length} approved</span>} href={`/sops?team=${def.teams[0]}`} />}
      </div>

      <div className="cb-grid cb-grid--2" style={{ marginTop: 28, gap: 24, alignItems: "start" }}>
        <Section title="Agent insights" action={{ label: "All findings", href: "/agents" }} className="cb-section--flush">
          <FindingsList findings={data.findings} limit={8} />
        </Section>
        <div style={{ display: "grid", gap: 24 }}>
          <Section title={role === "leadership" ? "Maturity distribution (R&D + capabilities)" : "SOP lifecycle"} className="cb-section--flush">
            <div className="cb-card cb-card--pad">
              {role === "leadership" ? (
                <Bars data={data.maturity.map((m) => ({ label: `${m.level} ${m.label}`, value: m.count, tone: "violet" as const }))} />
              ) : (
                <Bars data={data.sopStatus.map((s) => ({ label: s.label, value: s.value, tone: s.tone }))} />
              )}
              {role === "leadership" && data.maturity.every((m) => m.count === 0) && <p className="cb-muted cb-small" style={{ marginTop: 10 }}>No governed maturity assigned yet — evaluations and decisions in CROS populate this chart.</p>}
            </div>
          </Section>
          <Section title="Knowledge by type" className="cb-section--flush">
            <div className="cb-card cb-card--pad">
              <Bars data={typeBars} />
            </div>
          </Section>
        </div>
      </div>

      {data.pipeline && (
        <Section title="Pipeline by stage" action={{ label: "Open pipeline board", href: "/crm" }}>
          <div className="cb-card cb-card--pad">
            <Bars data={data.pipeline.byStage.map((s) => ({ label: OPPORTUNITY_STAGE_LABELS[s.stage], value: s.count, href: `/crm/opportunities?stage=${s.stage}`, tone: s.stage === "won" ? ("success" as const) : s.stage === "lost" ? ("neutral" as const) : ("accent" as const) }))} />
            {data.pipeline.openCount === 0 && <Callout tone="info" title="No opportunities recorded">Add governed opportunity records or connect Pipedrive (Integrations) to see the live pipeline.</Callout>}
          </div>
        </Section>
      )}

      <div className="cb-grid cb-grid--2" style={{ marginTop: 28, gap: 24, alignItems: "start" }}>
        <Section title="Governing SOPs" action={{ label: "SOP library", href: `/sops?team=${def.teams[0]}` }} className="cb-section--flush">
          {sops.length ? (
            <ItemList>{sops.map((s) => <ItemRow key={s.ref.id} href={s.url} title={s.title} type="sop" status={s.status} meta={<span>{teamName(s.owningTeam)}</span>} />)}</ItemList>
          ) : (
            <EmptyState title="No SOPs owned by this workspace yet" />
          )}
        </Section>
        <Section title={role === "sales" ? "RFP & proposal tools" : "Copilots & R&D in scope"} className="cb-section--flush">
          <ItemList>
            {copilots.map((c) => <ItemRow key={c.ref.id} href={c.url} title={c.title} type="copilot" status={c.status} subtitle={c.summary} />)}
            {rnd.slice(0, 6).map((p) => <ItemRow key={p.ref.id} href={p.url} title={p.title} type="rnd-project" status={p.status} meta={p.maturity ? <Badge tone="violet">{p.maturity}</Badge> : <Badge tone="outline">maturity not assessed</Badge>} />)}
            {role === "sales" && <ItemRow href="/rfp" title="RFP Intelligence" type="rfp" subtitle="Opportunity evaluation pattern, GO / CONDITIONAL_GO / NO_GO" />}
            {role === "sales" && <ItemRow href="/projects" title="Project Reference Library" type="project-reference" subtitle="Reusable experience for proposals" />}
          </ItemList>
          {!copilots.length && !rnd.length && role !== "sales" && <p className="cb-muted cb-small" style={{ marginTop: 8 }}>No copilots or R&D projects linked to this workspace yet.</p>}
        </Section>
      </div>

      <Section title="Recently updated in scope">
        {recent.length ? <ItemList>{recent.map((i) => <ItemRow key={`${i.ref.type}:${i.ref.id}`} href={i.url} title={i.title} type={i.ref.type} status={i.status} meta={<span>{i.updatedAt}</span>} />)}</ItemList> : <EmptyState title="Nothing updated yet" />}
      </Section>
    </>
  );
}
