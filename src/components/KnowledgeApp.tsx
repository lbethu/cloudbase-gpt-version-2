"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleGauge,
  CloudUpload,
  Database,
  FileCheck2,
  FileText,
  FolderKanban,
  HardDrive,
  Layers3,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Search,
  ShieldCheck,
  Building2,
  Users,
  ClipboardCheck,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { allKnowledgeDocuments } from "@/data/knowledge-index";
import { richMockDocuments, sourceGroups, teamDefinitions } from "@/data/rich-mock";
import { sopKnowledgeDocuments, sopKnowledgeStats, sopNavigatorCompanies } from "@/data/sop-knowledge-base";
import { generateKnowledgeAnswer } from "@/lib/retrieval";
import { AIGuidanceModulesView, AutomationPreview, CloudBaseArchitecture, ReviewerDecisionsView } from "@/components/CloudBaseSections";
import { DriveSearchView } from "@/components/DriveSearchView";
import {
  KnowledgeAnswer,
  KnowledgeDocument,
  DocumentStatus,
} from "@/types/knowledge";

type View = "dashboard" | "architecture" | "ask" | "driveSearch" | "sopHub" | "teams" | "modules" | "navigator" | "library" | "upload" | "source" | "reviewer" | "decisions" | "integration";

const navItems: Array<{ id: View; label: string; icon: typeof Search }> = [
  { id: "dashboard", label: "CloudBase AI Home", icon: LayoutDashboard },
  { id: "architecture", label: "Architecture overview", icon: Layers3 },
  { id: "ask", label: "Ask CloudBase AI", icon: MessageSquareText },
  { id: "driveSearch", label: "Google Drive search", icon: HardDrive },
  { id: "sopHub", label: "Knowledge sources", icon: BookOpen },
  { id: "teams", label: "Team AI dashboards", icon: Users },
  { id: "modules", label: "AI guidance modules", icon: Sparkles },
  { id: "navigator", label: "SOP navigator", icon: FolderKanban },
  { id: "library", label: "Document library", icon: FileText },
  { id: "upload", label: "Upload knowledge", icon: CloudUpload },
  { id: "reviewer", label: "Reviewer notes", icon: ClipboardCheck },
  { id: "decisions", label: "Reviewer decisions", icon: FileCheck2 },
  { id: "integration", label: "Integration plan", icon: Layers3 },
];

const sampleQuestions = [
  "What does the Field Safety Checklist say to verify before field work?",
  "How do I create and send proposals and quotes?",
  "What should a PM review before project startup?",
  "How should inbound leads be qualified?",
];


const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const compactSearchText = (value: string) => normalizeSearchText(value).replace(/\s+/g, "");

const textMatches = (haystack: string, needle: string) => {
  const query = normalizeSearchText(needle);
  if (!query) return true;
  const text = normalizeSearchText(haystack);
  return text.includes(query) || compactSearchText(haystack).includes(compactSearchText(needle));
};

const searchableDocumentText = (doc: KnowledgeDocument) =>
  [
    doc.title,
    doc.type,
    doc.category,
    doc.ownerRole,
    doc.companyName,
    doc.sourceGroup,
    doc.department,
    doc.sourceFile,
    doc.sopNumber,
    doc.summary,
    ...(doc.tags || []),
    ...(doc.audience || []),
    ...(doc.exampleQuestions || []),
    ...(doc.sections || []).flatMap((section) => [section.title, section.summary]),
    ...(doc.chunks || []).flatMap((chunk) => [chunk.section, chunk.content, ...(chunk.keywords || [])]),
  ]
    .filter(Boolean)
    .join(" ");

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  const tone =
    status === "Indexed Real SOP" ? "green" : status === "Ready for Review" ? "green" : status === "Mock Prototype" ? "blue" : "amber";
  return <Badge tone={tone}>{status}</Badge>;
}

