import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AsideCard, DetailHeader, DetailLayout, MetaList, RelatedPanel } from "@/components/ui/DetailPage";
import { BodySection, BulletList, Callout, NotRecorded } from "@/components/ui/primitives";
import { RepositoryCard } from "@/components/integrations/RepositoryCard";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { relatedFor, teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().copilots.get(id)?.title ?? "Copilot" };
}

export default async function CopilotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  const c = requireVisible(viewer.identity, "copilot", getRepositories().copilots.get(id));
  const related = relatedFor(viewer.identity, { type: "copilot", id: c.id });
  const sops = related.find((g) => g.type === "sop")?.entries ?? [];
  return (
    <>
      <DetailHeader type="copilot" title={c.title} status={c.status} summary={c.purpose} extraBadges={<Badge tone="outline">{c.securityClassification}</Badge>} facts={[{ label: "Owner", value: c.owner || "Unassigned" }, { label: "Team", value: <Link href={`/teams/${c.owningTeam}`}>{teamName(c.owningTeam)}</Link> }, { label: "Version", value: c.version }, { label: "Last reviewed", value: c.lastReviewedAt ?? "Not yet reviewed" }, { label: "Supported users", value: c.supportedUsers.join(", ") || undefined }]} actions={<>{c.accessUrl ? <a className="cb-btn cb-btn--primary" href={c.accessUrl} target="_blank" rel="noopener noreferrer"><ExternalLink /> Open Copilot</a> : <span className="cb-btn" aria-disabled="true">Open Copilot — link not configured</span>}<Link className="cb-btn" href="/copilots/standard">Engineering Standard</Link></>} />
      {c.status !== "operational" && <Callout tone="warning" title={`This copilot is ${c.status}`}>It has not reached operational status through governed review. Outputs are drafts or recommendations, never official records.</Callout>}
      <DetailLayout
        aside={
          <>
            <AsideCard title="Related approved SOPs">{sops.length ? <ul className="cb-aside-list">{sops.map((s) => <li key={s.ref.id}><Link href={s.url}>{s.title}</Link><small>{s.status} · the SOP remains authoritative</small></li>)}</ul> : <NotRecorded>No SOP linked yet. The assistant must not replace a governed SOP.</NotRecorded>}</AsideCard>
            <RelatedPanel groups={related.filter((g) => g.type !== "sop")} /><RepositoryCard repositories={c.repositories} />
            <AsideCard title="Knowledge sources">{c.knowledgeSources.length ? <ul className="cb-aside-list">{c.knowledgeSources.map((k) => <li key={k.label}>{k.ref ? <Link href={urlFor(k.ref)}>{k.label}</Link> : <span>{k.label}</span>}<small>{k.kind}{k.note ? ` · ${k.note}` : ""}</small></li>)}</ul> : <NotRecorded>No knowledge sources declared yet.</NotRecorded>}</AsideCard>
            <AsideCard title="Metadata"><MetaList items={[{ label: "Id", value: <span className="cb-mono">{c.id}</span> }, { label: "Required permissions", value: c.requiredPermissions.join(", ") || "none declared" }, { label: "Updated", value: c.updatedAt }, { label: "Tags", value: c.tags.join(", ") || undefined }]} /></AsideCard>
            <AsideCard title="History">{c.releaseNotes.length ? <ul className="cb-aside-list">{c.releaseNotes.map((r) => <li key={r.version}><span>v{r.version}</span><small>{r.date ? `${r.date} · ` : ""}{r.note}</small></li>)}</ul> : <NotRecorded>No release notes yet.</NotRecorded>}</AsideCard>
          </>
        }
      >
        <BodySection title="Description">{c.description ? <p>{c.description}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Authority boundaries"><BulletList items={c.authorityBoundaries} empty="No authority boundaries recorded — required before pilot." /></BodySection>
        <BodySection title="Instructions">{c.instructions ? <pre className="cb-passage" style={{ whiteSpace: "pre-wrap" }}>{c.instructions}</pre> : <NotRecorded>Master instructions have not been authored in the registry yet.</NotRecorded>}</BodySection>
        <BodySection title="Output contract">{c.outputContract ? <p>{c.outputContract}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Human review">{c.humanReview ? <p>{c.humanReview}</p> : <NotRecorded>Human review points not recorded — required before pilot.</NotRecorded>}</BodySection>
        <BodySection title="Usage guide">{c.usageGuide ? <p>{c.usageGuide}</p> : <NotRecorded />}</BodySection>
        <BodySection title="Known limitations"><BulletList items={c.limitations} empty="No limitations recorded — treat as unknown." /></BodySection>
        <BodySection title="Test cases">{c.testCases.length ? <div className="cb-table-wrap"><table className="cb-table"><thead><tr><th>Id</th><th>Input</th><th>Expected behaviour</th><th>Must not</th></tr></thead><tbody>{c.testCases.map((t) => <tr key={t.id}><td className="cb-mono">{t.id}</td><td>{t.input}</td><td>{t.expectedBehaviour}</td><td>{t.mustNot.join("; ")}</td></tr>)}</tbody></table></div> : <NotRecorded>No test cases recorded — required before pilot.</NotRecorded>}</BodySection>
      </DetailLayout>
    </>
  );
}
