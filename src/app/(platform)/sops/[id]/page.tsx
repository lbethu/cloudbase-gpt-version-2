import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bot, Download, ExternalLink, FolderOpen } from "lucide-react";
import { SOP_STATUS_LABELS } from "@/domain";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { AsideCard, DetailHeader, DetailLayout, MetaList, RelatedPanel } from "@/components/ui/DetailPage";
import { BodySection, BulletList, Callout, NotRecorded } from "@/components/ui/primitives";
import { can } from "@/server/authz";
import { WorkflowActions } from "@/components/sops/WorkflowActions";
import { getConfig } from "@/server/config";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { relatedFor, teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().sops.get(id)?.title ?? "SOP" };
}

export default async function SopPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ version?: string; chunk?: string }> }) {
  const { id } = await params;
  const { version: requested, chunk: chunkId } = await searchParams;
  const viewer = await getViewer();
  const repos = getRepositories();
  const sop = requireVisible(viewer.identity, "sop", repos.sops.get(id));
  const effective = sop.versions.find((v) => v.version === sop.effectiveVersion);
  const shown = sop.versions.find((v) => v.version === requested) ?? effective ?? sop.versions[sop.versions.length - 1];
  const imported = shown.importedContentId ? repos.sops.importedContent(shown.importedContentId) : undefined;
  const related = relatedFor(viewer.identity, { type: "sop", id: sop.id });
  const relatedCopilots = related.find((g) => g.type === "copilot")?.entries ?? [];
  const filesAllowed = can(viewer.identity, "files.read");
  const isEffective = effective?.version === shown.version;
  const driveAvailable = Boolean(shown.sourceFile?.driveUrl) || getConfig().drive.configured;

  return (
    <>
      <DetailHeader
        type="sop"
        title={sop.title}
        status={SOP_STATUS_LABELS[shown.status]}
        summary={sop.summary || shown.purpose}
        extraBadges={
          <>
            {sop.kind !== "sop" && <Badge tone="outline">{sop.kind}</Badge>}
            {sop.sopNumber && <Badge tone="outline">SOP {sop.sopNumber}</Badge>}
            {!isEffective && shown.version !== effective?.version && <Badge tone="warning">Viewing {effective ? "a non-effective version" : "an unapproved version"}</Badge>}
          </>
        }
        facts={[
          { label: "Owner", value: sop.owner || "Unassigned" },
          { label: "Team", value: <Link href={`/teams/${sop.owningTeam}`}>{teamName(sop.owningTeam)}</Link> },
          { label: "Current version", value: effective ? effective.version : "No approved version" },
          { label: "Viewing", value: shown.version },
          { label: "Last reviewed", value: shown.reviewedAt ?? sop.lastReviewedAt ?? "Not yet reviewed" },
          { label: "Category", value: sop.category },
        ]}
        actions={
          <>
            {relatedCopilots[0] && (
              <Link className="cb-btn cb-btn--primary" href={relatedCopilots[0].url}>
                <Bot /> Open related Copilot
              </Link>
            )}
            {can(viewer.identity, "sop.author") && (
              <Link className="cb-btn" href={`/sops/upload?existing=${sop.id}`}>Upload new version</Link>
            )}
            {shown.sourceFile && filesAllowed && (
              <>
                {driveAvailable ? (
                  <a className="cb-btn cb-btn--primary" href={`/api/files/${encodeURIComponent(shown.sourceFile.id)}/drive`} target="_blank" rel="noopener" title="Opens the document in Google Drive — no download">
                    <FolderOpen /> Open in Google Drive
                  </a>
                ) : (
                  <span className="cb-btn" aria-disabled="true" title="Connect Google Drive (Governance → Integrations) to open documents in Drive without downloading">
                    <FolderOpen /> Open in Google Drive — not connected
                  </span>
                )}
                <a className="cb-btn" href={`/api/files/${encodeURIComponent(shown.sourceFile.id)}`} target="_blank" rel="noopener">
                  <ExternalLink /> View file
                </a>
                <a className="cb-btn" href={`/api/files/${encodeURIComponent(shown.sourceFile.id)}?download=1`}>
                  <Download /> Download
                </a>
              </>
            )}
          </>
        }
      />

      {(can(viewer.identity, "sop.approve") || can(viewer.identity, "sop.review") || can(viewer.identity, "sop.author")) && (
        <div style={{ marginBottom: 16 }}>
          <WorkflowActions sopId={sop.id} version={shown.version} status={shown.status} canApprove={can(viewer.identity, "sop.approve")} canReview={can(viewer.identity, "sop.review")} canAuthor={can(viewer.identity, "sop.author")} />
        </div>
      )}
      {!effective && (
        <Callout tone="warning" title="No version of this SOP has been approved yet">
          {sop.provenance ? `${sop.provenance.note} Imported from: ${sop.provenance.importedFrom}.` : "This SOP is in the governed workflow. Do not treat its content as approved policy until an approver publishes an effective version."}
        </Callout>
      )}

      <DetailLayout
        aside={
          <>
            {relatedCopilots.length > 0 ? (
              <div className="cb-card cb-aside-card" style={{ borderColor: "color-mix(in srgb, var(--accent) 40%, var(--line))" }}>
                <h3>Need help performing this procedure?</h3>
                <ul className="cb-aside-list">
                  {relatedCopilots.map((c) => (
                    <li key={c.ref.id}>
                      <Link href={c.url}>{c.title}</Link>
                      <small>{c.status} · assists; the governed SOP remains authoritative</small>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <AsideCard title="Need help performing this procedure?">
                <NotRecorded>No copilot is linked to this SOP yet.</NotRecorded>
              </AsideCard>
            )}
            <AsideCard title="Metadata">
              <MetaList
                items={[
                  { label: "Classification", value: sop.classification },
                  { label: "Kind", value: sop.kind },
                  { label: "Versions", value: sop.versions.length },
                  { label: "Updated", value: sop.updatedAt },
                  { label: "Tags", value: sop.tags.length ? sop.tags.slice(0, 6).join(", ") : undefined },
                  { label: "Systems", value: sop.relatedSystems.length ? sop.relatedSystems.join(", ") : undefined },
                ]}
              />
            </AsideCard>
            <RelatedPanel groups={related.filter((g) => g.type !== "copilot")} />
            <AsideCard title="Sources">
              {shown.sourceFile ? (
                <ul className="cb-aside-list">
                  <li>
                    {filesAllowed ? <a href={`/api/files/${encodeURIComponent(shown.sourceFile.id)}`} target="_blank" rel="noopener">{shown.sourceFile.label || shown.sourceFile.path}</a> : <span>{shown.sourceFile.label || shown.sourceFile.path}</span>}
                    <small>{shown.sourceFile.mediaType.includes("pdf") ? "PDF" : shown.sourceFile.mediaType.includes("word") ? "Word document" : "File"} · access-controlled{filesAllowed ? "" : " · you lack files.read"}</small>
                  </li>
                </ul>
              ) : (
                <NotRecorded>No source file attached to this version.</NotRecorded>
              )}
              {sop.provenance && <p className="cb-subtle" style={{ fontSize: 11.5, marginTop: 10 }}>Provenance: {sop.provenance.importedFrom}{sop.provenance.importedAt ? ` (${sop.provenance.importedAt})` : ""}.</p>}
            </AsideCard>
            <AsideCard title="History">
              <ul className="cb-aside-list">
                {[...sop.versions].reverse().map((v) => (
                  <li key={v.version}>
                    <Link href={`/sops/${sop.id}?version=${encodeURIComponent(v.version)}`} aria-current={v.version === shown.version ? "true" : undefined}>
                      {v.version}
                      {v.version === effective?.version ? " (effective)" : ""}
                    </Link>
                    <small>
                      {SOP_STATUS_LABELS[v.status]}
                      {v.effectiveDate ? ` · effective ${v.effectiveDate}` : ""}
                      {v.approval ? ` · approved by ${v.approval.approvedBy} on ${v.approval.approvedAt}` : ""}
                    </small>
                  </li>
                ))}
              </ul>
            </AsideCard>
          </>
        }
      >
        <BodySection title="Purpose">{shown.purpose ? <p>{shown.purpose}</p> : <NotRecorded>Purpose has not been recorded for this version. Refer to the source file.</NotRecorded>}</BodySection>
        <BodySection title="Prerequisites"><BulletList items={shown.prerequisites} empty="No prerequisites recorded." /></BodySection>
        <BodySection title="Procedure">
          {shown.procedure.length ? (
            <ol className="cb-steps">
              {shown.procedure.map((p, i) => (
                <li key={i}>
                  <strong>{p.step}</strong>
                  {p.detail && <div className="cb-muted">{p.detail}</div>}
                  {p.warning && <div className="cb-callout cb-callout--warning" style={{ marginTop: 6 }}>{p.warning}</div>}
                </li>
              ))}
            </ol>
          ) : imported ? (
            <>
              <p className="cb-muted cb-small" style={{ marginBottom: 10 }}>Structured steps have not been authored yet. The full text below was extracted from the source file ({imported.chunks.length} sections{imported.characterCount ? `, ${imported.characterCount.toLocaleString()} characters` : ""}) and is shown verbatim for reference.</p>
              {chunkId && <script dangerouslySetInnerHTML={{ __html: `document.getElementById(${JSON.stringify(`chunk-${chunkId}`)})?.scrollIntoView({ block: "center" })` }} />}
              {imported.chunks.map((c) => (
                <div key={c.id} id={`chunk-${c.id}`} className="cb-passage" style={c.id === chunkId ? { borderLeftColor: "var(--accent)", background: "var(--accent-soft)" } : undefined}>
                  <strong>{c.section}{c.page ? ` · page ${c.page}` : ""}{c.id === chunkId ? " · matched" : ""}</strong>
                  {c.content}
                </div>
              ))}
            </>
          ) : (
            <NotRecorded>No procedure content is available for this version.</NotRecorded>
          )}
        </BodySection>
        <BodySection title="QA / Verification"><BulletList items={shown.verification} empty="No verification steps recorded." /></BodySection>
        <BodySection title="Warnings"><BulletList items={shown.warnings} empty="No warnings recorded." /></BodySection>
        <BodySection title="References"><BulletList items={shown.references} empty="No references recorded." /></BodySection>
        <BodySection title="Approval evidence">
          {shown.approval ? (
            <p>
              Approved by <b>{shown.approval.approvedBy}</b> on {shown.approval.approvedAt}. {shown.approval.note}
            </p>
          ) : (
            <p className="cb-muted cb-small">
              Version {shown.version} carries no approval evidence. Status: <StatusBadge status={SOP_STATUS_LABELS[shown.status]} /> {shown.changeSummary && <>— {shown.changeSummary}</>}
            </p>
          )}
        </BodySection>
      </DetailLayout>
    </>
  );
}
