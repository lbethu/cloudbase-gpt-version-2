import { z } from "zod";
import type { ContentRef, ContentType } from "@/domain";
import { CONTENT_TYPE_LABELS } from "@/domain";

/**
 * Governance rules for Ask CloudBase, independent of any AI provider.
 *
 * Every statement in an answer is classified:
 *   FACT                — quoted/paraphrased from a cited governed source
 *   SUPPORTED_INFERENCE — follows from cited sources; the model connected them
 *   ASSUMPTION          — not in any source; must be labelled as such
 *   UNKNOWN             — no governed source supports an answer
 */

export const StatementKind = z.enum(["FACT", "SUPPORTED_INFERENCE", "ASSUMPTION", "UNKNOWN"]);
export type StatementKind = z.infer<typeof StatementKind>;

export interface AskSource {
  index: number;
  ref: ContentRef;
  title: string;
  url: string;
  status: string;
  /** Whether the source is an approved/published governed record. */
  governed: boolean;
  passage: string;
  section?: string;
  updatedAt?: string;
  owningTeam: string;
  /** Deep link to the matched passage on the object page. */
  passageUrl?: string;
  /** Additional passages that also mention the query (find-everywhere mode). */
  morePassages?: Array<{ text: string; section?: string; page?: number; url?: string }>;
  occurrences?: number;
}

export const AskStatement = z.object({
  text: z.string().min(1),
  kind: StatementKind,
  citations: z.array(z.number().int().nonnegative()).default([]),
});
export type AskStatement = z.infer<typeof AskStatement>;

export const ModelAnswer = z.object({ statements: z.array(AskStatement).min(1) });

export interface AskAnswer {
  question: string;
  mode: "governed-retrieval" | "ai-grounded";
  statements: AskStatement[];
  sources: AskSource[];
  related: Partial<Record<ContentType, Array<{ ref: ContentRef; title: string; url: string; status: string }>>>;
  lastUpdated?: string;
  notices: string[];
  provider?: string;
  /** Agent trace — the governed steps that produced this answer. */
  trace: Array<{ step: string; detail: string; ms?: number }>;
}

export const NO_SOURCE_MESSAGE = "No approved Cloudpoint knowledge currently supports a definitive answer.";

/** Deterministic answer built only from retrieved passages. Used when AI is disabled or fails validation. */
export function buildGovernedAnswer(question: string, sources: AskSource[], related: AskAnswer["related"]): AskAnswer {
  const notices: string[] = [];
  if (!sources.length) {
    return { question, mode: "governed-retrieval", statements: [{ text: NO_SOURCE_MESSAGE, kind: "UNKNOWN", citations: [] }], sources: [], related, notices, trace: [] };
  }
  const statements: AskStatement[] = sources.slice(0, 8).map((s) => ({
    text: `${CONTENT_TYPE_LABELS[s.ref.type]} “${s.title}”${s.section ? ` (${s.section})` : ""}: ${s.passage}`,
    kind: "FACT",
    citations: [s.index],
  }));
  if (sources.some((s) => !s.governed)) notices.push("One or more cited sources are not yet approved. Treat them as imported reference material until the owner confirms them.");
  notices.push("Governed retrieval mode: statements are extracted from cited sources without model synthesis.");
  return { question, mode: "governed-retrieval", statements, sources, related, lastUpdated: latest(sources), notices, trace: [] };
}

/** Validates a model answer against the sources it was given; drops unknown citations and forces labels. */
export function validateModelAnswer(raw: string, sources: AskSource[]): AskStatement[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
  const result = ModelAnswer.safeParse(parsed);
  if (!result.success) return null;
  const valid = new Set(sources.map((s) => s.index));
  return result.data.statements.map((s) => {
    const citations = s.citations.filter((c) => valid.has(c));
    // A "FACT" without a surviving citation is not a fact.
    const kind: StatementKind = s.kind === "FACT" && citations.length === 0 ? "ASSUMPTION" : s.kind;
    return { text: s.text, kind, citations };
  });
}

export function latest(sources: AskSource[]): string | undefined {
  return sources.map((s) => s.updatedAt).filter((d): d is string => !!d).sort().pop();
}

export function askSystemPrompt(): string {
  return [
    "You are Ask CloudBase, Cloudpoint Geospatial's internal knowledge assistant.",
    "Answer ONLY from the numbered sources provided. Never use outside knowledge for organizational claims (policies, procedures, projects, capabilities, ownership).",
    "Return strict JSON: {\"statements\":[{\"text\":string,\"kind\":\"FACT\"|\"SUPPORTED_INFERENCE\"|\"ASSUMPTION\"|\"UNKNOWN\",\"citations\":number[]}]}.",
    "FACT statements must cite at least one source index. Use SUPPORTED_INFERENCE when you connect sources. Use ASSUMPTION sparingly and say it is one.",
    `If the sources do not support an answer, return one UNKNOWN statement: "${NO_SOURCE_MESSAGE}"`,
    "Prefer approved SOPs, then documentation, then project examples, then copilots/tools, then known limitations.",
    "Do not invent URLs, owners, dates, metrics or version numbers.",
  ].join("\n");
}
