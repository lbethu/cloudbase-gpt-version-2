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

  /**
   * Splits the query into the words the user actually typed and the words a
   * synonym group added. The two are kept apart deliberately: expansion must
   * widen what can be found, never redefine what the query means. Folding them
   * into one list makes a document that matches many synonyms outrank the one
   * that matches the literal query — and makes the coverage rule below reject
   * the literal match outright.
   */
  private expand(query: string): { tokens: string[]; expanded: string[]; phrases: string[] } {
    const normalized = normalize(query);
    const tokens = new Set(tokenize(query));
    const expanded = new Set<string>();
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
          tokenize(term).forEach((t) => {
            if (!tokens.has(t)) expanded.add(t);
          });
        });
      }
    }
    return { tokens: [...tokens], expanded: [...expanded], phrases };
  }

  private score(item: KnowledgeItem, tokens: string[], expanded: string[], phrases: string[], rawQuery: string): { score: number; matched: string[] } {
    const title = normalize(item.title);
    const summary = normalize(item.summary);
    const tags = item.tags.map(normalize).join(" ");
    const meta = normalize([item.ref.id, item.category ?? "", item.status, item.owningTeam].join(" "));
    const body = normalize(item.body);
    const matched = new Set<string>();
    let score = 0;
    const titleTokens = new Set(tokenize(item.title).map(stem));
    const bodyTokens = new Set(tokenize(item.body).map(stem));

    // Words the user typed score in full; synonym-derived words score at a
    // fraction, so they can surface a document but never outrank a literal match.
    const SYNONYM_WEIGHT = 0.35;
    const scoreToken = (token: string, weight: number): boolean => {
      const s = stem(token);
      let hit = false;
      let gained = 0;
      const has = (field: string) => countOccurrences(field, token) > 0;
      if (has(title) || titleTokens.has(s)) { gained += 12; hit = true; }
      if (has(tags)) { gained += 6; hit = true; }
      if (has(meta)) { gained += 5; hit = true; }
      if (has(summary)) { gained += 4; hit = true; }
      const occurrences = countOccurrences(body, token);
      if (occurrences > 0 || bodyTokens.has(s)) {
        // Term frequency (log-scaled) so a document that is *about* the term outranks a passing mention.
        gained += 4 + Math.min(10, Math.round(Math.log2(occurrences + 1) * 3));
        hit = true;
      }
      score += gained * weight;
      return hit;
    };
    for (const token of tokens) if (scoreToken(token, 1)) matched.add(token);
    for (const token of expanded) scoreToken(token, SYNONYM_WEIGHT);
    // Every word of the query present in the title is the clearest statement of
    // intent there is — "employee expenses" means the SOP called Employee
    // Expenses, not the longer document that happens to say the words more often.
    if (tokens.length > 0 && tokens.every((t) => countOccurrences(title, t) > 0 || titleTokens.has(stem(t)))) score += 25;
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
    // Require coverage over the words the user typed — never over the expanded
    // set, or a query whose word happens to sit in a large synonym group would
    // suppress the very documents that match it.
    if (tokens.length > 1 && matched.size < Math.ceil(tokens.length / 2)) score = Math.min(score, 3);
    return { score: Math.round(score), matched: [...matched] };
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
    const { tokens, expanded, phrases } = this.expand(q);
    const hits: SearchHit[] = [];
    for (const item of candidates) {
      const { score, matched } = this.score(item, tokens, expanded, phrases, q);
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