export function KnowledgeApp() {
  const [view, setView] = useState<View>("dashboard");
  const [selectedDocument, setSelectedDocument] = useState(allKnowledgeDocuments[0]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (next: View) => {
    setView(next);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSource = (document: KnowledgeDocument) => {
    setSelectedDocument(document);
    navigate("source");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Layers3 size={21} /></div>
          <div>
            <strong>CloudBase AI</strong>
            <span>Knowledge + Guidance + Automation</span>
          </div>
        </div>
        <button className="close-mobile" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X /></button>
        <div className="workspace-label">Workspace</div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={view === item.id ? "active" : ""}
                onClick={() => navigate(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
          <Link className="presentation-link" href="/presentation">
            <Sparkles size={18} />
            Executive walkthrough
          </Link>
        </nav>
        <div className="sidebar-status">
          <div className="status-icon"><ShieldCheck size={18} /></div>
          <div><strong>Review version</strong><span>Mock + real SOP navigator</span></div>
          <span className="status-dot" />
        </div>
        <div className="sidebar-footer">
          <div className="avatar">CP</div>
          <div><strong>Internal reviewer</strong><span>Prototype access</span></div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></button>
          <div className="topbar-title">
            <span>CloudBase AI internal operating foundation</span>
          </div>
          <div className="topbar-badges">
            <Badge tone="blue"><span className="pulse" /> Prototype Mode</Badge>
            <Badge tone="green">Real SOPs Indexed</Badge>
            <Badge tone="blue">Source-Backed</Badge>
            <Badge tone="green">Real-Data Ready</Badge>
            <Badge tone="green"><Check size={13} /> Review Version</Badge>
          </div>
        </header>
        <div className="content">
          {view === "dashboard" && <Dashboard navigate={navigate} />}
          {view === "architecture" && <CloudBaseArchitecture />}
          {view === "ask" && <AskView openSource={openSource} />}
          {view === "driveSearch" && <DriveSearchView />}
          {view === "sopHub" && <SopKnowledgeBase navigate={navigate} openSource={openSource} />}
          {view === "teams" && <TeamDashboards openSource={openSource} />}
          {view === "modules" && <AIGuidanceModulesView />}
          {view === "navigator" && <Navigator openSource={openSource} />}
          {view === "library" && <Library openSource={openSource} />}
          {view === "upload" && <Upload />}
          {view === "source" && <SourceViewer document={selectedDocument} />}
          {view === "reviewer" && <ReviewerMode />}
          {view === "decisions" && <ReviewerDecisionsView />}
          {view === "integration" && <Integration />}
        </div>
      </main>
    </div>
  );
}

function PageHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{copy}</p>
    </div>
  );
}

function Dashboard({ navigate }: { navigate: (view: View) => void }) {
  const actionCards = [
    { view: "ask" as View, icon: MessageSquareText, title: "AI Knowledge Guidance", copy: "Ask role-aware questions and receive source-backed next actions.", tone: "purple" },
    { view: "driveSearch" as View, icon: HardDrive, title: "Google Drive Search", copy: "Search your access-limited Drive folder live and jump straight to the file or its folder.", tone: "green" },
    { view: "architecture" as View, icon: Layers3, title: "Architecture Overview", copy: "See the five layers behind the CloudBase AI foundation.", tone: "navy" },
    { view: "teams" as View, icon: Users, title: "Team AI Dashboards", copy: "Open guidance for Sales, Field, PM/PL, Tech, Leadership, and onboarding.", tone: "green" },
    { view: "modules" as View, icon: Sparkles, title: "AI Guidance Modules", copy: "Explore ten planned knowledge and workflow assistants.", tone: "teal" },
    { view: "library" as View, icon: FileText, title: "Knowledge Sources", copy: "Review ownership, audience, status, and replacement plans.", tone: "blue" },
    { view: "decisions" as View, icon: ClipboardCheck, title: "Reviewer Decisions", copy: "Define the first governed real-data pilot and next build scope.", tone: "orange" },
  ];
  return (
    <>
      <section className="hero">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-copy">
          <div className="hero-kicker"><Sparkles size={15} /> Company intelligence and automation foundation</div>
          <h1>CloudBase AI.<br /><em>Knowledge into action.</em></h1>
          <p>Company Knowledge, AI Guidance, and Workflow Automation Foundation—designed to organize internal knowledge into a searchable, source-backed, role-aware AI platform.</p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => navigate("ask")}>Ask CloudBase AI <ArrowRight size={17} /></button>
            <button className="button secondary" onClick={() => navigate("architecture")}>Explore architecture</button>
          </div>
        </div>
        <div className="hero-panel">
          <div className="mini-window">
            <div className="window-top"><span /><span /><span /><Badge tone="green">Source-backed</Badge></div>
            <div className="question-preview"><Search size={17} /><span>What should the PM review before kickoff?</span></div>
            <div className="answer-preview">
              <div className="answer-spark"><Sparkles size={15} /></div>
              <div>
                <strong>Confirm authorization, scope, fee, schedule, and staffing.</strong>
                <p>The PM also validates client contacts, assumptions, exclusions, and communication cadence...</p>
                <div className="citation"><FileText size={12} /> PM Project Kickoff Checklist · PM review</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="prototype-note">
        <div className="note-icon"><ShieldCheck /></div>
        <div>
          <strong>CloudBase AI prototype—real SOP navigator connected.</strong>
          <p>CloudBase AI is a prototype internal AI knowledge and workflow platform. It now includes the mock foundation plus your imported real SOP files in a governed SOP Navigator for search and review.</p>
        </div>
        <Badge tone="green">45 real SOP sources</Badge>
      </section>

      <CloudBaseArchitecture compact />
      <KnowledgeSourceMap />

      <div className="section-title-row">
        <div><span className="eyebrow">CloudBase AI workspace</span><h2>Knowledge, guidance, and future automation</h2></div>
        <span className="section-note">A company-wide AI operating foundation</span>
      </div>
      <div className="action-grid">
        {actionCards.map((card) => {
          const Icon = card.icon;
          return (
            <button className="action-card" key={card.title} onClick={() => navigate(card.view)}>
              <span className={`action-icon ${card.tone}`}><Icon /></span>
              <strong>{card.title}</strong><p>{card.copy}</p>
              <span className="card-link">Open workspace <ChevronRight size={15} /></span>
            </button>
          );
        })}
      </div>

      <div className="metrics cloudbase-metrics">
        <div><strong>{10 + sopKnowledgeStats.sourceGroupCount}</strong><span>Knowledge sources</span></div>
        <div><strong>{allKnowledgeDocuments.length}</strong><span>Total documents</span></div>
        <div><strong>7</strong><span>Team AI dashboards</span></div>
        <div><strong>10</strong><span>AI guidance modules</span></div>
        <div><strong>10</strong><span>Future workflows</span></div>
        <div><strong>6</strong><span>Governance controls</span></div>
      </div>

      <AutomationPreview onOpen={() => navigate("modules")} />
      <CoverageMatrix />

      <section className="replacement-banner">
        <div><span className="eyebrow">Real-data-ready operating model</span><h2>Replace mock knowledge without replacing CloudBase AI.</h2></div>
        <p>Once approved, mock data can be replaced with real SOPs, COM site references, sales playbooks, PM/PL documents, field resources, technical documentation, and project knowledge.</p>
        <button className="button dark" onClick={() => navigate("integration")}>View integration plan <ArrowRight size={16} /></button>
      </section>
    </>
  );
}

function KnowledgeSourceMap() {
  return (
    <section className="source-map-section">
      <div className="section-title-row">
        <div><span className="eyebrow">Knowledge source map</span><h2>From internal sources to grounded answers</h2></div>
        <span className="section-note">A replaceable, governed knowledge pipeline</span>
      </div>
      <div className="source-map panel">
        {sourceGroups.map((group, index) => (
          <div className="source-map-item" key={group}>
            <span>{group}</span>
            {index < sourceGroups.length - 1 && <ArrowRight size={14} />}
          </div>
        ))}
        <div className="source-map-gpt"><Sparkles size={17} /><strong>Knowledge GPT</strong><span>Answers + sources</span></div>
      </div>
    </section>
  );
}

function CoverageMatrix() {
  const plan: Record<string, [string, string]> = {
    "COM Site": ["All Employees", "Map to approved COM collections"],
    "SOP Library": ["Delivery & Operations", "Replace with controlled SOP versions"],
    "Sales Playbook": ["Sales Team", "Connect CRM and proposal guidance"],
    "PM/PL Documents": ["PM/PL Team", "Map leadership checklists and guides"],
    "Field Team Resources": ["Field Team", "Connect mobile and field standards"],
    "Tech Team Resources": ["Technical Team", "Connect reviewed technical references"],
    "RFP / Proposal Knowledge": ["Sales Team", "Connect approved pursuit assets and proposal evidence"],
    "Training / Onboarding": ["New Employees", "Connect role-based learning paths"],
    "Project Templates": ["PM/PL Team", "Connect controlled project templates"],
    "Delivery Standards": ["Delivery Teams", "Connect client-facing delivery standards"],
  };
  return (
    <section className="coverage-section">
      <div className="section-title-row">
        <div><span className="eyebrow">Prototype coverage</span><h2>Document coverage matrix</h2></div>
        <Badge tone="green">Mock + real SOP content</Badge>
      </div>
      <div className="table-wrap panel">
        <table className="coverage-table">
          <thead><tr><th>Source group</th><th>Documents</th><th>Primary audience</th><th>Status</th><th>Real-data replacement plan</th></tr></thead>
          <tbody>{sourceGroups.map((group) => {
            const count = richMockDocuments.filter((document) => document.sourceGroup === group).length;
            return <tr key={group}><td><strong>{group}</strong></td><td>{count}</td><td>{plan[group][0]}</td><td><Badge tone="blue">Review Ready</Badge></td><td>{plan[group][1]}</td></tr>;
          })}</tbody>
        </table>
      </div>
    </section>
  );
}

function AskView({ openSource }: { openSource: (document: KnowledgeDocument) => void }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<KnowledgeAnswer | null>(null);
  const [scope, setScope] = useState("cloudpoint-real");
  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (query.trim()) setAnswer(generateKnowledgeAnswer(query, { companyId: scope }));
  };
  const ask = (question: string) => {
    setQuery(question);
    setAnswer(generateKnowledgeAnswer(question, { companyId: scope }));
  };
  return (
    <>
      <PageHeading eyebrow="Intelligence layer" title="Ask CloudBase AI" copy="Search your imported real SOP database. Enter any keyword or question to find the matching SOP and open the source." />
      <div className="ask-layout">
        <section className="ask-main panel">
          <div className="scope-selector">
            <div><Building2 size={16} /><span>Search workspace</span></div>
            <select value={scope} onChange={(event) => { setScope(event.target.value); setAnswer(null); }}>
              <option value="cloudpoint-real">Real SOP Knowledge Base</option>
              <option value="all">All CloudBase knowledge</option>
              <option value="prototype">Prototype mock knowledge base</option>
            </select>
          </div>
          <form className="ask-box" onSubmit={submit}>
            <div><Sparkles size={20} /><textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search real SOPs by keyword or ask a question…" /></div>
            <button className="button primary" type="submit">Search real SOPs <ArrowRight size={16} /></button>
          </form>
          {!answer ? (
            <div className="ask-empty">
              <div className="empty-icon"><MessageSquareText /></div>
              <h2>What would you like to know?</h2>
              <p>Search returns the matching SOP/PDF, the relevant section, and a source link you can open.</p>
              <div className="question-list">{sampleQuestions.map((question) => <button key={question} onClick={() => ask(question)}>{question}<ChevronRight size={15} /></button>)}</div>
            </div>
          ) : (
            <div className="answer-result">
              <div className="answer-header"><div className="answer-spark"><Sparkles size={17} /></div><div><span>Direct answer</span><Badge tone={answer.confidence === "High" ? "green" : answer.confidence === "Medium" ? "amber" : "neutral"}>{answer.confidence} confidence</Badge></div></div>
              <p className="direct-answer">{answer.answer}</p>
              <div className="source-label">Relevant sources</div>
              <div className="source-list">
                {answer.results.map((result) => (
                  <button key={result.chunk.id} onClick={() => openSource(result.document)}>
                    <div className="source-file"><FileText size={17} /></div>
                    <div><strong>{result.document.title}</strong><span>{result.chunk.section} · {result.document.companyName} · {result.document.category}</span></div>
                    <Badge tone={result.confidence === "High" ? "green" : result.confidence === "Medium" ? "amber" : "neutral"}>{result.confidence}</Badge>
                    <ChevronRight size={17} />
                  </button>
                ))}
              </div>
              {!!answer.relatedDocuments?.length && (
                <>
                  <div className="source-label">Related documents</div>
                  <div className="related-documents">{answer.relatedDocuments.map((document) => <button key={document.id} onClick={() => openSource(document)}><BookOpen size={14} /><span><strong>{document.title}</strong><small>{document.sourceGroup} · {document.audience?.join(", ")}</small></span><ChevronRight size={14} /></button>)}</div>
                </>
              )}
              {!!answer.betterQuestions?.length && (
                <div className="better-questions"><strong>Ask a better question</strong>{answer.betterQuestions.map((question) => <button key={question} onClick={() => ask(question)}>{question}</button>)}</div>
              )}
              <div className="next-step"><CircleGauge size={19} /><div><strong>Suggested next step</strong><p>{answer.nextStep}</p></div></div>
            </div>
          )}
        </section>
        <aside className="ask-aside">
          <div className="panel context-card"><span className="eyebrow">Search scope</span><h3>CloudBase AI knowledge base</h3><div className="scope-row"><span>Total documents</span><strong>{allKnowledgeDocuments.length}</strong></div><div className="scope-row"><span>Real SOP chunks</span><strong>{sopKnowledgeStats.chunkCount}</strong></div><div className="scope-row"><span>Mode</span><Badge tone="green">Real SOP + mock hybrid</Badge></div></div>
          <div className="panel tip-card"><ShieldCheck /><div><strong>Verify high-impact guidance</strong><p>Open cited sources before acting on contractual, client-facing, safety, or delivery-critical guidance.</p></div></div>
        </aside>
      </div>
    </>
  );
}

