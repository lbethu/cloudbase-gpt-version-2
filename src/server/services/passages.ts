import type { ImportedContent, KnowledgeItem } from "@/domain";
import type { Repositories } from "@/server/repositories/interfaces";
import { countOccurrences, normalize, tokenize } from "@/server/search/lexical";

export interface PassageMatch {
  passage: string;
  section?: string;
  page?: number;
  chunkId?: string;
  score: number;
  /** Total occurrences of the query terms across the whole object. */
  occurrences?: number;
}

/** Excerpt of `text` centred on the first occurrence of any term (whole-word for short terms). */
export function excerptAround(text: string, terms: string[], maxLength = 600): string {
  const lower = text.toLowerCase();
  let at = -1;
  for (const t of terms) {
    const re = t.length <= 4 ? new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[^a-z0-9])`) : null;
    const m = re ? re.exec(lower) : null;
    const i = m ? m.index + m[1].length : re ? -1 : lower.indexOf(t);
    if (i >= 0 && (at < 0 || i < at)) at = i;
  }
  if (at < 0 || text.length <= maxLength) return text.slice(0, maxLength);
  const start = Math.max(0, at - Math.floor(maxLength * 0.35));
  const end = Math.min(text.length, start + maxLength);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

/** Every chunk of an SOP that mentions the query, best first (for "find everywhere" answers). */
export function matchingPassages(repos: Repositories, item: KnowledgeItem, query: string, limit = 3, maxLength = 420): PassageMatch[] {
  const terms = tokenize(query);
  if (item.ref.type !== "sop" || !terms.length) return [];
  const scored = chunksForSop(repos, item.ref.id)
    .map((chunk) => {
      const text = normalize(`${chunk.section} ${chunk.content}`);
      const occ = terms.reduce((acc, t) => acc + countOccurrences(text, t), 0);
      return { chunk, occ };
    })
    .filter((x) => x.occ > 0)
    .sort((a, b) => b.occ - a.occ);
  return scored.slice(0, limit).map(({ chunk, occ }) => ({ passage: excerptAround(chunk.content, terms, maxLength), section: chunk.section, page: chunk.page, chunkId: chunk.id, score: occ, occurrences: occ }));
}

/** All extracted chunks behind an SOP (every version's imported content). */
export function chunksForSop(repos: Repositories, sopId: string): ImportedContent["chunks"] {
  const sop = repos.sops.get(sopId);
  if (!sop) return [];
  const seen = new Set<string>();
  const out: ImportedContent["chunks"] = [];
  for (const v of sop.versions) {
    const content = v.importedContentId ? repos.sops.importedContent(v.importedContentId) : undefined;
    for (const c of content?.chunks ?? []) if (!seen.has(c.id)) { seen.add(c.id); out.push(c); }
  }
  return out;
}

/** Best passage for a query inside an item — chunk-level for SOPs, excerpt otherwise. Pure. */
export function bestPassage(repos: Repositories, item: KnowledgeItem, query: string, maxLength = 600): PassageMatch {
  const terms = tokenize(query);
  if (item.ref.type === "sop") {
    let best: PassageMatch | null = null;
    for (const chunk of chunksForSop(repos, item.ref.id)) {
      const text = normalize(`${chunk.section} ${chunk.content}`);
      const score = terms.reduce((acc, t) => acc + Math.min(5, countOccurrences(text, t)) + (normalize(chunk.section).includes(t) ? 3 : 0), 0);
      if (!best || score > best.score) best = { passage: excerptAround(chunk.content, terms, maxLength), section: chunk.section, page: chunk.page, chunkId: chunk.id, score };
    }
    if (best) {
      best.occurrences = chunksForSop(repos, item.ref.id).reduce((n, c) => n + terms.reduce((a, t) => a + countOccurrences(normalize(c.content), t), 0), 0);
      return best;
    }
  }
  const body = item.body || item.summary;
  const occurrences = terms.reduce((a, t) => a + countOccurrences(normalize(body), t), 0);
  return { passage: excerptAround(body, terms, maxLength).replace(/\s+/g, " ").trim() || item.summary, score: 0, occurrences };
}
