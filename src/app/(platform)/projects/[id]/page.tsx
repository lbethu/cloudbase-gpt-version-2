import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AsideCard, DetailHeader, DetailLayout, MetaList, RelatedPanel } from "@/components/ui/DetailPage";
import { BodySection, BulletList, NotRecorded } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { relatedFor, teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().projectReferences.get(id)?.title ?? "Project reference" };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  const p = requireVisible(viewer.identity, "project-reference", getRepositories().projectReferences.get(id));
  const related = relatedFor(viewer.identity, { type: "project-reference", id: p.id });
  const caps = related.find((g) => g.type === "capability")?.entries ?? [];
  return (
    <>
      <DetailHeader type="project-reference" title={p.title} status={p.status} summary={p.summary} extraBadges={p.approvedClientFacingWording ? <Badge tone="success">Approved client-facing wording</Badge> : <Badge tone="warning">No approved wording</Badge>} facts={[{ label: "Client", value: p.client || "Not recorded" }, { label: "Location", value: p.location || "Not recorded" }, { label: "Dates", value: p.startDate ? `${p.startDate}${p.endDate ? ` – ${p.endDate}` : ""}` : "Not recorded" }, { label: "Service line", value: p.serviceLine || "Not recorded" }, { label: "Team", value: <Link href={`/teams/${p.owningTeam}`}>{teamName(p.owningTeam)}</Link> }, { label: "Version", value: p.version }, { label: "Last reviewed", value: p.lastReviewedAt ?? "Not yet reviewed" }]} actions={<Link className="cb-btn" href={`/projects/assistant?ref=${p.id}`}>Draft with Project Reference Assistant</Link>} />
      <DetailLayout
        aside={
          <>
            <AsideCard title="Capabilities created or strengthened">{caps.length ? <ul className="cb-aside-list">{caps.map((c) => <li key={c.ref.id}><Link href={c.url}>{c.title}</Link><small>{c.label}{c.confidence === "proposed" ? " · proposed" : ""}</small></li>)}</ul> : <NotRecorded>No capability linked.</NotRecorded>}</AsideCard>
            <RelatedPanel groups={related.filter((g) => g.type !== "capability")} />
            <AsideCard title="Supporting documents">{p.supportingDocuments.length ? <ul className="cb-aside-list">{p.supportingDocuments.map((d) => <li key={d}><span>{d}</span></li>)}</ul> : <NotRecorded>None attached.</NotRecorded>}</AsideCard>
            <AsideCard title="Metadata"><MetaList items={[{ label: "Id", value: <span className="cb-mono">{p.id}</span> }, { label: "Classification", value: p.classification }, { label: "Updated", value: p.updatedAt }]} /></AsideCard>
          </>
        }
      >
        <BodySection title="Problem">{p.problem ? <p>{p.problem}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Work performed">{p.workPerformed ? <p>{p.workPerformed}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Technologies"><BulletList items={p.technologies} /></BodySection>
        <BodySection title="Outcomes"><BulletList items={p.outcomes} empty="No outcomes recorded. Outcomes are never inferred — ask the project team." /></BodySection>
        <BodySection title="Measurable results"><BulletList items={p.measurableResults} empty="No measurable results recorded." /></BodySection>
        <BodySection title="Project team"><BulletList items={p.projectTeam} /></BodySection>
        <BodySection title="Reusable lessons"><BulletList items={p.lessons} /></BodySection>
        <BodySection title="Approved client-facing wording">{p.approvedClientFacingWording ? <blockquote className="cb-passage">{p.approvedClientFacingWording}</blockquote> : <NotRecorded>No wording has been approved for external use. Drafts from the assistant must be approved and recorded here before use in proposals.</NotRecorded>}</BodySection>
      </DetailLayout>
    </>
  );
}
