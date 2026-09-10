import type { Metadata } from "next";
import Link from "next/link";
import { CodeCopy } from "@/components/docs/CodeCopy";
import { AsideCard, DetailHeader, DetailLayout, MetaList, RelatedPanel } from "@/components/ui/DetailPage";
import { Callout } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { relatedFor, teamName } from "@/server/services/catalog";
import { renderMarkdown } from "@/server/services/markdown";
import { getViewer } from "@/server/services/viewer";

const find = (slug: string[]) => {
  const joined = slug.map(decodeURIComponent).join("/");
  return getRepositories().docs.list().find((d) => d.slug === joined || d.id === joined);
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: find(slug)?.title ?? "Documentation" };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const viewer = await getViewer();
  const doc = requireVisible(viewer.identity, "documentation", find(slug));
  const { html, headings } = await renderMarkdown(doc.body);
  const related = relatedFor(viewer.identity, { type: "documentation", id: doc.id });
  return (
    <>
      <DetailHeader
        type="documentation"
        title={doc.title}
        status={doc.status}
        summary={doc.summary}
        facts={[
          { label: "Domain", value: doc.domain },
          { label: "Category", value: doc.category },
          { label: "Team", value: <Link href={`/teams/${doc.owningTeam}`}>{teamName(doc.owningTeam)}</Link> },
          { label: "Owner", value: doc.owner || "Unassigned" },
          { label: "Version", value: doc.version },
          { label: "Last reviewed", value: doc.lastReviewedAt ?? "Not yet reviewed" },
        ]}
      />
      {doc.status !== "published" && (
        <Callout tone="warning" title={`This document is in ${doc.status}`}>It has not completed review. Use it as guidance, not as an approved standard, until it is published.</Callout>
      )}
      <div className="cb-doc-layout" style={{ marginTop: 20 }}>
        <article id="doc-body" className="cb-prose" dangerouslySetInnerHTML={{ __html: html }} />
        <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {headings.length > 0 && (
            <nav className="cb-toc" aria-label="On this page">
              <h3>On this page</h3>
              {headings.map((h) => (
                <a key={h.id} href={`#${h.id}`} data-depth={h.depth}>
                  {h.text}
                </a>
              ))}
            </nav>
          )}
          <RelatedPanel groups={related} />
          <AsideCard title="Metadata">
            <MetaList items={[{ label: "Id", value: <span className="cb-mono">{doc.id}</span> }, { label: "Classification", value: doc.classification }, { label: "Updated", value: doc.updatedAt }, { label: "Tags", value: doc.tags.join(", ") || undefined }]} />
          </AsideCard>
          {doc.references.length > 0 && (
            <AsideCard title="References">
              <ul className="cb-aside-list">
                {doc.references.map((r) => (
                  <li key={r}>{/^https?:\/\//.test(r) ? <a href={r} target="_blank" rel="noopener noreferrer">{r}</a> : <span>{r}</span>}</li>
                ))}
              </ul>
            </AsideCard>
          )}
        </aside>
      </div>
      <CodeCopy containerId="doc-body" />
    </>
  );
}
