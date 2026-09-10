import type { ImportedContent, KnowledgeItem } from "@/domain";
import type { Repositories } from "@/server/repositories/interfaces";
import { countOccurrences, normalize, tokenize } from "@/server/search/lexical";

export interface PassageMatch {
  passage: string;
  section?: string;
  page?: number;
  chunkId?: string;
  score: number;
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
      if (!best || score > best.score) best = { passage: chunk.content.slice(0, maxLength), section: chunk.section, page: chunk.page, chunkId: chunk.id, score };
    }
    if (best) return best;
  }
  const body = item.body || item.summary;
  const lower = body.toLowerCase();
  const at = terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, lower.lastIndexOf("\n", at) + 1);
  return { passage: body.slice(start, start + maxLength).replace(/\s+/g, " ").trim() || item.summary, score: 0 };
}
