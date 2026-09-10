import type { KnowledgeItem } from "@/domain";
import { applyFilters, type SearchHit, type SearchProvider, type SearchQuery } from "./provider";

/**
 * Deterministic lexical ranking (evolved from the prototype's retrieval
 * engine): weighted field matches, exact-phrase bonus, synonym expansion.
 * Synonyms are data (content/registry/search-synonyms.yaml), not code.
 */

const STOP = new Set([
  "a", "an", "and", "are", "be", "before", "do", "for", "how", "i", "in", "is", "it", "me", "my", "need", "of", "on", "or",
  "should", "the", "to", "what", "when", "where", "who", "with", "we", "our", "does", "have", "has", "can", "there",
]);

export const normalize = (value: string) => value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9%/.-]+/g, " ").trim();
export const tokenize = (value: string) => normalize(value).split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));

const stem = (t: string) => t.replace(/(ings?|ed|es|s)$/, "");

const escapeRe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whole-word occurrences for short tokens (so "sql" never matches inside "sqlite"), substring for longer ones. */
export function countOccurrences(haystack: string, token: string): number {
  if (!token) return 0;
  const re = token.length <= 4 ? new RegExp(`(^|[^a-z0-9])${escapeRe(token)}(?=$|[^a-z0-9])`, "g") : new RegExp(escapeRe(token), "g");
  return (haystack.match(re) ?? []).length;
}

export interface SynonymGroup {
  concept: string;
  terms: string[];
}

export class LexicalSearchProvider implements SearchProvider {
  readonly name = "lexical";
  constructor(private readonly synonyms: SynonymGroup[] = []) {}

  private expand(query: string): { tokens: string[]; phrases: string[] } {
    const normalized = normalize(query);
    const tokens = new Set(tokenize(query));
    const phrases: string[] = [];
    const hasPhrase = (term: string) => {
      const t = normalize(term);
      if (!t) return false;
      if (!t.includes(" ")) return tokens.has(t) || normalized.split(/\s+/).includes(t);
      return ` ${normalized} `.includes(` ${t} `);
    };
    for (const group of this.synonyms) {
      if (group.terms.some(hasPhrase)) {
        group.terms.forEach((term) => {
          phrases.push(term.toLowerCase());
          tokenize(term).forEach((t) => tokens.add(t));
        });
      }
    }
    return { tokens: [...tokens], phrases };
  }

  private score(item: KnowledgeItem, tokens: string[], phrases: string[], rawQuery: string): { score: number; matched: string[] } {
    const title = normalize(item.title);
    const summary = normalize(item.summary);
    const tags = item.tags.map(normalize).join(" ");
    const meta = normalize([item.ref.id, item.category ?? "", item.status, item.owningTeam].join(" "));
    const body = normalize(item.body);
    const matched = new Set<string>();
    let score = 0;
    const titleTokens = new Set(tokenize(item.title).map(stem));
    const bodyTokens = new Set(tokenize(item.body).map(stem));

    for (const token of tokens) {
      const s = stem(token);
      let hit = false;
      const has = (field: string) => countOccurrences(field, token) > 0;
      if (has(title) || titleTokens.has(s)) { score += 12; hit = true; }
      if (has(tags)) { score += 6; hit = true; }
      if (has(meta)) { score += 5; hit = true; }
      if (has(summary)) { score += 4; hit = true; }
      const occurrences = countOccurrences(body, token);
      if (occurrences > 0 || bodyTokens.has(s)) {
        // Term frequency (log-scaled) so a document that is *about* the term outranks a passing mention.
        score += 4 + Math.min(10, Math.round(Math.log2(occurrences + 1) * 3));
        hit = true;
      }
      if (hit) matched.add(token);
    }
    const q = normalize(rawQuery);
    if (q.length > 3) {
      if (title.includes(q)) score += 30;
      else if (body.includes(q) || summary.includes(q)) score += 12;
    }
    for (const phrase of phrases) {
      if (phrase.length > 3 && (title.includes(phrase) || body.includes(phrase))) score += 4;
    }
    // Identifier match (CAP-004, CP-RND-002, 105.2) is almost always intent.
    if (item.ref.id.toLowerCase() === q || meta.split(" ").includes(q)) score += 40;
    // Require coverage: at least half the query tokens should hit for multi-token queries.
    if (tokens.length > 1 && matched.size < Math.ceil(tokens.length / 2)) score = Math.min(score, 3);
    return { score, matched: [...matched] };
  }

  private snippet(item: KnowledgeItem, tokens: string[]): string {
    const source = item.body || item.summary;
    if (!source) return "";
    const lower = source.toLowerCase();
    let at = -1;
    for (const t of tokens) {
      const m = t.length <= 4 ? new RegExp(`(^|[^a-z0-9])${escapeRe(t)}(?=$|[^a-z0-9])`).exec(lower) : null;
      at = m ? m.index + m[1].length : lower.indexOf(t);
      if (at >= 0) break;
    }
    if (at < 0) return source.slice(0, 180).replace(/\s+/g, " ").trim();
    const start = Math.max(0, at - 70);
    const end = Math.min(source.length, at + 130);
    return `${start > 0 ? "…" : ""}${source.slice(start, end).replace(/\s+/g, " ").trim()}${end < source.length ? "…" : ""}`;
  }

  async search(query: SearchQuery, items: KnowledgeItem[]): Promise<SearchHit[]> {
    const candidates = applyFilters(items, query.filters);
    const q = query.q.trim();
    const limit = query.limit ?? 25;
    if (!q) {
      return candidates
        .slice()
        .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") || a.title.localeCompare(b.title))
        .slice(0, limit)
        .map((item) => ({ item, score: 0, snippet: item.summary, matchedTerms: [] }));
    }
    const { tokens, phrases } = this.expand(q);
    const hits: SearchHit[] = [];
    for (const item of candidates) {
      const { score, matched } = this.score(item, tokens, phrases, q);
      if (score >= 4) hits.push({ item, score, snippet: this.snippet(item, matched.length ? matched : tokens), matchedTerms: matched });
    }
    return hits.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title)).slice(0, limit);
  }
}

/** Placeholder for hybrid (embedding + vector + rerank) retrieval. Fails closed until configured. */
export class HybridSearchProvider implements SearchProvider {
  readonly name = "hybrid";
  async search(): Promise<SearchHit[]> {
    throw new Error("Hybrid/semantic search is not configured. Set CLOUDBASE_SEARCH_PROVIDER=lexical or connect a vector provider.");
  }
}
