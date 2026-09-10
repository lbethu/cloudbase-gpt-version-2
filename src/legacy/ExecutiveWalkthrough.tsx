import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleCheck,
  CloudUpload,
  Database,
  FileCheck2,
  FileSearch,
  Files,
  FolderKanban,
  GitBranch,
  GraduationCap,
  HardHat,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import { richMockDocuments, sourceGroups, teamDefinitions } from "@/legacy/data/rich-mock";
import { aiGuidanceModules } from "@/legacy/data/ai-modules";
import styles from "./ExecutiveWalkthrough.module.css";

const sections = [
  ["opening", "Overview"],
  ["problem", "Problem"],
  ["solution", "Solution"],
  ["architecture", "Architecture"],
  ["mock-strategy", "Mock strategy"],
  ["coverage", "Coverage"],
  ["teams", "Team AI"],
  ["modules", "AI modules"],
  ["retrieval", "Q&A workflow"],
  ["ingestion", "Ingestion"],
  ["governance", "Governance"],
  ["approval", "Approval"],
  ["roadmap", "Roadmap"],
  ["summary", "Summary"],
];

const sourceDetails = [
  ["COM Site References", "Internal navigation and resource discovery", "Navigation guide, resource directory", "All Employees", FolderKanban],
  ["SOP Library", "Repeatable operational procedures", "Project setup, GIS data, QA/QC", "Delivery teams", FileCheck2],
  ["Sales Playbook", "Consistent pursuit and handoff practices", "Discovery, RFP intake, proposal checklist", "Sales Team", BriefcaseBusiness],
  ["PM/PL Documents", "Commercial and technical leadership", "Kickoff, milestones, risk, readiness", "PM/PL Team", Target],
  ["Field Team Resources", "Prepared, consistent field collection", "Equipment, mobile collection, handoff", "Field Team", HardHat],
  ["Technical Team Resources", "Maintainable technical delivery", "Automation intake, code review, QA", "Technical Team", Wrench],
  ["Training / Onboarding", "Role-based learning and onboarding", "First-week and role readiness paths", "New and All Employees", GraduationCap],
  ["RFP / Proposal Knowledge", "Qualification, compliance, and proposal evidence", "Compliance matrix, proposal asset library", "Sales Team", BriefcaseBusiness],
  ["Project Templates", "Reusable, controlled project workflows", "Kickoff agenda, client status template", "PM/PL Team", FolderKanban],
  ["Delivery Standards", "Consistent client-facing quality and acceptance", "Delivery acceptance, cartographic standard", "Delivery teams", FileCheck2],
] as const;

const coverageRows = [
  ["COM Site References", "COM Site Navigation Guide; Internal Resource Directory; Templates & Forms Reference", "All Employees", "Validate resource discovery", "Approved COM collections"],
  ["SOP Library", "Project Setup; GIS Data Management; QA/QC; Deliverable Packaging", "Delivery teams", "Validate governed procedures", "Controlled SOP versions"],
  ["Sales Playbook", "Discovery Workflow; RFP Intake; Proposal Checklist; Delivery Handoff", "Sales Team", "Validate pursuit workflows", "CRM and proposal guidance"],
  ["PM/PL Documents", "PM Kickoff; PL Review; Client Updates; Risk Escalation", "PM/PL Team", "Validate leadership workflows", "Approved PM/PL guides"],
  ["Field Team Resources", "Field Preparation; Equipment; Photos; Office Handoff", "Field Team", "Validate field workflows", "Mobile and field standards"],
  ["Technical Team Resources", "Automation Intake; Script Review; QA Automation; Knowledge Ingestion", "Technical Team", "Validate technical governance", "Reviewed technical references"],
  ["RFP / Proposal Knowledge", "Compliance Matrix; Proposal Evidence Library", "Sales Team", "Validate pursuit intelligence", "Approved proposal assets"],
  ["Training / Onboarding", "Onboarding Reference; Role Readiness Checklist", "New Employees", "Validate guided onboarding", "Approved learning paths"],
  ["Project Templates", "Kickoff Agenda; Client Status Report", "PM/PL Team", "Validate reusable workflows", "Controlled project templates"],
  ["Delivery Standards", "Delivery Acceptance; Cartographic Standard", "Delivery teams", "Validate client-facing quality", "Approved delivery standards"],
];

