import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AsideCard, DetailHeader, DetailLayout, MetaList, RelatedPanel } from "@/components/ui/DetailPage";
import { BodySection, BulletList, NotRecorded } from "@/components/ui/primitives";
import { RepositoryCard } from "@/components/integrations/RepositoryCard";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { relatedFor, teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().automations.get(id)?.title ?? "Automation" };
}

export default async function AutomationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  const a = requireVisible(viewer.identity, "automation", getRepositories().automations.get(id));
  const related = relatedFor(viewer.identity, { type: "automation", id: a.id });
  return (
    <>
      <DetailHeader type="automation" title={a.title} status={a.status} summary={a.summary} extraBadges={<><Badge tone="outline">{a.kind}</Badge><Badge tone="outline">{a.category}</Badge></>} facts={[{ label: "Owner", value: a.owner || "Unassigned" }, { label: "Team", value: <Link href={`/teams/${a.owningTeam}`}>{teamName(a.owningTeam)}</Link> }, { label: "Version", value: a.version }, { label: "Last reviewed", value: a.lastReviewedAt ?? "Not yet reviewed" }]} actions={<>{a.documentationUrl && <a className="cb-btn" href={a.documentationUrl} target="_blank" rel="noopener noreferrer">Documentation</a>}{a.sourceUrl && <a className="cb-btn" href={a.sourceUrl} target="_blank" rel="noopener noreferrer">Source</a>}</>} />
      <DetailLayout aside={<><RelatedPanel groups={related} /><RepositoryCard repositories={a.repositories} /><AsideCard title="Metadata"><MetaList items={[{ label: "Id", value: <span className="cb-mono">{a.id}</span> }, { label: "Trigger", value: a.trigger || undefined }, { label: "Systems", value: a.systems.join(", ") || undefined }, { label: "Classification", value: a.classification }, { label: "Updated", value: a.updatedAt }]} /></AsideCard></>}>
        <BodySection title="Business problem">{a.businessProblem ? <p>{a.businessProblem}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Trigger">{a.trigger ? <p>{a.trigger}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Inputs"><BulletList items={a.inputs} /></BodySection>
        <BodySection title="Workflow">{a.workflow.length ? <ol className="cb-steps">{a.workflow.map((s, i) => <li key={i}>{s}</li>)}</ol> : <NotRecorded />}</BodySection>
        <BodySection title="Systems involved"><BulletList items={a.systems} /></BodySection>
        <BodySection title="Output">{a.output ? <p>{a.output}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Human review points"><BulletList items={a.humanReviewPoints} empty="No human review points recorded — required for AI-assisted automations." /></BodySection>
        <BodySection title="Failure path">{a.failurePath ? <p>{a.failurePath}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Logging">{a.logging ? <p>{a.logging}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Dependencies"><BulletList items={a.dependencies} /></BodySection>
        <BodySection title="Risks"><BulletList items={a.risks} /></BodySection>
        <BodySection title="Success metric">{a.successMetric ? <p>{a.successMetric}</p> : <NotRecorded />}</BodySection>
      </DetailLayout>
    </>
  );
}
