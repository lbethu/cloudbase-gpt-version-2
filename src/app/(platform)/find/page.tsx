import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FileText, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Callout, EmptyState, PageHeader } from "@/components/ui/primitives";
import { getConfig } from "@/server/config";
import { getRepositories } from "@/server/repositories";
import { passagesForSop } from "@/server/services/passages";
import { searchKnowledge } from "@/server/services/search";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Find an SOP" };
export const dynamic = "force-dynamic";

/**
 * The one-purpose page: type a word that appears in an SOP, get the document.
 *
 * Deliberately not the general search page. Someone looking for "the expenses
 * one" wants the document open, not a ranked list of every governed object
 * that mentions expenses — so this searches SOPs only, shows the line the word
 * actually appears on, and puts Open document first.
 */
export default async function FindPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const viewer = await getViewer();
  if (!viewer.has("sop.read")) return <Callout tone="warning" title="Not authorized">Finding SOPs requires sop.read.</Callout>;

  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const canOpenFiles = viewer.has("files.read");
  const driveConfigured = getConfig().drive.configured;

  const { hits } = query ? await searchKnowledge(viewer.identity!, { q: query, limit: 12, filters: { types: ["sop"] } }) : { hits: [] };
  const repos = getRepositories();

  return (
    <>
      <PageHeader eyebrow="SOP Library" title="Find an SOP" description="Type any word that appears in the document — a step, a system, a form name. This searches inside the SOPs themselves, not only their titles." />

      <form action="/find" method="get" className="cb-card cb-card--pad" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Search size={18} aria-hidden />
        <input className="cb-input" name="q" defaultValue={query} placeholder="expenses, invoice, project startup, conference abstract…" aria-label="Search inside SOPs" autoFocus style={{ flex: 1, fontSize: 15, height: 40 }} />
        <button className="cb-btn cb-btn--primary">Find</button>
      </form>

      {!query && (
        <div style={{ marginTop: 20 }}>
          <EmptyState icon={<FileText size={18} />} title="Search the full text of every approved SOP" description="Results show the sentence your word appears in, and open the original Word or PDF document." />
        </div>
      )}

      {query && hits.length === 0 && (
        <div style={{ marginTop: 20 }}>
          <EmptyState icon={<Search size={18} />} title={`No SOP mentions “${query}”`} description="Try a single distinctive word from the document. If you expect an SOP to exist and it does not, it may not have been uploaded yet." />
        </div>
      )}

      {query &&
        hits.map((hit) => {
          const sop = repos.sops.get(hit.item.ref.id);
          if (!sop) return null;
          const effective = sop.versions.find((v) => v.version === sop.effectiveVersion);
          const shown = effective ?? sop.versions[sop.versions.length - 1];
          const file = shown?.sourceFile;
          const passages = passagesForSop(repos, sop.id, query, 2, 260);
          return (
            <div key={hit.item.ref.id} className="cb-card cb-card--pad" style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
                <div>
                  <div style={{ fontWeight: 650, fontSize: 15 }}>
                    <Link href={hit.item.url}>{sop.title}</Link>
                  </div>
                  <div className="cb-small cb-muted">
                    {sop.sopNumber ? `SOP ${sop.sopNumber} · ` : ""}
                    {sop.category}
                    {effective ? "" : " · not yet approved"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <Badge tone={effective ? "success" : "warning"}>{effective ? "Approved" : hit.item.status}</Badge>
                  {file && canOpenFiles && (
                    <>
                      <a className="cb-btn cb-btn--primary cb-btn--sm" href={`/api/files/${encodeURIComponent(file.id)}`} target="_blank" rel="noopener noreferrer">
                        <FileText /> Open document
                      </a>
                      {driveConfigured && (
                        <a className="cb-btn cb-btn--sm" href={`/api/files/${encodeURIComponent(file.id)}/drive`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink /> Open in Drive
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>

              {passages.length > 0 && (
                <div style={{ display: "grid", gap: 8 }}>
                  {passages.map((p) => (
                    <div key={p.chunkId} className="cb-small" style={{ borderLeft: "2px solid var(--cb-border, #d7dae0)", paddingLeft: 10 }}>
                      <div className="cb-subtle" style={{ fontSize: 11 }}>
                        {p.section}
                        {p.page ? ` · page ${p.page}` : ""}
                        {(p.occurrences ?? 0) > 1 ? ` · ${p.occurrences} mentions here` : ""}
                      </div>
                      <div>…{p.passage}…</div>
                    </div>
                  ))}
                </div>
              )}

              {!effective && (
                <p className="cb-subtle cb-small" style={{ margin: 0 }}>
                  This document is in the library but no version has been approved yet — read it as a draft, not as policy.
                </p>
              )}
            </div>
          );
        })}
    </>
  );
}
