import type { ContentType, KnowledgeItem } from "@/domain";
import { refKey } from "@/domain";
import type { Repositories } from "@/server/repositories/interfaces";

/** Knowledge graph projection: permission-scoped nodes + declared/implicit edges. Pure. */
export interface GraphNode {
  id: string;
  type: ContentType;
  label: string;
  url: string;
  team: string;
  status: string;
  degree: number;
}
export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  confidence: "declared" | "proposed" | "implicit";
}

export function buildGraph(repos: Repositories, index: KnowledgeItem[], options: { types?: ContentType[]; includeTeams?: boolean; focus?: string; depth?: number } = {}): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const allowed = new Set(index.map((i) => refKey(i.ref)));
  const nodesMap = new Map<string, GraphNode>();
  for (const item of index) {
    if (options.types?.length && !options.types.includes(item.ref.type)) continue;
    if (item.ref.type === "team" && options.includeTeams === false) continue;
    nodesMap.set(refKey(item.ref), { id: refKey(item.ref), type: item.ref.type, label: item.title, url: item.url, team: item.owningTeam, status: item.status, degree: 0 });
  }
  const edges: GraphEdge[] = [];
  for (const r of repos.relationships.list()) {
    const a = refKey(r.from);
    const b = refKey(r.to);
    if (!allowed.has(a) || !allowed.has(b) || !nodesMap.has(a) || !nodesMap.has(b)) continue;
    edges.push({ source: a, target: b, type: r.type, confidence: r.confidence });
  }
  if (options.includeTeams !== false) {
    for (const item of index) {
      const key = refKey(item.ref);
      if (item.ref.type === "team" || !nodesMap.has(key)) continue;
      const teamKey = `team:${item.owningTeam}`;
      if (nodesMap.has(teamKey)) edges.push({ source: key, target: teamKey, type: "owned-by", confidence: "implicit" });
    }
  }
  let nodes = [...nodesMap.values()];
  if (options.focus && nodesMap.has(options.focus)) {
    const depth = options.depth ?? 2;
    const keep = new Set<string>([options.focus]);
    let frontier = [options.focus];
    for (let d = 0; d < depth; d++) {
      const next: string[] = [];
      for (const e of edges) {
        if (frontier.includes(e.source) && !keep.has(e.target)) { keep.add(e.target); next.push(e.target); }
        if (frontier.includes(e.target) && !keep.has(e.source)) { keep.add(e.source); next.push(e.source); }
      }
      frontier = next;
    }
    nodes = nodes.filter((n) => keep.has(n.id));
  }
  const keep = new Set(nodes.map((n) => n.id));
  const kept = edges.filter((e) => keep.has(e.source) && keep.has(e.target));
  for (const e of kept) {
    nodesMap.get(e.source)!.degree++;
    nodesMap.get(e.target)!.degree++;
  }
  return { nodes, edges: kept };
}
