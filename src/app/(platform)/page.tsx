import Link from "next/link";
import { Bot, BookOpen, Briefcase, FileCode2, FlaskConical, Orbit, Scale, Search, Sparkles, Workflow } from "lucide-react";
import { MATURITY_MODEL } from "@/domain";
import { Badge, StatusBadge, TypeBadge } from "@/components/ui/Badge";
import { DomainCard, EmptyState, ItemList, ItemRow, Section } from "@/components/ui/primitives";
import { FindingsList, Kpi } from "@/components/dashboard/widgets";
import { summarizeFindings } from "@/server/agents/engine";
import { agentFindings } from "@/server/services/agents";
import { DASHBOARDS } from "@/server/services/dashboards";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { deriveReviewTasks } from "@/server/services/reviews";
import { permittedItems, recentlyUpdated } from "@/server/services/search";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export default async function HomePage() {
  const viewer = await getViewer();
  const repos = getRepositories();
  const items = permittedItems(viewer.identity);
  const count = (type: string) => items.filter((i) => i.ref.type === type).length;
  const recent = recentlyUpdated(viewer.identity, 8);
  const myTeams = new Set(viewer.identity?.teams ?? []);
  const recommended = items
    .filter((i) => i.ref.type !== "team" && (myTeams.has(i.owningTeam) || i.teams.some((t) => myTeams.has(t))))
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
    .slice(0, 6);
  const activeRnd = viewer.has("rnd.read") ? repos.cros.rndProjects().filter((p) => p.status === "active") : [];
  const validatedCaps = viewer.has("capability.read") ? repos.cros.capabilities().filter((c) => c.maturity && ["R4", "R5", "R6", "R7"].includes(c.maturity)) : [];
  const copilots = viewer.has("copilot.read") ? filterVisible(viewer.identity, "copilot", repos.copilots.list()) : [];
  const statusRank: Record<string, number> = { operational: 0, pilot: 1, prototype: 2, draft: 3, concept: 4, deprecated: 5 };
  const reviewTasks = viewer.has("review.read") ? deriveReviewTasks(repos).filter((t) => viewer.has(t.requiredPermission)) : [];
  const teamName = (id: string) => repos.teams.get(id)?.name ?? id;
  const { findings } = viewer.identity && viewer.has("agent.read") ? await agentFindings(viewer.identity) : { findings: [] };
  const sev = summarizeFindings(findings);
  const chunkCount = repos.sops.allImportedContent().reduce((n, c) => n + c.chunks.length, 0);

  const domains = [
    { href: "/sops", title: "SOPs", description: "Governed standard operating procedures with versions and approval evidence.", icon: <BookOpen />, count: count("sop"), permission: "sop.read" as const },
    { href: "/cros", title: "CROS / R&D", description: "Ideas, evaluations, R&D projects, evidence and maturity decisions.", icon: <Orbit />, count: count("rnd-project"), permission: "rnd.read" as const, countLabel: "projects" },
    { href: "/copilots", title: "AI Copilots", description: "The registry of Cloudpoint AI assistants, their authority and status.", icon: <Bot />, count: count("copilot"), permission: "copilot.read" as const },
    { href: "/automations", title: "AI Automations", description: "Which automations exist, what triggers them and where humans review.", icon: <Workflow />, count: count("automation"), permission: "automation.read" as const },
    { href: "/projects", title: "Project Intelligence", description: "Reusable project references for proposals, sales and delivery.", icon: <Briefcase />, count: count("project-reference"), permission: "knowledge.read" as const },
    { href: "/rfp", title: "RFP Intelligence", description: "Opportunity evaluation, compliance guidance and the appraisal pattern.", icon: <Scale />, count: count("rfp"), permission: "knowledge.read" as const },
    { href: "/research", title: "Research", description: "Investigations, spikes, decisions, findings and failure records.", icon: <FlaskConical />, count: count("research"), permission: "knowledge.read" as const },
    { href: "/docs", title: "Technical Documentation", description: "How-to guides and engineering standards with runnable examples.", icon: <FileCode2 />, count: count("documentation"), permission: "knowledge.read" as const },
  ].filter((d) => viewer.has(d.permission));

  return (
    <>
      <section className="cb-hero">
        <span className="cb-eyebrow">Cloudpoint Knowledge &amp; Intelligence Hub</span>
        <h1>CloudBase AI</h1>
        <p className="cb-hero-sub">One place to discover Cloudpoint knowledge, SOPs, R&amp;D, capabilities, projects, AI copilots, automations, and technical guidance.</p>
        <form className="cb-hero-search" action="/search" method="get" role="search">
          <div className="cb-hero-search-wrap">
            <Search aria-hidden="true" />
            <input className="cb-input" type="search" name="q" placeholder="Search Cloudpoint knowledge…" aria-label="Search Cloudpoint knowledge" autoComplete="off" />
          </div>
          <button className="cb-btn cb-btn--primary" type="submit">
            Search
          </button>
          {viewer.has("ask.use") && (
            <Link className="cb-btn" href="/ask">
              <Sparkles /> Ask CloudBase
            </Link>
          )}
        </form>
        <div className="cb-quick-actions">
          {viewer.has("sop.read") && <Link className="cb-chip" href="/sops">Find an SOP</Link>}
          {viewer.has("rnd.read") && <Link className="cb-chip" href="/cros">Explore R&amp;D</Link>}
          {viewer.has("copilot.read") && <Link className="cb-chip" href="/copilots">Find a Copilot</Link>}
          {viewer.has("knowledge.read") && <Link className="cb-chip" href="/projects">Find a Project Reference</Link>}
          {viewer.has("knowledge.read") && <Link className="cb-chip" href="/teams">Browse Team Knowledge</Link>}
          {viewer.has("automation.read") && <Link className="cb-chip" href="/automations">View AI Automations</Link>}
        </div>
      </section>

      <div className="cb-kpi-grid" style={{ marginTop: 28 }}>
        <Kpi label="Governed objects" value={items.filter((i) => i.ref.type !== "team").length} foot={<span>{chunkCount.toLocaleString()} searchable passages</span>} href="/search" />
        {viewer.has("sop.read") && <Kpi label="SOPs" value={count("sop")} foot={<span>{items.filter((i) => i.ref.type === "sop" && i.status === "Approved").length} approved · {items.filter((i) => i.ref.type === "sop" && i.status === "In review").length} in review</span>} href="/sops" />}
        {viewer.has("rnd.read") && <Kpi label="R&D → capabilities" value={<>{count("rnd-project")}<small>→ {count("capability")}</small></>} foot={<span>{validatedCaps.length} validated (R4+)</span>} href="/cros/portfolio" />}
        {viewer.has("agent.read") && <Kpi label="Agent findings" value={findings.length} tone={sev.high ? "danger" : sev.medium ? "warning" : "success"} foot={<span>{sev.high} high · {sev.medium} medium</span>} href="/agents" />}
        {viewer.has("review.read") && <Kpi label="Awaiting review" value={reviewTasks.length} tone={reviewTasks.length ? "warning" : "success"} foot={<span>you can act on these</span>} href="/governance/reviews" />}
      </div>

      <Section title="Dashboards">
        <div className="cb-chip-row">
          {Object.entries(DASHBOARDS).map(([role, d]) => <Link key={role} href={`/dashboards/${role}`} className="cb-chip">{d.title}</Link>)}
          <Link href="/graph" className="cb-chip">Knowledge Graph</Link>
          {viewer.has("crm.read") && <Link href="/crm" className="cb-chip">Sales pipeline</Link>}
        </div>
      </Section>

      {viewer.has("agent.read") && findings.length > 0 && (
        <Section title="Agent insights" action={{ label: "Agents console", href: "/agents" }}>
          <FindingsList findings={findings} limit={5} />
        </Section>
      )}

      <Section title="Knowledge domains">
        <div className="cb-grid cb-grid--4">
          {domains.map((d) => (
            <DomainCard key={d.href} {...d} />
          ))}
        </div>
      </Section>

      <div className="cb-grid cb-grid--2" style={{ marginTop: 36, gap: 32 }}>
        <div>
          <Section title="Recommended for you" className="cb-section--flush">
            {recommended.length ? (
              <ItemList>
                {recommended.map((i) => (
                  <ItemRow key={`${i.ref.type}:${i.ref.id}`} href={i.url} title={i.title} type={i.ref.type} status={i.status} subtitle={i.summary} meta={<span>{teamName(i.owningTeam)}</span>} />
                ))}
              </ItemList>
            ) : (
              <EmptyState title="No recommendations yet" description="Recommendations are based on your team membership and role. Once your identity is mapped to teams, knowledge owned by or shared with those teams appears here." />
            )}
          </Section>
        </div>
        <div>
          <Section title="Recently updated" action={{ label: "Search all", href: "/search" }}>
            {recent.length ? (
              <ItemList>
                {recent.map((i) => (
                  <ItemRow key={`${i.ref.type}:${i.ref.id}`} href={i.url} title={i.title} type={i.ref.type} status={i.status} meta={<span>{i.updatedAt}</span>} />
                ))}
              </ItemList>
            ) : (
              <EmptyState title="Nothing updated yet" description="Governed knowledge shows here as it is added or revised." />
            )}
          </Section>
        </div>
      </div>

      {viewer.has("rnd.read") && (
        <Section title="Active R&D and validated capabilities" action={{ label: "Open CROS", href: "/cros" }}>
          <div className="cb-grid cb-grid--2">
            <div className="cb-card">
              <div className="cb-item-row" style={{ background: "var(--bg-subtle)" }}>
                <strong className="cb-small">Active R&amp;D projects</strong>
                <span className="cb-subtle cb-small">{activeRnd.length}</span>
              </div>
              {activeRnd.length ? (
                activeRnd.map((p) => (
                  <ItemRow key={p.id} href={urlFor({ type: "rnd-project", id: p.id })} title={p.title} subtitle={p.summary} meta={<span className="cb-mono">{p.code}</span>} status={p.maturity ? `${p.maturity} ${MATURITY_MODEL[p.maturity].label}` : undefined} />
                ))
              ) : (
                <p className="cb-muted cb-small" style={{ padding: 16 }}>
                  No active R&amp;D projects are registered.
                </p>
              )}
            </div>
            <div className="cb-card">
              <div className="cb-item-row" style={{ background: "var(--bg-subtle)" }}>
                <strong className="cb-small">Validated capabilities (R4+)</strong>
                <span className="cb-subtle cb-small">{validatedCaps.length}</span>
              </div>
              {validatedCaps.length ? (
                validatedCaps.map((c) => <ItemRow key={c.id} href={urlFor({ type: "capability", id: c.id })} title={c.title} meta={<span className="cb-mono">{c.code}</span>} status={c.maturity} />)
              ) : (
                <p className="cb-muted cb-small" style={{ padding: 16 }}>
                  No capability has a governed maturity of R4 or above yet. Maturity is assigned through CROS evaluations, never inferred.
                </p>
              )}
            </div>
          </div>
        </Section>
      )}

      {viewer.has("copilot.read") && (
        <Section title="Internal tools and copilots" action={{ label: "Copilot registry", href: "/copilots" }}>
          {copilots.length ? (
            <div className="cb-grid cb-grid--3">
              {[...copilots]
                .sort((a, b) => (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9))
                .slice(0, 6)
                .map((c) => (
                  <Link key={c.id} href={urlFor({ type: "copilot", id: c.id })} className="cb-card cb-card--link cb-domain-card">
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <TypeBadge type="copilot" />
                      <StatusBadge status={c.status} />
                    </div>
                    <strong>{c.title}</strong>
                    <p>{c.purpose}</p>
                    <div className="cb-domain-card-meta">
                      <span>{teamName(c.owningTeam)}</span>
                      {c.accessUrl ? <Badge tone="success">Link configured</Badge> : <span>No deployment link yet</span>}
                    </div>
                  </Link>
                ))}
            </div>
          ) : (
            <EmptyState title="No copilots registered" />
          )}
          <p className="cb-subtle cb-small" style={{ marginTop: 10 }}>
            Ordered by maturity status. Usage analytics are not connected yet, so popularity is not shown.
          </p>
        </Section>
      )}

      {viewer.has("review.read") && (
        <Section title="Requires your attention" action={{ label: "Review queue", href: "/governance/reviews" }}>
          {reviewTasks.length ? (
            <div className="cb-stats">
              {Object.entries(
                reviewTasks.reduce<Record<string, number>>((acc, t) => {
                  acc[t.kind] = (acc[t.kind] ?? 0) + 1;
                  return acc;
                }, {}),
              ).map(([kind, n]) => (
                <Link key={kind} href={`/governance/reviews?kind=${kind}`} className="cb-card cb-stat cb-card--link">
                  <strong>{n}</strong>
                  <span>{kind.replace(/-/g, " ")}</span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="Nothing awaiting review" description="Approvals, publications and stale-content reviews you are authorized for will appear here." />
          )}
        </Section>
      )}
    </>
  );
}
