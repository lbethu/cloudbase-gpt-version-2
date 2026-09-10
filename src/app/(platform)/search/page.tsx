import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { CONTENT_TYPE_LABELS, isContentType, type ContentType } from "@/domain";
import { StatusBadge, TypeBadge } from "@/components/ui/Badge";
import { Highlight } from "@/components/ui/Highlight";
import { Callout, EmptyState, PageHeader } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { permittedItems, searchKnowledge } from "@/server/services/search";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Search" };

type Params = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const all = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const viewer = await getViewer();
  const q = first(params.q).slice(0, 300);
  const types = all(params.type).filter(isContentType) as ContentType[];
  const team = first(params.team) || undefined;
  const status = first(params.status) || undefined;
  const repos = getRepositories();

  let error: string | null = null;
  let hits: Awaited<ReturnType<typeof searchKnowledge>>["hits"] = [];
  let providerName = "";
  try {
    const result = await searchKnowledge(viewer.identity, { q, limit: 50, filters: { types: types.length ? types : undefined, team, status } });
    hits = result.hits;
    providerName = result.provider;
  } catch (e) {
    error = e instanceof Error ? e.message : "Search is unavailable.";
  }

  // Facets are computed over the permitted corpus, never over hidden items.
  const corpus = permittedItems(viewer.identity);
  const typeCounts = corpus.reduce<Record<string, number>>((acc, i) => ((acc[i.ref.type] = (acc[i.ref.type] ?? 0) + 1), acc), {});
  const teams = repos.teams.list();
  const link = (patch: Record<string, string | string[] | undefined>) => {
    const sp = new URLSearchParams();
    const merged = { q, type: types, team, status, ...patch };
    if (merged.q) sp.set("q", merged.q);
    for (const t of merged.type ?? []) sp.append("type", t);
    if (merged.team) sp.set("team", merged.team);
    if (merged.status) sp.set("status", merged.status);
    return `/search?${sp.toString()}`;
  };
  const toggleType = (t: ContentType) => link({ type: types.includes(t) ? types.filter((x) => x !== t) : [...types, t] });

  return (
    <>
      <PageHeader eyebrow="Universal search" title="Search Cloudpoint knowledge" description="Keyword search across SOPs, documentation, research, R&D, capabilities, copilots, automations, project references and team workspaces. Results are limited to what you are authorized to read." />
      <form className="cb-toolbar" action="/search" method="get" role="search">
        <input className="cb-input cb-search-input" type="search" name="q" defaultValue={q} placeholder="Search SOPs, projects, R&D, capabilities, copilots, documentation…" aria-label="Search query" />
        {types.map((t) => (
          <input key={t} type="hidden" name="type" value={t} />
        ))}
        {team && <input type="hidden" name="team" value={team} />}
        <button className="cb-btn cb-btn--primary" type="submit">
          <Search /> Search
        </button>
      </form>

      <div className="cb-search-layout">
        <aside className="cb-facets cb-card cb-card--pad" aria-label="Filters">
          <h3>Content type</h3>
          <Link href={link({ type: [] })} aria-current={types.length === 0 ? "true" : undefined}>
            <span>All types</span>
            <span>{corpus.length}</span>
          </Link>
          {(Object.keys(CONTENT_TYPE_LABELS) as ContentType[])
            .filter((t) => typeCounts[t])
            .map((t) => (
              <Link key={t} href={toggleType(t)} aria-current={types.includes(t) ? "true" : undefined}>
                <span>{CONTENT_TYPE_LABELS[t]}</span>
                <span>{typeCounts[t]}</span>
              </Link>
            ))}
          <h3>Team</h3>
          <Link href={link({ team: undefined })} aria-current={!team ? "true" : undefined}>
            <span>Any team</span>
          </Link>
          {teams.map((t) => (
            <Link key={t.id} href={link({ team: t.id })} aria-current={team === t.id ? "true" : undefined}>
              <span>{t.name}</span>
            </Link>
          ))}
        </aside>

        <div>
          {error ? (
            <Callout tone="warning" title="Search provider unavailable">
              {error}
            </Callout>
          ) : !q && !types.length && !team ? (
            <EmptyState icon={<Search size={18} />} title="Search everything Cloudpoint knows" description="Type a question, an SOP number (e.g. 105.2), a capability id (CAP-004) or a topic. Use the filters to narrow by type or team." />
          ) : hits.length === 0 ? (
            <EmptyState title="No knowledge matches" description={`Nothing in the governed index matches ${q ? `“${q}”` : "these filters"}. Try broader terms, remove a filter, or ask CloudBase for a source-backed answer.`} action={viewer.has("ask.use") && q ? { label: "Ask CloudBase", href: `/ask?q=${encodeURIComponent(q)}` } : undefined} />
          ) : (
            <div className="cb-card">
              <div className="cb-result" style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-subtle)", fontSize: 12 }}>
                <span>
                  {hits.length} result{hits.length === 1 ? "" : "s"}
                  {q ? ` for “${q}”` : ""}
                </span>
                <span>ranking: {providerName}</span>
              </div>
              {hits.map((hit) => (
                <article key={`${hit.item.ref.type}:${hit.item.ref.id}`} className="cb-result">
                  <div className="cb-result-title">
                    <TypeBadge type={hit.item.ref.type} />
                    <Link href={hit.location?.chunkId ? `${hit.item.url}?chunk=${encodeURIComponent(hit.location.chunkId)}` : hit.item.url}>{hit.item.title}</Link>
                    <StatusBadge status={hit.item.status} />
                  </div>
                  {hit.snippet && <p className="cb-result-snippet"><Highlight text={hit.snippet} terms={hit.matchedTerms.length ? hit.matchedTerms : [q]} /></p>}
                  <div className="cb-result-meta">
                    {hit.location?.section && <span style={{ color: "var(--accent-soft-fg)", fontWeight: 600 }}>Matched in: {hit.location.section}{hit.location.page && !/^page\b/i.test(hit.location.section) ? ` · page ${hit.location.page}` : ""}</span>}
                    <span>{repos.teams.get(hit.item.owningTeam)?.name ?? hit.item.owningTeam}</span>
                    {hit.item.category && <span>{hit.item.category}</span>}
                    {hit.item.updatedAt && <span>Updated {hit.item.updatedAt}</span>}
                    <span className="cb-mono">{hit.item.ref.id}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
