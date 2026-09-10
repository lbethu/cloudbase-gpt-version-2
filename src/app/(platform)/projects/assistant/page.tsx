import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { Callout, PageHeader, Section } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Project Reference Assistant" };

const OUTPUTS = [
  ["One-page project reference", "Client, location, dates, problem, work performed, technologies, outcomes, team."],
  ["Proposal-friendly summary", "150–250 words in approved voice, aligned to the RFP's evaluation criteria."],
  ["Technical experience statement", "Capability-oriented statement citing the project as evidence."],
  ["Case-study draft", "Narrative draft for marketing review (SOP 220)."],
];

const REQUIRED = ["Project name and client", "Location", "Start and end dates", "Service line", "Problem statement", "Work performed", "Technologies", "Outcomes and measurable results (from project records, never estimated)", "Project team", "Client-facing approval status"];

export default async function AssistantPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const viewer = await getViewer();
  const { ref } = await searchParams;
  const repos = getRepositories();
  const copilot = repos.copilots.get("project-reference-assistant");
  const project = ref ? repos.projectReferences.get(ref) : undefined;
  return (
    <>
      <PageHeader eyebrow="Project Intelligence" title="Project Reference Assistant" description="Converts governed project information into reusable references. It never invents outcomes, ROI, dates, locations or metrics — when information is missing it asks for it." actions={copilot && <Link className="cb-btn" href={`/copilots/${copilot.id}`}>Registry entry</Link>} />
      {copilot && <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}><StatusBadge status={copilot.status} /><span className="cb-subtle cb-small">{copilot.accessUrl ? "Deployment link configured" : "No deployment link configured yet — the assistant is not operational."}</span></div>}
      {project && <Callout tone="info" title={`Selected reference: ${project.title}`}>{project.approvedClientFacingWording ? "This reference has approved wording; the assistant may reuse it verbatim." : "This reference has no approved client-facing wording yet; any draft requires approval before external use."}</Callout>}
      <div className="cb-grid cb-grid--2" style={{ marginTop: 20 }}>
        <Section title="What it produces">
          <div className="cb-card">
            {OUTPUTS.map(([t, d]) => <div key={t} className="cb-item-row" style={{ gridTemplateColumns: "1fr" }}><div><div className="cb-item-row-title">{t}</div><div className="cb-item-row-sub">{d}</div></div></div>)}
          </div>
        </Section>
        <Section title="Information it requires (asks if missing)">
          <ul className="cb-card cb-card--pad" style={{ margin: 0, paddingLeft: 36, display: "grid", gap: 6 }}>
            {REQUIRED.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </Section>
      </div>
      <Section title="Authority boundaries">
        <ul className="cb-card cb-card--pad" style={{ margin: 0, paddingLeft: 36, display: "grid", gap: 6 }}>
          {(copilot?.authorityBoundaries ?? []).map((b) => <li key={b}>{b}</li>)}
          <li>Drafts are reviewed under SOP 223 (Project Reference Creation and Updates) and, for marketing use, SOP 220.</li>
        </ul>
      </Section>
      {viewer.has("ask.use") && <p className="cb-muted cb-small" style={{ marginTop: 20 }}>Until the assistant is operational, use <Link href="/ask?q=project reference creation" style={{ fontWeight: 600 }}>Ask CloudBase</Link> to find the governed SOP and existing references.</p>}
    </>
  );
}
