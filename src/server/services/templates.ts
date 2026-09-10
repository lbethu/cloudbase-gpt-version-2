import "server-only";
import path from "node:path";
import { getConfig } from "@/server/config";
import { loadMarkdownDir } from "@/server/repositories/registry";

export interface ResearchTemplate {
  kind: string;
  title: string;
  summary: string;
  body: string;
}

/** Research/document templates authored as markdown under content/templates/research. */
export function listResearchTemplates(): ResearchTemplate[] {
  return loadMarkdownDir(path.join(getConfig().contentDir, "templates", "research"))
    .map((r) => ({ kind: r.slug, title: String(r.frontmatter.title ?? r.slug), summary: String(r.frontmatter.summary ?? ""), body: r.body }))
    .sort((a, b) => Number(a.body.length > 0) - Number(b.body.length > 0) || a.title.localeCompare(b.title));
}

export function getResearchTemplate(kind: string): ResearchTemplate | undefined {
  if (!/^[a-z0-9-]+$/.test(kind)) return undefined;
  return listResearchTemplates().find((t) => t.kind === kind);
}
