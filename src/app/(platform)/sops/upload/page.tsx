import type { Metadata } from "next";
import { UploadForm } from "@/components/sops/UploadForm";
import { getConfig } from "@/server/config";
import { Callout, PageHeader, Section } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Upload SOP document" };

export default async function UploadSopPage({ searchParams }: { searchParams: Promise<{ existing?: string }> }) {
  const { existing } = await searchParams;
  const viewer = await getViewer();
  if (!viewer.has("sop.author")) return <Callout tone="warning" title="Not authorized">Uploading documents requires the Contributor role (sop.author).</Callout>;
  const repos = getRepositories();
  const teams = repos.teams.list().map((t) => ({ id: t.id, name: t.name }));
  const sops = filterVisible(viewer.identity, "sop", repos.sops.list()).map((s) => ({ id: s.id, title: s.title })).sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <PageHeader eyebrow="SOP Library" title="Upload an SOP document" description="Upload a Word or PDF document as a new SOP or as a new version of an existing one. It is extracted and searchable immediately, and enters the governed lifecycle as a draft — approval is a separate, audited human decision." />
      <UploadForm teams={teams} sops={sops} maxUploadMb={getConfig().maxUploadMb} defaultExisting={existing} defaultTeam={viewer.identity?.teams.find((t) => t !== "company-wide") ?? "company-wide"} />
      <Section title="How the lifecycle works">
        <div className="cb-grid cb-grid--4">
          {[
            ["1 · Draft", "Author uploads (sop.author). File stored under source-documents/uploads/, text extracted, indexed, visible as Draft."],
            ["2 · Review", "Author submits. Reviewers (sop.review) can send it back with a note; it appears in the review queue and inbox."],
            ["3 · Approved", "An approver (sop.approve, e.g. Approver or Admin role) approves with a note. It becomes the effective version; the previous approved version is superseded."],
            ["4 · Audit", "Every transition records who, when and why in the audit log. AI never approves, publishes or promotes."],
          ].map(([t, d]) => (
            <div key={t} className="cb-card cb-card--pad">
              <strong>{t}</strong>
              <p className="cb-muted cb-small" style={{ marginTop: 6 }}>{d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
