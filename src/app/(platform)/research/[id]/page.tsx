import type { Metadata } from "next";
import Link from "next/link";
import { RESEARCH_KIND_LABELS } from "@/domain";
import { CodeCopy } from "@/components/docs/CodeCopy";
import { AsideCard, DetailHeader, DetailLayout, MetaList, RelatedPanel } from "@/components/ui/DetailPage";
import { BodySection, BulletList, NotRecorded } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { relatedFor, teamName } from "@/server/services/catalog";
import { renderMarkdown } from "@/server/services/markdown";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().research.get(id)?.title ?? "Research" };
}

export default async function ResearchDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  const doc = requireVisible(viewer.identity, "research", getRepositories().research.get(id));
  const { html } = doc.body ? await renderMarkdown(doc.body) : { html: "" };
  const related = relatedFor(viewer.identity, { type: "research", id: doc.id });
  const cros = Object.entries(doc.cros).filter(([, v]) => v) as Array<[string, string]>;
  const crosType: Record<string, Parameters<typeof urlFor>[0]["type"]> = { evaluationId: "evaluation", rndProjectId: "rnd-project", capabilityId: "capability", experimentId: "experiment", evidenceId: "evidence", decisionId: "decision" };
  return (
    <>
      <DetailHeader type="research" title={doc.title} status={doc.status} summary={doc.summary} extraBadges={<span className="cb-badge cb-badge--outline">{RESEARCH_KIND_LABELS[doc.kind]}</span>} facts={[{ label: "Owner", value: doc.owner || "Unassigned" }, { label: "Team", value: <Link href={`/teams/${doc.owningTeam}`}>{teamName(doc.owningTeam)}</Link> }, { label: "Version", value: doc.version }, { label: "Last reviewed", value: doc.lastReviewedAt ?? "Not yet reviewed" }]} />
      <DetailLayout
        aside={
          <>
            <AsideCard title="CROS linkage">
              {cros.length ? (
                <ul className="cb-aside-list">
                  {cros.map(([k, v]) => (
                    <li key={k}>
                      <Link href={urlFor({ type: crosType[k], id: v })}>{v}</Link>
                      <small>{k.replace(/Id$/, "")}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <NotRecorded>Not linked to a CROS record yet.</NotRecorded>
              )}
            </AsideCard>
            <RelatedPanel groups={related} />
            <AsideCard title="Sources">{doc.sources.length ? <ul className="cb-aside-list">{doc.sources.map((s) => <li key={s}>{/^https?:/.test(s) ? <a href={s} target="_blank" rel="noopener noreferrer">{s}</a> : <span>{s}</span>}</li>)}</ul> : <NotRecorded>No sources recorded.</NotRecorded>}</AsideCard>
            <AsideCard title="Metadata"><MetaList items={[{ label: "Kind", value: RESEARCH_KIND_LABELS[doc.kind] }, { label: "Classification", value: doc.classification }, { label: "Updated", value: doc.updatedAt }, { label: "Tags", value: doc.tags.join(", ") || undefined }]} /></AsideCard>
          </>
        }
      >
        <BodySection title="Research question">{doc.question ? <p>{doc.question}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Findings">{doc.findings ? <p>{doc.findings}</p> : <NotRecorded>No findings recorded yet.</NotRecorded>}</BodySection>
        <BodySection title="Limitations"><BulletList items={doc.limitations} empty="No limitations recorded." /></BodySection>
        <BodySection title="Recommendation">{doc.recommendation ? <p>{doc.recommendation}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Next action">{doc.nextAction ? <p>{doc.nextAction}</p> : <NotRecorded />}</BodySection>
        {html && (
          <BodySection title="Full document">
            <article id="research-body" className="cb-prose" dangerouslySetInnerHTML={{ __html: html }} />
            <CodeCopy containerId="research-body" />
          </BodySection>
        )}
      </DetailLayout>
    </>
  );
}
