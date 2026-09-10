import type { ContentRef, ContentType, KnowledgeItem, Relationship, RelationshipType } from "@/domain";
import { RELATIONSHIP_LABELS, refKey } from "@/domain";
import type { Repositories } from "@/server/repositories/interfaces";

/**
 * Relationship queries over the extensible relationship model. Pure functions
 * (repositories in, results out) so they are unit-testable and reusable by a
 * future graph/SQL implementation.
 */

export interface RelatedEntry {
  ref: ContentRef;
  title: string;
  url: string;
  status: string;
  direction: "outbound" | "inbound";
  type: RelationshipType;
  label: string;
  confidence: "declared" | "proposed";
  note: string;
}

export interface RelatedGroup {
  type: ContentType;
  entries: RelatedEntry[];
}

const inverseLabel = (type: RelationshipType): string => {
  switch (type) {
    case "creates":
      return "Created by";
    case "governs":
      return "Governed by";
    case "supports":
      return "Supported by";
    case "belongs-to":
      return "Contains";
    case "documents":
      return "Documented in";
    case "owned-by":
      return "Owns";
    case "produced-evidence-for":
      return "Evidence from";
    case "strengthens":
      return "Strengthened by";
    case "assists":
      return "Assisted by";
    case "uses-knowledge-source":
      return "Used as knowledge source by";
    case "evaluates":
      return "Evaluated by";
    case "supersedes":
      return "Superseded by";
    case "informs":
      return "Informed by";
    default:
      return RELATIONSHIP_LABELS[type];
  }
};

export function relatedTo(repos: Repositories, ref: ContentRef, index: KnowledgeItem[]): RelatedGroup[] {
  const byKey = new Map(index.map((i) => [refKey(i.ref), i]));
  const key = refKey(ref);
  const entries: RelatedEntry[] = [];
  for (const rel of repos.relationships.list()) {
    let other: ContentRef | null = null;
    let direction: RelatedEntry["direction"] = "outbound";
    if (refKey(rel.from) === key) other = rel.to;
    else if (refKey(rel.to) === key) {
      other = rel.from;
      direction = "inbound";
    }
    if (!other) continue;
    const item = byKey.get(refKey(other));
    if (!item) continue; // target not visible to this identity (or missing) — never leak titles
    entries.push({
      ref: other,
      title: item.title,
      url: item.url,
      status: item.status,
      direction,
      type: rel.type,
      label: direction === "outbound" ? RELATIONSHIP_LABELS[rel.type] : inverseLabel(rel.type),
      confidence: rel.confidence,
      note: rel.note,
    });
  }
  const groups = new Map<ContentType, RelatedEntry[]>();
  for (const e of entries) groups.set(e.ref.type, [...(groups.get(e.ref.type) ?? []), e]);
  return [...groups.entries()].map(([type, list]) => ({ type, entries: list.sort((a, b) => a.title.localeCompare(b.title)) }));
}

/** Integrity check used by tests and the admin page: every relationship endpoint must resolve. */
export function danglingRelationships(repos: Repositories, index: KnowledgeItem[]): Relationship[] {
  const known = new Set(index.map((i) => refKey(i.ref)));
  return repos.relationships.list().filter((r) => !known.has(refKey(r.from)) || !known.has(refKey(r.to)));
}