const teamIcons = [Users, BriefcaseBusiness, HardHat, Target, Wrench, BrainCircuit, GraduationCap];

const roadmap = [
  ["01", "Mock Prototype Review", "Validate the dashboard, structure, team views, and source-backed answer format."],
  ["02", "Real SOP Mapping", "Replace fictional procedures with approved internal SOP documents."],
  ["03", "COM & Team Integration", "Map COM references, playbooks, PM/PL guides, and field and technical resources."],
  ["04", "Governance & Permissions", "Add ownership, review workflows, classifications, and identity-aware access rules."],
  ["05", "Production Knowledge Assistant", "Deploy monitored retrieval with approved models and a sustainable update process."],
];

function SectionHeading({
  number,
  eyebrow,
  title,
  copy,
}: {
  number: string;
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <span className={styles.sectionNumber}>{number}</span>
      <div>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
    </div>
  );
}

function Flow({
  items,
  compact = false,
}: {
  items: Array<{ title: string; copy?: string; icon?: typeof Search }>;
  compact?: boolean;
}) {
  return (
    <div className={`${styles.flow} ${compact ? styles.compactFlow : ""}`}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div className={styles.flowGroup} key={item.title}>
            <div className={styles.flowCard}>
              {Icon && <Icon size={19} />}
              <strong>{item.title}</strong>
              {item.copy && <span>{item.copy}</span>}
            </div>
            {index < items.length - 1 && <ArrowRight className={styles.flowArrow} size={18} />}
          </div>
        );
      })}
    </div>
  );
}

