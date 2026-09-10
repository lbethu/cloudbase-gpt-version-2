import type { Metadata } from "next";
import Link from "next/link";
import { CodeCopy } from "@/components/docs/CodeCopy";
import { Badge } from "@/components/ui/Badge";
import { AsideCard, DetailHeader, DetailLayout, MetaList, RelatedPanel } from "@/components/ui/DetailPage";
import { BodySection, NotRecorded } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { relatedFor, teamName } from "@/server/services/catalog";
import { renderMarkdown } from "@/server/services/markdown";
import { getViewer } from "@/server/services/viewer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().rfp.get(id)?.title ?? "RFP record" };
}

export default async function RfpRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  const r = requireVisible(viewer.identity, "rfp", getRepositories().rfp.get(id));
  const { html } = r.body ? await renderMarkdown(r.body) : { html: "" };
  const related = relatedFor(viewer.identity, { type: "rfp", id: r.id });
  return (
    <>
      <DetailHeader type="rfp" title={r.title} status={r.status} summary={r.summary} extraBadges={<><Badge tone="outline">{r.kind}</Badge>{r.decision && <Badge tone={r.decision === "GO" ? "success" : r.decision === "NO_GO" ? "danger" : "warning"}>{r.decision}</Badge>}</>} facts={[{ label: "Owner", value: r.owner || "Unassigned" }, { label: "Team", value: <Link href={`/teams/${r.owningTeam}`}>{teamName(r.owningTeam)}</Link> }, { label: "Version", value: r.version }, { label: "Classification", value: r.classification }, { label: "Last reviewed", value: r.lastReviewedAt ?? "Not yet reviewed" }]} />
      <DetailLayout aside={<><RelatedPanel groups={related} /><AsideCard title="Metadata"><MetaList items={[{ label: "Id", value: <span className="cb-mono">{r.id}</span> }, { label: "Updated", value: r.updatedAt }, { label: "Tags", value: r.tags.join(", ") || undefined }]} /></AsideCard></>}>
        <BodySection title="Content">{html ? <><article id="rfp-body" className="cb-prose" dangerouslySetInnerHTML={{ __html: html }} /><CodeCopy containerId="rfp-body" /></> : <NotRecorded>No body content recorded.</NotRecorded>}</BodySection>
      </DetailLayout>
    </>
  );
}
