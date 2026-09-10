import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { RESEARCH_KIND_LABELS, type ResearchKind } from "@/domain";
import { Callout, EmptyState, ItemList, ItemRow, PageHeader, Section } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { teamName } from "@/server/services/catalog";
import { listResearchTemplates } from "@/server/services/templates";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "Research Library" };

export default async function ResearchPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const viewer = await getViewer();
  if (!viewer.has("knowledge.read")) return <Callout tone="warning" title="Not authorized">Your role does not include knowledge.read.</Callout>;
  const { kind } = await searchParams;
  const all = filterVisible(viewer.identity, "research", getRepositories().research.list());
  const list = all.filter((r) => !kind || r.kind === kind).sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
  const templates = listResearchTemplates();
  return (
    <>
      <PageHeader eyebrow="Knowledge" title="Research & Technical Library" description="Research proposals, technical spikes, tool comparisons, experiments, architecture decisions, findings and failure records — each linked to the R&D project, capability, evidence or decision it informs, so research never becomes a disconnected file." actions={<Link className="cb-btn" href="/research/templates/research-proposal">Create research proposal</Link>} />
      <div className="cb-chip-row" style={{ marginBottom: 18 }}>
        <Link className="cb-chip" aria-pressed={!kind} href="/research">All ({all.length})</Link>
        {(Object.keys(RESEARCH_KIND_LABELS) as ResearchKind[]).map((k) => (
          <Link key={k} className="cb-chip" aria-pressed={kind === k} href={`/research?kind=${k}`}>{RESEARCH_KIND_LABELS[k]}</Link>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={<FlaskConical size={18} />} title={all.length ? "No research matches this filter" : "No research documents are registered yet"} description="Start from a template below. Research records link to CROS (evaluation, R&D project, capability, experiment, evidence, decision) so findings stay connected." />
      ) : (
        <ItemList>
          {list.map((r) => (
            <ItemRow key={r.id} href={urlFor({ type: "research", id: r.id })} title={r.title} type="research" status={r.status} subtitle={r.question || r.summary} meta={<><span>{RESEARCH_KIND_LABELS[r.kind]}</span><span>{teamName(r.owningTeam)}</span></>} />
          ))}
        </ItemList>
      )}
      <Section title="Templates">
        <div className="cb-grid cb-grid--4">
          {templates.map((t) => (
            <Link key={t.kind} href={`/research/templates/${t.kind}`} className="cb-card cb-card--link cb-domain-card" style={{ minHeight: 0 }}>
              <strong>{t.title}</strong>
              <p>{t.summary}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