function SopKnowledgeBase({
  navigate,
  openSource,
}: {
  navigate: (view: View) => void;
  openSource: (document: KnowledgeDocument) => void;
}) {
  return (
    <>
      <PageHeading
        eyebrow="Company-wide knowledge hub"
        title="SOP Knowledge Base"
        copy="Explore each imported source folder separately: Field team, Sales book, Project manager and project lead, and SOP library."
      />
      <section className="sop-hub-hero panel">
        <div>
          <Badge tone="green">Real SOP Navigator connected</Badge>
          <h2>A company-wide AI knowledge foundation powered by your SOP folders.</h2>
          <p>The review library keeps each imported folder separate: Field team documents stay under Field Team, Sales book stays under Sales Book, PM/PL stays under Project Manager & Project Lead, and only the DOCX SOP folder appears under SOP Library.</p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => navigate("ask")}>Search SOP knowledge <Search size={16} /></button>
            <button className="button secondary" onClick={() => navigate("navigator")}>Open SOP navigator <ArrowRight size={16} /></button>
          </div>
        </div>
        <div className="sop-hub-stats">
          <div><strong>{sopKnowledgeStats.documentCount}</strong><span>Real SOP documents</span></div>
          <div><strong>{sopKnowledgeStats.chunkCount}</strong><span>Real SOP chunks</span></div>
          <div><strong>{sopKnowledgeStats.sourceGroupCount}</strong><span>Imported folders</span></div>
        </div>
      </section>

      <div className="section-title-row workspace-heading">
        <div><span className="eyebrow">Imported source collections</span><h2>CloudBase AI SOP knowledge groups</h2></div>
        <button className="text-action" onClick={() => navigate("navigator")}>View all in navigator <ArrowRight size={14} /></button>
      </div>
      <div className="company-grid">
        {sopNavigatorCompanies.map((group, index) => (
          <article className="company-card panel" key={group.id}>
            <div className={`company-mark ${["violet", "blue", "teal", "amber", "navy"][index % 5]}`}>{String(index + 1).padStart(2, "0")}</div>
            <div className="company-card-title"><div><h3>{group.name}</h3><p>{group.focus}</p></div><Badge tone="green">Real</Badge></div>
            <div className="company-metrics"><span><strong>{group.documentCount}</strong> documents</span><span><strong>{group.chunkCount}</strong> chunks</span></div>
            <button className="company-action" onClick={() => navigate("navigator")}>Browse collection <ArrowRight size={15} /></button>
          </article>
        ))}
      </div>
    </>
  );
}

