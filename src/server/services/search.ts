import "server-only";
import path from "node:path";
import { z } from "zod";
import type { KnowledgeItem } from "@/domain";
import type { Identity } from "@/server/auth/identity";
import { canRead } from "@/server/authz";
import { getConfig } from "@/server/config";
import { getRepositories } from "@/server/repositories";
import { loadYamlCollection } from "@/server/repositories/registry";
import { HybridSearchProvider, LexicalSearchProvider, type SynonymGroup } from "@/server/search/lexical";
import type { SearchHit, SearchProvider, SearchQuery } from "@/server/search/provider";
import { buildKnowledgeIndex } from "./knowledge-index";
import { bestPassage } from "./passages";

const Synonym = z.object({ concept: z.string(), terms: z.array(z.string()) });

let provider: SearchProvider | null = null;
function getProvider(): SearchProvider {
  if (provider) return provider;
  const cfg = getConfig();
  if (cfg.search.provider === "hybrid") provider = new HybridSearchProvider();
  else {
    const synonyms: SynonymGroup[] = loadYamlCollection(path.join(cfg.contentDir, "registry", "search-synonyms.yaml"), Synonym);
    provider = new LexicalSearchProvider(synonyms);
  }
  return provider;
}

export function knowledgeIndex(): KnowledgeItem[] {
  return buildKnowledgeIndex(getRepositories());
}

/** Items the identity may read. Every list, search and AI retrieval starts here. */
export function permittedItems(identity: Identity | null): KnowledgeItem[] {
  return knowledgeIndex().filter((item) =>
    canRead(identity, {
      type: item.ref.type,
      classification: item.classification,
      owningTeam: item.owningTeam,
      teams: item.teams,
      accessGrants: [],
    }),
  );
}

export type PublicSearchHit = Omit<SearchHit, "item"> & { item: Omit<KnowledgeItem, "body"> };

const stripBody = (hit: SearchHit): PublicSearchHit => {
  const { body: _body, ...item } = hit.item;
  void _body;
  return { ...hit, item };
};

export async function searchKnowledge(identity: Identity | null, query: SearchQuery): Promise<{ hits: PublicSearchHit[]; provider: string; total: number }> {
  const items = permittedItems(identity);
  const hits = await getProvider().search(query, items);
  const repos = getRepositories();
  const located = hits.map((hit) => {
    if (hit.item.ref.type !== "sop" || !query.q.trim()) return hit;
    const match = bestPassage(repos, hit.item, query.q, 220);
    return match.chunkId ? { ...hit, snippet: match.passage.replace(/\s+/g, " "), location: { section: match.section, page: match.page, chunkId: match.chunkId } } : hit;
  });
  return { hits: located.map(stripBody), provider: getProvider().name, total: items.length };
}

/** Recent updates across all permitted knowledge (home feed). */
export function recentlyUpdated(identity: Identity | null, limit = 8): Omit<KnowledgeItem, "body">[] {
  return permittedItems(identity)
    .filter((i) => i.updatedAt)
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
    .slice(0, limit)
    .map(({ body: _b, ...rest }) => {
      void _b;
      return rest;
    });
}