export function ExecutiveWalkthrough() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span><Layers3 size={20} /></span>
          <div><strong>CloudBase AI</strong><small>Knowledge + Guidance + Automation</small></div>
        </Link>
        <div className={styles.headerBadges}>
          <span><ShieldCheck size={13} /> Prototype Mode</span>
          <span><CircleCheck size={13} /> Ready for Review</span>
        </div>
        <Link className={styles.backLink} href="/">Return to product <ArrowRight size={14} /></Link>
      </header>

      <nav className={styles.miniNav} aria-label="Walkthrough sections">
        <span>Executive Walkthrough</span>
        <div>{sections.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</div>
      </nav>

      <main style={{ marginLeft: 0, minHeight: 0 }}>
        <section className={styles.hero} id="opening">
          <div className={styles.heroGlow} />
          <div className={styles.heroContent}>
            <div className={styles.heroBadges}>
              <span><Sparkles size={13} /> Executive Product Walkthrough</span>
              <span>Prototype Mode — Mock Company-Style Data</span>
            </div>
            <h1>CloudBase AI</h1>
            <h2>Company Knowledge, AI Guidance, and Workflow Automation Foundation</h2>
            <p>CloudBase AI is a prototype internal AI knowledge and workflow platform using mock company-style data. It validates the structure, experience, architecture, and operating model before connecting real internal documents and production AI services.</p>
            <div className={styles.heroActions}>
              <a href="#problem">Start the walkthrough <ArrowRight size={16} /></a>
              <Link href="/"><BookOpen size={16} /> Open working prototype</Link>
            </div>
          </div>
          <div className={styles.valueGrid}>
            {[
              ["Company Knowledge Foundation", "Ten structured source groups across company operations.", Network],
              ["Role-Aware AI Guidance", "Source-backed answers and team-specific entry points.", FileSearch],
              ["Workflow Automation Roadmap", "Planned assistants that turn knowledge into guided work.", GitBranch],
            ].map(([title, copy, Icon]) => (
              <article key={title as string}><span><Icon size={20} /></span><strong>{title as string}</strong><p>{copy as string}</p></article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="problem">
          <SectionHeading number="01" eyebrow="Opportunity" title="The Problem This Solves" copy="In many growing teams, internal knowledge can become distributed across multiple places, making reliable guidance slower to find and harder to reuse." />
          <div className={styles.scatterGrid}>
            {["COM site", "SOP folders", "Sales playbooks", "PM/PL documents", "Field resources", "Technical references", "Project templates", "Team-specific notes"].map((item) => <span key={item}><Files size={16} />{item}</span>)}
          </div>
          <Flow items={[
            { title: "Knowledge across systems", icon: Boxes },
            { title: "More time spent searching", icon: Search },
            { title: "Answers depend on who is asked", icon: Users },
            { title: "Workflow knowledge is harder to reuse", icon: GitBranch },
          ]} />
        </section>

        <section className={`${styles.section} ${styles.tinted}`} id="solution">
          <SectionHeading number="02" eyebrow="Product solution" title="An Internal AI Operating Foundation" copy="CloudBase AI brings knowledge, source-backed guidance, team experiences, future automation, and governance into one coherent platform." />
          <Flow items={[
            { title: "Employee Question", copy: "Natural-language process question", icon: MessageSquareText },
            { title: "Knowledge Source Search", copy: "Metadata and content retrieval", icon: Search },
            { title: "Relevant Sections", copy: "Ranked document evidence", icon: FileSearch },
            { title: "Source-Backed Answer", copy: "Direct, traceable guidance", icon: Sparkles },
            { title: "Suggested Next Action", copy: "A practical path forward", icon: CircleCheck },
          ]} />
        </section>

        <section className={styles.section} id="architecture">
          <SectionHeading number="03" eyebrow="System design" title="CloudBase AI Architecture" copy="Ten source groups enter one governed intelligence contract, then surface through Q&A, team guidance, automation modules, and review." />
          <div className={styles.sourceGrid}>
            {sourceDetails.map(([name, purpose, examples, audience, Icon]) => (
              <article key={name}>
                <div className={styles.sourceHead}><span><Icon size={18} /></span><small>Mock Prototype</small></div>
                <h3>{name}</h3><p>{purpose}</p>
                <dl><div><dt>Examples</dt><dd>{examples}</dd></div><div><dt>Audience</dt><dd>{audience}</dd></div></dl>
              </article>
            ))}
          </div>
          <div className={styles.architecturePipeline}>
            {["Knowledge Layer", "Intelligence Layer", "Team Guidance", "Workflow Automation", "Governance Layer"].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < 4 && <ChevronRight size={16} />}</div>)}
          </div>
        </section>

        <section className={`${styles.section} ${styles.darkSection}`} id="mock-strategy">
          <SectionHeading number="04" eyebrow="Safe validation" title="Why Mock Data First?" copy="Realistic fictional documents let reviewers validate the product and governance model before sensitive internal information enters the system." />
          <div className={styles.reasonGrid}>
            {[
              ["Safe for early review", "Demonstrate realistic workflows without confidential source material.", ShieldCheck],
              ["Validate before ingestion", "Approve taxonomy, metadata, navigation, and answer behavior first.", FileCheck2],
              ["Show where real documents fit", "Each mock record follows the future production contract.", Boxes],
              ["Reduce production risk", "Resolve product and governance decisions before integration.", LockKeyhole],
            ].map(([title, copy, Icon]) => <article key={title as string}><Icon size={21} /><strong>{title as string}</strong><p>{copy as string}</p></article>)}
          </div>
          <div className={styles.strongNote}><ShieldCheck size={20} /><strong>No real confidential company documents are required for this prototype version.</strong></div>
        </section>

        <section className={styles.section} id="coverage">
          <SectionHeading number="05" eyebrow="Current prototype" title="Current Mock Knowledge Coverage" copy={`${richMockDocuments.length} fictional documents demonstrate how authoritative internal collections can be represented after approval.`} />
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Source Group</th><th>Example Mock Documents</th><th>Audience</th><th>Prototype Purpose</th><th>Real Data Replacement</th></tr></thead>
              <tbody>{coverageRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className={`${styles.section} ${styles.tinted}`} id="teams">
          <SectionHeading number="06" eyebrow="Audience experience" title="Team-Based Knowledge Views" copy="Different employees need different starting points. Team dashboards filter one shared knowledge model without creating disconnected silos." />
          <div className={styles.teamGrid}>
            {teamDefinitions.map((team, index) => {
              const Icon = teamIcons[index];
              return <article key={team.id}><span><Icon size={19} /></span><h3>{team.name}</h3><p>{team.description}</p><small>Sample questions</small>{team.questions.map((question) => <div key={question}><MessageSquareText size={12} />{question}</div>)}</article>;
            })}
          </div>
        </section>

        <section className={styles.section} id="modules">
          <SectionHeading number="07" eyebrow="Workflow automation layer" title="AI Guidance Modules" copy="Ten planned modules show how approved knowledge can evolve into structured assistance without replacing human ownership or review." />
          <div className={styles.sourceGrid}>
            {aiGuidanceModules.map((module) => (
              <article key={module.id}>
                <div className={styles.sourceHead}><span><Sparkles size={18} /></span><small>{module.status}</small></div>
                <h3>{module.title}</h3><p>{module.purpose}</p>
                <dl><div><dt>Input</dt><dd>{module.input}</dd></div><div><dt>AI output</dt><dd>{module.output}</dd></div><div><dt>Value</dt><dd>{module.businessValue}</dd></div></dl>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="retrieval">
          <SectionHeading number="08" eyebrow="Grounded answers" title="How Source-Backed Q&A Works" copy="Version 1 uses transparent local retrieval so reviewers can inspect how questions become ranked, cited answers." />
          <Flow compact items={[
            { title: "Ask", icon: MessageSquareText },
            { title: "Normalize", icon: BrainCircuit },
            { title: "Search metadata + chunks", icon: Search },
            { title: "Rank sources", icon: Layers3 },
            { title: "Build answer", icon: Sparkles },
            { title: "Show confidence + sources", icon: ShieldCheck },
            { title: "Recommend next action", icon: CircleCheck },
          ]} />
          <div className={styles.answerAnatomy}>
            <div className={styles.answerMock}>
              <div><Sparkles size={17} /><strong>Direct Answer</strong><span>High confidence</span></div>
              <p>A concise response synthesized from the strongest matching mock knowledge section.</p>
              <section><FileSearch size={15} /><div><strong>Most Relevant Source</strong><small>Document · Section · Source Group · Audience</small></div></section>
              <section><Files size={15} /><div><strong>Supporting Sources</strong><small>Related evidence and related documents</small></div></section>
              <section><CircleCheck size={15} /><div><strong>Suggested Next Action</strong><small>Open the source, complete the checklist, or contact the owner</small></div></section>
            </div>
            <div className={styles.anatomyList}>
              {["Direct Answer", "Most Relevant Source", "Supporting Sources", "Source Group", "Department / Audience", "Confidence", "Related Documents", "Suggested Next Action"].map((item) => <span key={item}><Check size={13} />{item}</span>)}
              <p>Version 1 uses local mock retrieval. Future versions can connect embeddings, vector search, access control, and approved AI models.</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.tinted}`} id="ingestion">
          <SectionHeading number="09" eyebrow="Content lifecycle" title="Future Document Ingestion Flow" copy="The interface already demonstrates metadata capture; production ingestion adds extraction, review, permissions, and indexing." />
          <Flow compact items={[
            { title: "Upload", icon: CloudUpload },
            { title: "Capture metadata", icon: FileCheck2 },
            { title: "Classify", icon: FolderKanban },
            { title: "Extract text", icon: Files },
            { title: "Chunk content", icon: Boxes },
            { title: "Review", icon: ShieldCheck },
            { title: "Index", icon: Database },
            { title: "Answer with citations", icon: Sparkles },
          ]} />
          <div className={styles.metadataGrid}>
            {["Document title", "Source group", "Department", "Audience", "Owner role", "Review status", "Confidentiality level", "Tags", "Related documents"].map((item) => <span key={item}><Check size={13} />{item}</span>)}
          </div>
          <div className={styles.inlineNote}>Version 1 simulates upload and metadata capture only. Files are not persisted to a production knowledge service.</div>
        </section>

        <section className={styles.section} id="governance">
          <SectionHeading number="10" eyebrow="Governance layer" title="Governance Before Real Data" copy="Real company knowledge should enter through ownership, classification, permission, human review, versioning, and an auditable lifecycle." />
          <Flow compact items={[
            { title: "Document proposed", icon: Files },
            { title: "Owner assigned", icon: Users },
            { title: "Metadata captured", icon: FileCheck2 },
            { title: "Human review", icon: ShieldCheck },
            { title: "Approved for indexing", icon: CircleCheck },
            { title: "Knowledge base", icon: Database },
            { title: "Periodic review", icon: GitBranch },
          ]} />
          <div className={styles.metadataGrid}>{["Mock data currently used", "Owner role required", "Review status required", "Confidentiality required", "Access control needed", "Audit trail recommended", "Versioning recommended", "Human review before indexing"].map((item) => <span key={item}><Check size={13} />{item}</span>)}</div>
        </section>

        <section className={styles.section} id="approval">
          <SectionHeading number="11" eyebrow="Reviewer mode" title="What We Need to Decide Before Real Data" copy="The next step is agreement on the pilot audience, approved sources, ownership, access, model strategy, and next two-week scope." />
          <div className={styles.checklist}>
            {[
              "Are the source groups correct?",
              "Are the team dashboards useful?",
              "Are the mock document categories aligned with internal needs?",
              "Is the answer format clear?",
              "Should upload require approval before indexing?",
              "What real documents should be connected first?",
              "What access-control rules are needed?",
              "Who should own document review and updates?",
            ].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p><i /></div>)}
          </div>
        </section>

        <section className={`${styles.section} ${styles.darkSection}`} id="roadmap">
          <SectionHeading number="12" eyebrow="Production pathway" title="Real Data and Automation Roadmap" copy="A staged migration protects sensitive information while expanding from knowledge retrieval to governed team automation." />
          <div className={styles.timeline}>
            {roadmap.map(([number, title, copy], index) => <article key={number}><span>{number}</span><div><small>{index === 0 ? "Current" : index === 1 ? "Next" : "Planned"}</small><h3>{title}</h3><p>{copy}</p></div></article>)}
          </div>
        </section>

        <section className={styles.closing} id="summary">
          <SectionHeading number="13" eyebrow="Closing summary" title="What CloudBase AI Demonstrates" copy="A company-wide AI guidance foundation can be reviewed end-to-end before introducing real company information or production AI services." />
          <div className={styles.summaryGrid}>
            {[
              ["Centralized knowledge architecture", Network],
              ["Mock-data-safe review", ShieldCheck],
              ["Team-based internal dashboards", Users],
              ["Source-backed answer format", FileSearch],
              ["Future upload and ingestion workflow", CloudUpload],
              ["Clear path to real data integration", GitBranch],
            ].map(([title, Icon]) => <article key={title as string}><Icon size={20} /><strong>{title as string}</strong></article>)}
          </div>
          <blockquote>“This version is designed to validate the product structure before introducing real internal company data.”</blockquote>
          <div className={styles.closingActions}><Link href="/">Explore the working prototype <ArrowRight size={15} /></Link><a href="#opening">Return to the beginning</a></div>
        </section>
      </main>
    </div>
  );
}