function TeamDashboards({ openSource }: { openSource: (document: KnowledgeDocument) => void }) {
  const [teamId, setTeamId] = useState("all");
  const team = teamDefinitions.find((item) => item.id === teamId) || teamDefinitions[0];
  const documents = richMockDocuments.filter((document) =>
    document.audience?.some((audience) =>
      audience === team.audience || audience === team.secondaryAudience || (teamId === "all" && audience === "All Employees"),
    ),
  );
  return (
    <>
      <PageHeading eyebrow="Role-focused knowledge" title="Team dashboards" copy="Start with the processes, checklists, and questions most relevant to each employee group." />
      <div className="team-card-grid">
        {teamDefinitions.map((item) => (
          <button className={`team-selector panel ${teamId === item.id ? "selected" : ""}`} key={item.id} onClick={() => setTeamId(item.id)}>
            <div className="team-icon"><Users size={18} /></div><strong>{item.name}</strong><p>{item.description}</p><span>{richMockDocuments.filter((document) => document.audience?.includes(item.audience) || (item.secondaryAudience && document.audience?.includes(item.secondaryAudience))).length} relevant documents</span>
          </button>
        ))}
      </div>
      <section className="team-dashboard-hero panel">
        <div><Badge tone="blue">Prototype dashboard</Badge><h2>{team.name}</h2><p>{team.description}</p></div>
        <div className="team-question-bank"><span>Example questions</span>{team.questions.map((question) => <div key={question}><MessageSquareText size={13} />{question}</div>)}</div>
      </section>
      <div className="navigator-summary"><span>Recommended knowledge</span><strong>{documents.length} documents · Fictional CloudBase AI content</strong></div>
      <div className="document-grid">{documents.map((document) => <DocumentCard key={document.id} doc={document} openSource={openSource} />)}</div>
    </>
  );
}

