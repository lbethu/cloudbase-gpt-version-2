import Link from "next/link";
import { ArrowUpRight, Bot, BookOpen, Briefcase, CheckCircle2, FileCode2, FlaskConical, FolderUp, KeyRound, Lock, Orbit, Scale, Search, Sparkles, Users, Wand2, Workflow } from "lucide-react";
import { MATURITY_MODEL } from "@/domain";
import { Badge, StatusBadge, TypeBadge } from "@/components/ui/Badge";
import { DomainCard, EmptyState, ItemList, ItemRow, Section } from "@/components/ui/primitives";
import { FindingsList, Kpi } from "@/components/dashboard/widgets";
import { summarizeFindings } from "@/server/agents/engine";
import { agentFindings } from "@/server/services/agents";
import { DASHBOARDS } from "@/server/services/dashboards";
import { getConfig } from "@/server/config";
import { getRepositories, storageDegradedReason } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { deriveReviewTasks } from "@/server/services/reviews";
import { permittedItems, recentlyUpdated } from "@/server/services/search";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export default async function HomePage() {
  const viewer = await getViewer();
  const cfg = getConfig();
  // Whether an upload could actually be saved. Offering the link when it
  // cannot only teaches people that the platform lies to them; the Drive route
  // below is the honest answer until the database and document store are on.
  const uploadsPossible =
    !storageDegradedReason() && (cfg.env !== "production" || (cfg.storage.mode === "postgres" && cfg.blob.mode !== "local"));
  const firstName = (viewer.identity?.name || viewer.identity?.email || "").split(/[\s@.]/)[0];
  const greeting = firstName ? `Welcome, ${firstName[0].toUpperCase()}${firstName.slice(1)}.` : "Welcome.";

  /**
   * How an SOP actually comes into existence at Cloudpoint, in the order a
   * person does it. This is the first thing on the page because "how do I add
   * one?" is the question that otherwise gets asked in a message to someone.
   * A step whose destination is not configured is dropped rather than shown as
   * a dead link.
   */
  const sopSteps = [
    cfg.links.sopCopilot && {
      n: 1,
      icon: <Wand2 />,
      title: "Draft it with the SOP Copilot",
      body: "Describe the procedure in your own words and the copilot writes it up in Cloudpoint's structure — purpose, prerequisites, steps, verification. Minutes, not an afternoon.",
      cta: "Open the SOP Copilot",
      href: cfg.links.sopCopilot,
    },
    cfg.links.sopDriveFolder && {
      n: 2,
      icon: <FolderUp />,
      title: "Put it in the SOP folder",
      body: "Upload the finished document to the shared Cloudpoint SOP folder in Google Drive. Updating an existing SOP works the same way — keep the same structure so the versions stay comparable.",
      cta: "Open the SOP folder",
      href: cfg.links.sopDriveFolder,
    },
    {
      n: 3,
      icon: <CheckCircle2 />,
      title: "Wait for it to be verified",
      body: "The AI & Automation team checks the structure and an owner approves it. Only then does it become official and appear here in search. Nothing is published because software said so.",
    },
  ].filter(Boolean) as Array<{ n: number; icon: React.ReactNode; title: string; body: string; cta?: string; href?: string }>;

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

  /**
   * Orientation for someone who has just been given the link. Each entry says
   * what the area is and, more usefully, when a person would actually come
   * here — the second sentence is the one that stops people guessing.
   */
  const areas = [
    { href: "/find", title: "Find an SOP", icon: <Search />, what: "Searches inside the documents, not just their titles, and opens them here in CloudBase.", when: "Start here when you know what you need but not which document it is in.", permission: "sop.read" as const },
    { href: "/sops", title: "SOP Library", icon: <BookOpen />, what: "Every procedure with its version history, owner and approval evidence.", when: uploadsPossible ? "When you want to browse a team's procedures, or upload and approve one." : "When you want to browse a team's procedures and see what has been approved.", permission: "sop.read" as const },
    { href: "/ask", title: "Ask CloudBase", icon: <Sparkles />, what: "Answers built only from documents you are allowed to read, with the source cited every time.", when: "When your question spans several documents. It abstains rather than guessing.", permission: "ask.use" as const },
    { href: "/teams", title: "Team Workspaces", icon: <Users />, what: "Everything one team owns or shares, in one place, plus the AI built for them.", when: "When you are new to a team, or looking for who owns something.", permission: "knowledge.read" as const },
    { href: "/cros", title: "CROS · R&D", icon: <Orbit />, what: "Cloudpoint Research Operating System: ideas, experiments, evidence and the maturity of each capability.", when: "When you need to know whether something is proven or still being explored.", permission: "rnd.read" as const },
    { href: "/solutions", title: "AI Solutions", icon: <Workflow />, what: "Every business problem given to the AI team, answered with an agent and a copilot.", when: "When something you do daily should be automated — describe the problem, not the solution.", permission: "knowledge.read" as const },
    { href: "/copilots", title: "Copilots & Agents", icon: <Bot />, what: "The registry of Cloudpoint AI assistants: what each may do, what it may never decide, and where its data goes.", when: "Before trusting or building on any AI tool here.", permission: "copilot.read" as const },
    { href: "/projects", title: "Project Intelligence", icon: <Briefcase />, what: "Past work written up so it can be reused in proposals and delivery.", when: "When writing a proposal, or when a client asks what we have done before.", permission: "knowledge.read" as const },
    { href: "/docs", title: "Documentation", icon: <FileCode2 />, what: "Engineering standards and how-to guides, including how to use AI safely on Cloudpoint work.", when: "When you need the standard rather than someone's memory of it.", permission: "knowledge.read" as const },
    { href: "/governance/reviews", title: "Governance", icon: <Scale />, what: "What is waiting for approval, who may approve it, and an audit trail of every privileged action.", when: "When you own content, approve it, or need to show how a decision was made.", permission: "review.read" as const },
  ].filter((a) => viewer.has(a.permission));

  return (
    <>
      <section className="cb-hero">
        <span className="cb-eyebrow">Cloudpoint Geospatial · Internal</span>
        <h1>{greeting}</h1>
        <p className="cb-hero-sub">
          This is <strong>CloudBase AI</strong> — the one place Cloudpoint keeps how we do things. Standard operating procedures, project history, research, and
          the AI we build on top of them. Search it in plain words and it looks <em>inside</em> the documents, not just at their titles. Every document here has
          an owner, a version and an approval; nothing becomes official because software said so.
        </p>
        <p className="cb-hero-by">Developed by Loki &amp; Team · Cloudpoint Geospatial AI &amp; Automation</p>
        <span className="cb-hero-tag">
          <Lock size={12} /> Internal platform — not a public site
        </span>
        <form className="cb-hero-search" action="/find" method="get" role="search">
          <div className="cb-hero-search-wrap">
            <Search aria-hidden="true" />
            <input className="cb-input" type="search" name="q" placeholder="Type a word that appears in an SOP — expenses, invoice, startup…" aria-label="Find an SOP" autoComplete="off" />
          </div>
          <button className="cb-btn cb-btn--primary" type="submit">
            Find an SOP
          </button>
          {viewer.has("ask.use") && (
            <Link className="cb-btn" href="/ask">
              <Sparkles /> Ask CloudBase
            </Link>
          )}
        </form>
        <div className="cb-quick-actions">
          {viewer.has("knowledge.read") && <Link className="cb-chip" href="/search">Search everything</Link>}
          {viewer.has("sop.author") && uploadsPossible && <Link className="cb-chip" href="/sops/upload">Upload an SOP</Link>}
          {viewer.has("knowledge.read") && <Link className="cb-chip" href="/teams">Team workspaces</Link>}
          {viewer.has("rnd.read") && <Link className="cb-chip" href="/cros">CROS · R&amp;D</Link>}
          {viewer.has("knowledge.read") && <Link className="cb-chip" href="/solutions">AI Solutions</Link>}
          {viewer.has("knowledge.read") && <Link className="cb-chip" href="/docs/cloudbase/using-ai-safely">Using AI safely</Link>}
        </div>
      </section>

      <Section title="Need a new SOP? Three steps.">
        <p className="cb-subtle cb-small" style={{ marginTop: -4, marginBottom: 12 }}>
          The same three steps whether you are writing a new procedure or updating one that already exists.
        </p>
        <div className="cb-steps">
          {sopSteps.map((step) => (
            <div key={step.n} className="cb-step">
              <span className="cb-step-num">{step.n}</span>
              <span className="cb-step-head">
                {step.icon}
                {step.title}
              </span>
              <p>{step.body}</p>
              {step.href && (
                <a className="cb-btn cb-btn--sm" href={step.href} target="_blank" rel="noopener noreferrer">
                  {step.cta} <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          ))}
        </div>
        <p className="cb-subtle cb-small" style={{ marginTop: 12 }}>
          <strong>Already have the SOP and just need to read it?</strong> Don't go to Drive — search above, or open the{" "}
          <Link href="/find">SOP finder</Link>. That searches the text inside every approved SOP and opens the document right here.
        </p>
        <p className="cb-subtle cb-small cb-keepcode">
          <KeyRound size={13} /> <span>Keep your access code somewhere safe — it is how you get back in, it belongs to you alone, and it should not be forwarded to anyone.</span>
        </p>
      </Section>

      <Section title="What lives where">
        <div className="cb-map">
          {areas.map((a) => (
            <Link key={a.href} href={a.href} className="cb-map-card">
              <span className="cb-map-card-head">
                {a.icon}
                {a.title}
              </span>
              <p>{a.what}</p>
              <span className="cb-map-when">{a.when}</span>
            </Link>
          ))}
        </div>
      </Section>

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
