import type { ContentType, KnowledgeItem } from "@/domain";

/**
 * Provider-neutral search seam.
 *
 * Phase 1 ships `LexicalSearchProvider` (deterministic ranking over the
 * in-memory knowledge index). A `HybridSearchProvider` (embeddings + vector
 * store + reranking) implements the same contract; it is selected with
 * `CLOUDBASE_SEARCH_PROVIDER=hybrid` once configured. Providers only ever see
 * items the caller has already filtered by permission.
 */

export interface SearchFilters {
  types?: ContentType[];
  team?: string;
  status?: string;
  tags?: string[];
  category?: string;
  maturity?: string;
}

export interface SearchQuery {
  q: string;
  filters?: SearchFilters;
  limit?: number;
}

export interface SearchHit {
  item: KnowledgeItem;
  score: number;
  /** Short snippet around the strongest match; safe to render as text. */
  snippet: string;
  matchedTerms: string[];
  /** Where inside the object the strongest match was found (SOP section / page). */
  location?: { section?: string; page?: number; chunkId?: string };
}

export interface SearchProvider {
  readonly name: string;
  search(query: SearchQuery, items: KnowledgeItem[]): Promise<SearchHit[]>;
}

export function applyFilters(items: KnowledgeItem[], filters: SearchFilters | undefined): KnowledgeItem[] {
  if (!filters) return items;
  return items.filter((item) => {
    if (filters.types?.length && !filters.types.includes(item.ref.type)) return false;
    if (filters.team && item.owningTeam !== filters.team && !item.teams.includes(filters.team)) return false;
    if (filters.status && item.status.toLowerCase() !== filters.status.toLowerCase()) return false;
    if (filters.category && (item.category ?? "").toLowerCase() !== filters.category.toLowerCase()) return false;
    if (filters.maturity && !(item.maturity ?? "").toLowerCase().startsWith(filters.maturity.toLowerCase())) return false;
    if (filters.tags?.length && !filters.tags.every((t) => item.tags.map((x) => x.toLowerCase()).includes(t.toLowerCase()))) return false;
    return true;
  });
}