function ReviewerMode() {
  const notes = [
    ["What is mock", "All documents in the 10 prototype source groups are fictional CloudBase AI examples. They demonstrate structure and workflow, not approved policy."],
    ["Workflow being tested", "Team navigation, source discovery, metadata filters, question retrieval, confidence, related documents, citations, upload staging, review ownership, and replacement planning."],
    ["Real data needed later", "Authoritative files or pages, source-system IDs, owners, effective and review dates, audience and permission groups, superseded versions, confidentiality, and approved example questions."],
    ["Approval decisions", "Confirm taxonomy, pilot audiences, source priority, answer format, access-control expectations, content-owner workflow, hosting, and the quality threshold for production rollout."],
  ];
  return (
    <>
      <PageHeading eyebrow="Reviewer mode" title="Prototype review notes" copy="A concise guide to what the product demonstrates and which decisions unlock real-data integration." />
      <section className="reviewer-banner panel"><ShieldCheck /><div><Badge tone="blue">Mock-first validation</Badge><h2>Approve the knowledge experience before connecting sensitive sources.</h2><p>The prototype is intentionally rich enough to test realistic employee journeys while keeping fictional content clearly separated from authoritative company policy.</p></div></section>
      <div className="reviewer-grid">{notes.map(([title, copy], index) => <article className="panel" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <section className="panel approval-checklist"><span className="eyebrow">Reviewer checklist</span><h2>Recommended approval questions</h2>{["Do the 10 source groups match how employees look for knowledge?", "Do team dashboards surface the right starting documents?", "Is the source-backed answer format clear enough for internal use?", "Which authoritative collection should be connected first?", "Who owns content approval, access, freshness, and retirement?"].map((item) => <div key={item}><Check size={15} />{item}</div>)}</section>
    </>
  );
}

function Navigator({ openSource }: { openSource: (document: KnowledgeDocument) => void }) {
  const [selected, setSelected] = useState("All SOPs");
  const sopGroups = [...new Set(sopKnowledgeDocuments.map((doc) => doc.sourceGroup || "Imported SOPs"))];
  const visible = selected === "All SOPs" ? sopKnowledgeDocuments : sopKnowledgeDocuments.filter((doc) => doc.sourceGroup === selected);
  return (
    <>
      <PageHeading eyebrow="Guided discovery" title="SOP Navigator" copy="Browse the imported real SOP folders by knowledge source group, then open any source-backed document or chunk." />
      <div className="navigator-toolbar panel">
        <div className="navigator-company"><div className="company-mark violet">SOP</div><div><span>Review workspace</span><strong>CloudBase AI Real SOP Knowledge Base</strong></div></div>
        <div className="library-toggle">
          <button className="selected" onClick={() => setSelected("All SOPs")}><Sparkles size={15} /> {sopKnowledgeStats.documentCount} real SOP sources</button>
        </div>
      </div>
      <div className="category-tabs">
        {["All SOPs", ...sopGroups].map((category) => <button className={selected === category ? "selected" : ""} key={category} onClick={() => setSelected(category)}>{category}</button>)}
      </div>
      <div className="navigator-summary"><span>{selected}</span><strong>{visible.length} {visible.length === 1 ? "document" : "documents"} · Imported real SOP content</strong></div>
      <div className="document-grid">
        {visible.map((doc) => <DocumentCard key={doc.id} doc={doc} openSource={openSource} />)}
        {!visible.length && <div className="empty-category"><FolderKanban /><h3>No imported SOPs found</h3><p>Try another folder/category or clear the navigator filter.</p></div>}
      </div>
    </>
  );
}

function DocumentCard({ doc, openSource }: { doc: KnowledgeDocument; openSource: (doc: KnowledgeDocument) => void }) {
  return (
    <article className="document-card">
      <div className="doc-card-top"><span className="document-icon"><FileText /></span><StatusBadge status={doc.status} /></div>
      <span className="doc-type">{doc.companyName ? `${doc.companyName} · ` : ""}{doc.type}</span><h3>{doc.title}</h3><p>{doc.summary}</p>
      {doc.sourceGroup && <div className="document-meta-line"><span>{doc.sourceGroup}</span><span>{doc.department}</span><span>{doc.audience?.join(" / ")}</span></div>}
      <div className="tag-row">{doc.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="doc-card-footer"><span>{doc.chunks.length} chunks · {doc.ownerRole}</span><button onClick={() => openSource(doc)}>View source <ArrowRight size={14} /></button></div>
    </article>
  );
}

function Library({ openSource }: { openSource: (document: KnowledgeDocument) => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [source, setSource] = useState("All");
  const allCategories = [...new Set(allKnowledgeDocuments.map((document) => document.category))];
  const filtered = useMemo(() => allKnowledgeDocuments.filter((doc) => {
    const matchesSearch = textMatches(searchableDocumentText(doc), search);
    return matchesSearch && (category === "All" || doc.category === category) && (status === "All" || doc.status === status) && (source === "All" || doc.sourceKind === source);
  }), [search, category, status, source]);
  return (
    <>
      <PageHeading eyebrow="Governed content" title="Document library" copy="Review indexed knowledge, ownership, status, tags, and chunk coverage." />
      <div className="library-toolbar panel">
        <label className="search-field"><Search size={17} /><input placeholder="Search title, SOP number, source folder, or inside document text" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
        <select value={source} onChange={(e) => setSource(e.target.value)}><option value="All">All sources</option><option value="real">Real SOPs</option><option value="mock">Mock prototype</option></select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}><option>All</option>{allCategories.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>Indexed Real SOP</option><option>Mock Prototype</option><option>Ready for Review</option><option>Replace with Real Data Later</option></select>
        <span>{filtered.length} results</span>
      </div>
      <div className="table-wrap panel">
        <table>
          <thead><tr><th>Document</th><th>Workspace / folder</th><th>Category</th><th>Owner / role</th><th>Updated</th><th>Status</th><th>Chunks</th><th /></tr></thead>
          <tbody>{filtered.map((doc) => (
            <tr key={doc.id}>
              <td><div className="table-document"><span><FileText size={17} /></span><div><strong>{doc.title}</strong><small>{doc.type} · {doc.tags.slice(0, 2).join(", ")}</small></div></div></td>
              <td><Badge tone={doc.sourceKind === "real" ? "green" : "neutral"}>{doc.companyName}</Badge></td><td><Badge>{doc.category}</Badge></td><td>{doc.ownerRole}</td><td>{doc.lastUpdated}</td><td><StatusBadge status={doc.status} /></td><td>{doc.chunks.length}</td><td><button className="icon-button" onClick={() => openSource(doc)}><ChevronRight size={18} /></button></td>
            </tr>
          ))}</tbody>
        </table>
        {!filtered.length && <div className="no-results"><Search /><h3>No documents match</h3><p>Try clearing a filter or using a broader term.</p></div>}
      </div>
    </>
  );
}

function Upload() {
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return (
    <>
      <PageHeading eyebrow="Knowledge ingestion" title="Upload knowledge" copy="Stage internal content for extraction, review, and indexing." />
      <div className="upload-success panel">
        <div className="success-ring"><Check /></div><Badge tone="green">Submission staged</Badge><h2>Document received for processing</h2><p>{fileName || "Your document"} has been staged in this front-end prototype. No file was transmitted or stored.</p>
        <div className="processing-list">
          <div className="done"><Check /> <span><strong>Metadata captured</strong><small>Title, category, type, and review notes recorded</small></span></div>
          <div><span className="step-number">2</span><span><strong>Text extraction pending</strong><small>Production workflow will parse PDF, DOCX, TXT, and Markdown</small></span></div>
          <div><span className="step-number">3</span><span><strong>Ready for review before indexing</strong><small>A content owner approves chunks and access metadata</small></span></div>
        </div>
        <button className="button secondary" onClick={() => setSubmitted(false)}>Stage another document</button>
      </div>
    </>
  );
  return (
    <>
      <PageHeading eyebrow="Knowledge ingestion" title="Upload knowledge" copy="Capture a document and its governance metadata before extraction and indexing." />
      <div className="upload-layout">
        <form className="panel upload-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <div className="form-section-title"><span>01</span><div><h3>Select a source file</h3><p>Supported prototype formats: PDF, DOCX, TXT, and Markdown.</p></div></div>
          <label className="dropzone"><CloudUpload /><strong>{fileName || "Drop a file here or click to browse"}</strong><span>Maximum recommended size: 25 MB</span><input type="file" accept=".pdf,.docx,.txt,.md" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} /></label>
          <div className="form-section-title"><span>02</span><div><h3>Add knowledge metadata</h3><p>Metadata improves retrieval, ownership, and future access control.</p></div></div>
          <div className="form-grid">
            <label className="wide">Document title<input required placeholder="e.g., Field Collection Setup SOP" /></label>
            <label>Company workspace<select required defaultValue="cloudpoint-real"><option value="cloudpoint-real">CloudBase AI Real SOP Knowledge Base</option><option value="prototype">CloudBase AI Mock Foundation</option></select></label>
            <label>Document type<select required defaultValue=""><option value="" disabled>Select type</option><option>Standard Operating Procedure</option><option>Playbook</option><option>Role Guide</option><option>Internal Reference</option></select></label>
            <label>Category<select required defaultValue=""><option value="" disabled>Select category</option>{[...new Set(richMockDocuments.map((document) => document.category))].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="wide">Tags<input placeholder="Add comma-separated tags" /></label>
            <label className="wide">Reviewer notes<textarea placeholder="Add context, replacement notes, or review instructions" /></label>
          </div>
          <div className="form-actions"><span><ShieldCheck size={16} /> Files remain local in Version 1</span><button className="button primary" type="submit">Submit for processing <ArrowRight size={16} /></button></div>
        </form>
        <aside className="panel upload-guide"><span className="eyebrow">Ingestion controls</span><h3>Designed for governed knowledge</h3>{["Capture ownership and classification", "Extract and normalize source text", "Review proposed sections and chunks", "Apply access-control metadata", "Approve before search indexing"].map((item, index) => <div key={item}><span>{index + 1}</span>{item}</div>)}</aside>
      </div>
    </>
  );
}

function SourceViewer({ document }: { document: KnowledgeDocument }) {
  const [sourceSearch, setSourceSearch] = useState("");
  const visibleSections = document.sections.filter((section) =>
    textMatches(`${section.title} ${section.summary}`, sourceSearch),
  );
  const visibleChunks = document.chunks.filter((chunk) =>
    textMatches(`${chunk.section} ${chunk.content} ${(chunk.keywords || []).join(" ")}`, sourceSearch),
  );
  return (
    <>
      <div className="source-heading">
        <div><span className="eyebrow">Source viewer</span><h1>{document.title}</h1><p>{document.summary}</p></div>
        <StatusBadge status={document.status} />
      </div>
      <div className="source-layout">
        <article className="panel source-content">
          <div className="source-document-head"><span className="document-icon large"><FileText /></span><div><span>{document.type}</span><strong>{document.category}</strong></div></div>
          <label className="search-field source-search-field"><Search size={17} /><input placeholder="Search inside this source document" value={sourceSearch} onChange={(e) => setSourceSearch(e.target.value)} /></label>
          <h2>Key sections</h2>
          {visibleSections.map((section) => <div className="key-section" key={section.title}><Check size={16} /><div><strong>{section.title}</strong><p>{section.summary}</p></div></div>)}
          {!!sourceSearch && !visibleSections.length && <div className="no-results inline"><Search /><h3>No matching key sections</h3><p>Try another word, SOP number, folder name, or phrase from the source.</p></div>}
          <h2>Indexed sample chunks</h2>
          <div className="chunk-list">{visibleChunks.map((chunk, index) => <section key={chunk.id}><div className="chunk-head"><span>CHUNK {String(index + 1).padStart(2, "0")}</span><Badge>{chunk.section}</Badge></div><p>{chunk.content}</p><div className="tag-row">{chunk.keywords.map((tag) => <span key={tag}>{tag}</span>)}</div></section>)}</div>
          {!!sourceSearch && !visibleChunks.length && <div className="no-results inline"><Search /><h3>No matching chunks</h3><p>This source is indexed, but that exact keyword was not found in the extracted chunks.</p></div>}
          {!!document.exampleQuestions?.length && <><h2>Example questions</h2><div className="example-question-list">{document.exampleQuestions.map((question) => <div key={question}><MessageSquareText size={14} />{question}</div>)}</div></>}
          {!!document.relatedDocuments?.length && <><h2>Related documents</h2><div className="tag-row">{document.relatedDocuments.map((id) => <span key={id}>{allKnowledgeDocuments.find((item) => item.id === id)?.title || id}</span>)}</div></>}
        </article>
        <aside>
          <div className="panel metadata-card"><span className="eyebrow">Document metadata</span><dl><div><dt>Workspace / folder</dt><dd>{document.companyName || "Prototype Library"}</dd></div>{document.sourceGroup && <div><dt>Source group</dt><dd>{document.sourceGroup}</dd></div>}{document.sopNumber && <div><dt>SOP number</dt><dd>{document.sopNumber}</dd></div>}<div><dt>Owner / role</dt><dd>{document.ownerRole}</dd></div>{document.department && <div><dt>Department</dt><dd>{document.department}</dd></div>}{document.audience && <div><dt>Audience</dt><dd>{document.audience.join(", ")}</dd></div>}<div><dt>Last updated</dt><dd>{document.lastUpdated}</dd></div>{document.reviewStatus && <div><dt>Review status</dt><dd>{document.reviewStatus}</dd></div>}{document.confidentialityLevel && <div><dt>Confidentiality</dt><dd>{document.confidentialityLevel}</dd></div>}{document.effectiveDate && <div><dt>Effective date</dt><dd>{document.effectiveDate}</dd></div>}<div><dt>Knowledge chunks</dt><dd>{document.chunks.length}</dd></div><div><dt>Category</dt><dd>{document.category}</dd></div>{document.sourceFile && <div><dt>Original source</dt><dd>{document.sourceFile}</dd></div>}{document.sourceUrl && <div><dt>Open file</dt><dd><a className="source-open-link" href={document.sourceUrl} target="_blank" rel="noreferrer">Open original {document.documentType === "PDF" ? "PDF" : "file"}</a></dd></div>}</dl><div className="tag-row">{document.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
          <div className="panel replacement-note"><Database /><div><strong>Future replacement note</strong><p>{document.sourceKind === "real" ? "This source was imported from your local source-documents folder for prototype indexing. Verify the original file before official use, and add owner approval/access controls before production rollout." : "This content is fictional and contains no confidential company material. Replace it with an approved, access-controlled source during real-data ingestion."}</p></div></div>
        </aside>
      </div>
    </>
  );
}

function Integration() {
  const phases = [
    ["01", "Mock prototype approval", "Validate the information architecture, workflows, answer format, content taxonomy, and reviewer experience.", "Current phase"],
    ["02", "Real SOP ingestion", "Inventory approved SOPs, assign owners, extract content, review chunks, and establish freshness rules.", "Next"],
    ["03", "COM, sales & PM/PL mapping", "Connect governed reference collections and normalize metadata across operating groups.", "Planned"],
    ["04", "Access control & review workflow", "Enforce identity-aware retrieval, document permissions, approvals, feedback, and audit history.", "Planned"],
    ["05", "Production-ready deployment", "Add hybrid vector search, approved model synthesis, observability, evaluation, and secure hosting.", "Future"],
  ];
  return (
    <>
      <PageHeading eyebrow="Production pathway" title="Real data integration plan" copy="A deliberate path from a safe workflow prototype to a governed enterprise knowledge system." />
      <div className="integration-hero panel"><div><Badge tone="green">Architecture ready</Badge><h2>Replace the corpus—not the experience.</h2><p>The interface, metadata model, document lifecycle, source viewer, and retrieval contract are already separated from the mock content layer.</p></div><div className="architecture-mini"><span>Internal sources</span><ArrowRight /><span>Governed ingestion</span><ArrowRight /><span>Hybrid retrieval</span><ArrowRight /><span>Grounded answers</span></div></div>
      <div className="phase-list">{phases.map(([number, title, copy, status]) => <article className="panel" key={number}><div className="phase-number">{number}</div><div><div className="phase-title"><h3>{title}</h3><Badge tone={status === "Current phase" ? "green" : status === "Next" ? "blue" : "neutral"}>{status}</Badge></div><p>{copy}</p></div></article>)}</div>
      <div className="guardrail-grid">
        <div className="panel"><ShieldCheck /><h3>Security by default</h3><p>Source permissions, group membership, document classification, and retrieval filters must be applied before content reaches an answer model.</p></div>
        <div className="panel"><FileCheck2 /><h3>Human governance</h3><p>Content owners review extraction, approve chunks, set freshness dates, and resolve employee feedback through a visible workflow.</p></div>
        <div className="panel"><CircleGauge /><h3>Measured quality</h3><p>A representative question set evaluates retrieval relevance, citation validity, answer faithfulness, and abstention behavior.</p></div>
      </div>
    </>
  );
}
