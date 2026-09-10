import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { SOP_STATUS_LABELS } from "@/domain";
import { Badge } from "@/components/ui/Badge";
import { Callout, EmptyState, ItemList, ItemRow, PageHeader } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { searchKnowledge } from "@/server/services/search";
import { getViewer } from "@/server/services/viewer";
import { Highlight } from "@/components/ui/Highlight";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "SOP Library" };

type Params = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function SopsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const viewer = await getViewer();
  if (!viewer.has("sop.read")) return <Callout tone="warning" title="Not authorized">Your role does not include sop.read.</Callout>;
  const repos = getRepositories();
  const q = first(params.q).toLowerCase();
  const team = first(params.team);
  const status = first(params.status);
  const category = first(params.category);
  const kind = first(params.kind);

  const all = filterVisible(viewer.identity, "sop", repos.sops.list());
  // Full-text ranking over every extracted section when a query is present.
  const ranked = q ? await searchKnowledge(viewer.identity, { q: first(params.q), limit: 100, filters: { types: ["sop"] } }) : null;
  const rankIndex = new Map(ranked?.hits.map((h, i) => [h.item.ref.id, { rank: i, hit: h }]) ?? []);
  const effectiveOf = (s: (typeof all)[number]) => s.versions.find((v) => v.version === s.effectiveVersion) ?? s.versions[s.versions.length - 1];
  const list = all
    .filter((s) => !team || s.owningTeam === team || s.teams.includes(team))
    .filter((s) => !status || effectiveOf(s).status === status)
    .filter((s) => !category || s.category === category)
    .filter((s) => !kind || s.kind === kind)
    .filter((s) => !q || rankIndex.has(s.id))
    .sort((a, b) => (q ? (rankIndex.get(a.id)!.rank - rankIndex.get(b.id)!.rank) : (a.sopNumber || "zzz").localeCompare(b.sopNumber || "zzz", undefined, { numeric: true }) || a.title.localeCompare(b.title)));

  const categories = [...new Set(all.map((s) => s.category))].sort();
  const teams = repos.teams.list();
  const counts = { approved: all.filter((s) => effectiveOf(s).status === "approved").length, review: all.filter((s) => effectiveOf(s).status === "review").length };

  return (
    <>
      <PageHeader
        eyebrow="Knowledge"
        title="SOP Library"
        description="Governed standard operating procedures, checklists and guides. Each SOP keeps its full version history; only an approved version is the version in force."
        actions={viewer.has("sop.author") ? <Link className="cb-btn" href="/sops/new">Create SOP draft</Link> : undefined}
      />
      <div className="cb-stats" style={{ marginBottom: 20 }}>
        <div className="cb-card cb-stat"><strong>{all.length}</strong><span>SOPs and guides registered</span></div>
        <div className="cb-card cb-stat"><strong>{counts.approved}</strong><span>with an approved effective version</span></div>
        <div className="cb-card cb-stat"><strong>{counts.review}</strong><span>awaiting owner review</span></div>
      </div>
      <form className="cb-toolbar" method="get">
        <input className="cb-input cb-search-input" type="search" name="q" defaultValue={first(params.q)} placeholder="Search full text of every SOP — e.g. sql, BigTime, invoicing, packing list…" aria-label="Filter SOPs" />
        <select className="cb-select" name="team" defaultValue={team} aria-label="Team">
          <option value="">All teams</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select className="cb-select" name="status" defaultValue={status} aria-label="Lifecycle status">
          <option value="">Any status</option>
          {Object.entries(SOP_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="cb-select" name="category" defaultValue={category} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="cb-select" name="kind" defaultValue={kind} aria-label="Kind">
          <option value="">All kinds</option>
          {["sop", "checklist", "guide", "manual", "policy"].map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <button className="cb-btn" type="submit">Apply</button>
      </form>
      {q && <p className="cb-subtle cb-small" style={{ marginBottom: 10 }}>{list.length} SOP{list.length === 1 ? "" : "s"} mention “{first(params.q)}” — ranked by relevance across all extracted sections and pages.</p>}
      {list.length === 0 ? (
        <EmptyState icon={<BookOpen size={18} />} title={all.length === 0 ? "No SOPs are registered yet" : "No SOPs match these filters"} description={all.length === 0 ? "Approved procedures appear here once they are registered and reviewed." : "Try clearing a filter or searching by SOP number."} action={all.length ? { label: "Clear filters", href: "/sops" } : undefined} />
      ) : (
        <ItemList>
          {list.map((s) => {
            const eff = effectiveOf(s);
            return (
              <ItemRow
                key={s.id}
                href={urlFor({ type: "sop", id: s.id })}
                title={s.title}
                subtitle={q && rankIndex.get(s.id) ? <><span style={{ color: "var(--accent-soft-fg)", fontWeight: 600 }}>{rankIndex.get(s.id)!.hit.location?.section ? `${rankIndex.get(s.id)!.hit.location!.section}${rankIndex.get(s.id)!.hit.location!.page && !/^page\b/i.test(rankIndex.get(s.id)!.hit.location!.section ?? "") ? ` · p.${rankIndex.get(s.id)!.hit.location!.page}` : ""}: ` : ""}</span><Highlight text={rankIndex.get(s.id)!.hit.snippet} terms={rankIndex.get(s.id)!.hit.matchedTerms.length ? rankIndex.get(s.id)!.hit.matchedTerms : [first(params.q)]} /></> : (s.summary || `${s.category} · ${s.versions.length} version${s.versions.length === 1 ? "" : "s"}`)}
                status={SOP_STATUS_LABELS[eff.status]}
                meta={
                  <>
                    {s.kind !== "sop" && <Badge tone="outline">{s.kind}</Badge>}
                    {s.sopNumber && <span className="cb-mono">SOP {s.sopNumber}</span>}
                    <span>{repos.teams.get(s.owningTeam)?.name ?? s.owningTeam}</span>
                  </>
                }
              />
            );
          })}
        </ItemList>
      )}
    </>
  );
}
