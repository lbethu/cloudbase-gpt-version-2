import {
  ArrowRight,
  BrainCircuit,
  Check,
  CircleGauge,
  Database,
  FileCheck2,
  FileSearch,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { aiGuidanceModules } from "@/legacy/data/ai-modules";
import styles from "./CloudBaseSections.module.css";

const layers = [
  ["Knowledge Layer", "Ten structured source groups covering company knowledge and working standards.", Database],
  ["Intelligence Layer", "Metadata, classification, chunking, ranking, confidence, citations, and next actions.", BrainCircuit],
  ["Team Guidance Layer", "Role-aware entry points for Sales, Field, PM/PL, Technical, Leadership, and new employees.", Users],
  ["Workflow Automation Layer", "Planned assistants that turn knowledge into guided, reviewable work.", GitBranch],
  ["Governance Layer", "Ownership, approval, confidentiality, access, versioning, audit, and human review.", ShieldCheck],
] as const;

const architectureSteps = [
  "Company Knowledge Sources",
  "Metadata + Classification",
  "Chunked Knowledge Base",
  "Retrieval + Ranking",
  "Source-Backed AI Answers",
  "Team Dashboards",
  "Automation Modules",
  "Governance + Review",
];

export function CloudBaseArchitecture({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`${styles.architecture} ${compact ? styles.compact : ""}`}>
      <div className={styles.heading}>
        <span>CloudBase AI architecture</span>
        <h2>Five layers. One internal AI foundation.</h2>
        <p>Knowledge stays traceable while intelligence, team guidance, automation, and governance evolve independently.</p>
      </div>
      <div className={styles.flow}>
        {architectureSteps.map((step, index) => (
          <div className={styles.flowGroup} key={step}>
            <div><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>
            {index < architectureSteps.length - 1 && <ArrowRight size={14} />}
          </div>
        ))}
      </div>
      <div className={styles.layerGrid}>
        {layers.map(([title, copy, Icon]) => <article key={title}><Icon size={19} /><strong>{title}</strong><p>{copy}</p></article>)}
      </div>
    </section>
  );
}

export function AIGuidanceModulesView() {
  return (
    <div className={styles.pageView}>
      <div className={styles.pageHeading}><span>Workflow automation layer</span><h1>AI Guidance Modules</h1><p>Planned internal assistants show how governed knowledge can evolve into structured employee guidance and workflow automation.</p></div>
      <div className={styles.moduleSummary}>
        <div><strong>10</strong><span>Guidance modules</span></div><div><strong>2</strong><span>Prototype modules</span></div><div><strong>6</strong><span>Planned modules</span></div><div><strong>2</strong><span>Future modules</span></div>
      </div>
      <div className={styles.moduleGrid}>
        {aiGuidanceModules.map((module) => (
          <article key={module.id}>
            <div className={styles.moduleTop}><span><Sparkles size={17} /></span><i className={styles[module.status.toLowerCase()]}>{module.status}</i></div>
            <small>{module.primaryAudience}</small><h3>{module.title}</h3><p>{module.purpose}</p>
            <dl><div><dt>Input</dt><dd>{module.input}</dd></div><div><dt>AI output</dt><dd>{module.output}</dd></div><div><dt>Sources</dt><dd>{module.sourceGroups.join(" · ")}</dd></div></dl>
            <footer><CircleGauge size={14} /><span>{module.businessValue}</span></footer>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ReviewerDecisionsView() {
  const decisions = [
    "Which source groups should be included first?",
    "Which team should be prioritized first?",
    "Which real SOPs are approved for controlled testing?",
    "Who owns document review and freshness?",
    "Should upload require approval before indexing?",
    "What access-control rules are required?",
    "Which approved AI provider or model should be evaluated later?",
    "What should remain mock-only for now?",
    "What should be included in the next two-week build scope?",
  ];
  const governance = [
    ["Document owner required", Users],
    ["Review status required", FileCheck2],
    ["Confidentiality classification", LockKeyhole],
    ["Human review before indexing", ShieldCheck],
    ["Access control before retrieval", Search],
    ["Version history and audit trail", GitBranch],
  ] as const;
  return (
    <div className={styles.pageView}>
      <div className={styles.pageHeading}><span>Reviewer decision page</span><h1>What We Need to Decide Before Real Data</h1><p>The prototype is ready to move from broad product validation to a narrowly governed pilot when these decisions are agreed.</p></div>
      <section className={styles.governanceHero}>
        <div><span>Governance before real data</span><h2>Approval is part of the architecture—not an afterthought.</h2><p>Real documents should enter through a visible owner, classification, review, permission, indexing, and periodic-review workflow.</p></div>
        <div className={styles.approvalFlow}>{["Real Document Proposed", "Owner Assigned", "Metadata Captured", "Human Review", "Approved for Indexing", "Knowledge Base", "Periodic Review"].map((step, index) => <div key={step}><span>{index + 1}</span><strong>{step}</strong></div>)}</div>
      </section>
      <div className={styles.governanceGrid}>{governance.map(([label, Icon]) => <div key={label}><Icon size={17} /><span>{label}</span></div>)}</div>
      <section className={styles.decisions}>
        <div><span>Decision checklist</span><h2>Nine questions that define the pilot</h2></div>
        <div>{decisions.map((decision, index) => <article key={decision}><span>{String(index + 1).padStart(2, "0")}</span><p>{decision}</p><i /></article>)}</div>
      </section>
    </div>
  );
}

export function AutomationPreview({ onOpen }: { onOpen: () => void }) {
  return (
    <section className={styles.preview}>
      <div className={styles.heading}><span>AI guidance roadmap</span><h2>From searchable knowledge to guided work</h2><p>Ten planned modules demonstrate where CloudBase AI can assist teams after source and governance approval.</p></div>
      <div className={styles.previewGrid}>{aiGuidanceModules.slice(0, 5).map((module) => <article key={module.id}><Sparkles size={16} /><strong>{module.title}</strong><span>{module.primaryAudience}</span></article>)}</div>
      <button onClick={onOpen}>View all guidance modules <ArrowRight size={15} /></button>
    </section>
  );
}
