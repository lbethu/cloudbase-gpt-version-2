import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, FileText, FolderOpen, Search } from "lucide-react";
import { SOP_STATUS_LABELS } from "@/domain";
import { Badge } from "@/components/ui/Badge";
import { Callout, EmptyState, PageHeader } from "@/components/ui/primitives";
import { normalize, tokenize } from "@/server/search/lexical";
import { can } from "@/server/authz";
import { getConfig } from "@/server/config";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { chunksForSop } from "@/server/services/passages";
import { getViewer } from "@/server/services/viewer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().sops.get(id)?.title ?? "Document" };
}

/**
 * Reads the document inside CloudBase.
 *
 * A .docx cannot be displayed by a browser — linking to the file downloads it
 * and drops the reader out of the platform entirely, losing the navigation,
 * the approval state and everything else that gives the document its context.
 * The extracted text is already indexed for search, so it is rendered here
 * instead: instant, searchable, readable without Word, and still inside the
 * shell. The original file stays one click away for anyone who needs it.
 */
export default async function SopDocumentPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ q?: string; v?: string }> }) {
  const { id } = await params;
  const { q, v } = await searchParams;
  const viewer = await getViewer();
  if (!viewer.has("sop.read")) notFound();

  const repos = getRepositories();
  const sop = repos.sops.get(id);
  if (!sop) notFound();
  requireVisible(viewer.identity, "sop", sop);

  const effective = sop.versions.find((ver) => ver.version === sop.effectiveVersion);
  const shown = sop.versions.find((ver) => ver.version === v) ?? effective ?? sop.versions[sop.versions.length - 1];
  const file = shown?.sourceFile;
  const filesAllowed = can(viewer.identity, "files.read");
  const driveAvailable = getConfig().drive.configured;

  const chunks = chunksForSop(repos, sop.id);
  const terms = tokenize(q ?? "");

  // Group consecutive chunks under their heading (DOCX) or page (PDF).
  const sections: Array<{ title: string; page?: number; body: string[] }> = [];
  for (const chunk of chunks) {
    const last = sections[sections.length - 1];
    if (last && last.title === chunk.section && last.page === chunk.page) last.body.push(chunk.content);
    else sections.push({ title: chunk.section, page: chunk.page, body: [chunk.content] });
  }

  const hitCount = terms.length ? chunks.reduce((n, c) => n + terms.reduce((a, t) => a + (normalize(c.content).split(t).length - 1), 0), 0) : 0;

  return (
    <>
      <PageHeader
        eyebrow={sop.sopNumber ? `SOP ${sop.sopNumber} · ${sop.category}` : sop.category}
        title={sop.title}
        description={sop.summary}
        actions={
          <>
            <Link className="cb-btn" href={`/sops/${encodeURIComponent(sop.id)}`}>
              <FileText /> SOP record
            </Link>
            {file && filesAllowed && (
              <>
                {driveAvailable && (
                  <a className="cb-btn" href={`/api/files/${encodeURIComponent(file.id)}/drive`} target="_blank" rel="noopener noreferrer">
                    <FolderOpen /> Open in Google Drive
                  </a>
                )}
                <a className="cb-btn" href={`/api/files/${encodeURIComponent(file.id)}?download=1`}>
                  <Download /> Download original
                </a>
              </>
            )}
          </>
        }
      />

      <div className="cb-chip-row" style={{ marginBottom: 14, alignItems: "center" }}>
        <Badge tone={shown?.status === "approved" ? "success" : "warning"}>{shown ? SOP_STATUS_LABELS[shown.status] : "No version"}</Badge>
        <span className="cb-small cb-muted">Version {shown?.version ?? "—"}</span>
        {sop.versions.length > 1 &&
          sop.versions
            .filter((ver) => ver.version !== shown?.version)
            .map((ver) => (
              <Link key={ver.version} className="cb-chip" href={`/sops/${encodeURIComponent(sop.id)}/document?v=${encodeURIComponent(ver.version)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
                version {ver.version}
              </Link>
            ))}
        {q && (
          <span className="cb-small cb-muted">
            <Search size={12} /> {hitCount} match{hitCount === 1 ? "" : "es"} for “{q}”
          </span>
        )}
      </div>

      {shown?.status !== "approved" && (
        <Callout tone="warning" title="Not an approved version">
          This document is in the library but has not been approved. Read it as a draft, not as policy.
        </Callout>
      )}

      {sections.length === 0 ? (
        <EmptyState
          icon={<FileText size={18} />}
          title="No extracted text for this version"
          description={file ? "The original document is available through the actions above. Run npm run extract:sources if this document was added outside the upload workflow." : "No source document is attached to this version."}
        />
      ) : (
        <article className="cb-card cb-card--pad cb-prose" style={{ maxWidth: 820, lineHeight: 1.65 }}>
          {sections.map((section, i) => (
            <section key={`${section.title}-${i}`} style={{ marginBottom: 26 }}>
              <h2 style={{ fontSize: 15, margin: "0 0 8px", fontWeight: 650 }}>
                {section.title}
                {section.page ? <span className="cb-subtle cb-small" style={{ fontWeight: 400 }}> · page {section.page}</span> : null}
              </h2>
              {section.body.map((paragraphBlock, j) =>
                paragraphBlock.split("\n").map((line, k) =>
                  line.trim() ? (
                    <p key={`${j}-${k}`} style={{ margin: "0 0 8px", whiteSpace: "pre-wrap" }}>
                      {highlight(line, terms)}
                    </p>
                  ) : null,
                ),
              )}
            </section>
          ))}
        </article>
      )}

      <p className="cb-subtle cb-small" style={{ marginTop: 14, maxWidth: 820 }}>
        This is the text extracted from {file?.label ?? "the source document"}. Formatting, images and tables are not reproduced — open the original if layout matters.
      </p>
    </>
  );
}

/** Marks the searched words so the reader lands on the reason they came here. */
function highlight(line: string, terms: string[]) {
  if (!terms.length) return line;
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = line.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) && terms.some((t) => part.toLowerCase() === t.toLowerCase()) ? (
      <mark key={i} style={{ background: "var(--cb-accent-soft, #fde68a)", padding: "0 1px", borderRadius: 2 }}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
