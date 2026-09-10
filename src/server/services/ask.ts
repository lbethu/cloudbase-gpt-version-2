import "server-only";
import type { ContentType, KnowledgeItem } from "@/domain";
import type { Identity } from "@/server/auth/identity";
import { getAiProvider } from "@/server/ai/adapters";
import { getRepositories } from "@/server/repositories";
import { bestPassage, matchingPassages } from "./passages";
import { tokenize } from "@/server/search/lexical";
import { recordAudit } from "./audit";
import { askSystemPrompt, buildGovernedAnswer, latest, validateModelAnswer, type AskAnswer, type AskSource } from "./ask-core";
import { relatedTo } from "./relationships";
import { permittedItems, searchKnowledge } from "./search";

const GOVERNED_STATUSES = new Set(["approved", "published", "operational", "Approved", "Published"]);

export async function askCloudBase(identity: Identity, question: string): Promise<AskAnswer> {
  const q = question.trim().slice(0, 500);
  const trace: AskAnswer["trace"] = [];
  const t0 = Date.now();
  const permitted = permittedItems(identity);
  trace.push({ step: "Scope", detail: `${permitted.length} governed objects readable by ${identity.name || identity.email}`, ms: Date.now() - t0 });
  const t1 = Date.now();
  // Keyword queries ("sql", "bigtime invoice") mean "find this everywhere"; questions get the focused top-N.
  const keywordMode = tokenize(q).length <= 3 && !/\b(how|what|why|when|where|who|which|do|does|is|are|can|should)\b/i.test(q) && !q.includes("?");
  const { hits, provider: searchProvider } = await searchKnowledge(identity, { q, limit: keywordMode ? 25 : 8 });
  trace.push({ step: "Retrieve", detail: `${hits.length} ${keywordMode ? "documents mention this term" : "candidates"} — ranked by ${searchProvider} search${keywordMode ? " (find-everywhere mode)" : ""}`, ms: Date.now() - t1 });
  const byKey = new Map(permitted.map((i) => [`${i.ref.type}:${i.ref.id}`, i]));

  const sources: AskSource[] = hits.slice(0, keywordMode ? 25 : 6).map((hit, index) => {
    const full = byKey.get(`${hit.item.ref.type}:${hit.item.ref.id}`)!;
    const { passage, section, page, chunkId, occurrences } = bestPassage(getRepositories(), full, q);
    const more = keywordMode ? matchingPassages(getRepositories(), full, q, 4).filter((m) => m.chunkId !== chunkId) : [];
    return {
      passageUrl: chunkId ? `${hit.item.url}?chunk=${encodeURIComponent(chunkId)}` : hit.item.url,
      occurrences,
      morePassages: more.map((m) => ({ text: m.passage, section: m.section, page: m.page, url: m.chunkId ? `${hit.item.url}?chunk=${encodeURIComponent(m.chunkId)}` : undefined })),
      index,
      ref: hit.item.ref,
      title: hit.item.title,
      url: hit.item.url,
      status: hit.item.status,
      governed: GOVERNED_STATUSES.has(hit.item.status),
      passage,
      section: section ? (page && !/^page\b/i.test(section) ? `${section} (p. ${page})` : section) : undefined,
      updatedAt: hit.item.updatedAt,
      owningTeam: hit.item.owningTeam,
    };
  });

  // Related knowledge: other hits grouped by type + declared relationships of the top source.
  const related: AskAnswer["related"] = {};
  const push = (type: ContentType, entry: { ref: KnowledgeItem["ref"]; title: string; url: string; status: string }) => {
    const list = (related[type] ??= []);
    if (!list.some((e) => e.ref.id === entry.ref.id)) list.push(entry);
  };
  for (const hit of hits.slice(0, 12)) push(hit.item.ref.type, { ref: hit.item.ref, title: hit.item.title, url: hit.item.url, status: hit.item.status });
  if (sources[0]) {
    for (const group of relatedTo(getRepositories(), sources[0].ref, permitted)) {
      for (const e of group.entries) push(group.type, { ref: e.ref, title: e.title, url: e.url, status: e.status });
    }
  }

  trace.push({ step: "Locate passages", detail: `${sources.length} best-matching sections selected (${sources.filter((s) => s.governed).length} approved)` });
  const provider = getAiProvider();
  recordAudit({ actor: identity.subject, action: "ask.query", outcome: "allowed", detail: { length: q.length, sources: sources.length, provider: provider.name } });

  if (!provider.enabled || sources.length === 0) {
    const answer = buildGovernedAnswer(q, sources, related);
    if (keywordMode && sources.length) answer.notices.unshift(`“${q}” appears in ${sources.length} governed document${sources.length === 1 ? "" : "s"} you can read (${sources.reduce((n, s) => n + (s.occurrences ?? 0), 0)} occurrences). Every one is listed under Sources with the exact passages.`);
    trace.push({ step: "Compose", detail: sources.length ? `${answer.statements.length} extractive FACT statements with citations (AI disabled)` : "No supporting source — abstained (UNKNOWN)" });
    answer.trace = trace;
    return answer;
  }

  try {
    const sourceBlock = sources.map((s) => `[${s.index}] (${s.ref.type}${s.governed ? ", approved" : ", NOT yet approved"}) ${s.title}${s.section ? ` — ${s.section}` : ""}\n${s.passage}`).join("\n\n");
    const result = await provider.complete({
      json: true,
      messages: [
        { role: "system", content: askSystemPrompt() },
        { role: "user", content: `Question: ${q}\n\nSources:\n${sourceBlock}` },
      ],
    });
    const statements = validateModelAnswer(result.text, sources);
    trace.push({ step: "Synthesize", detail: `${result.provider}/${result.model} answered from ${sources.length} passages only` });
    if (!statements) {
      const fallback = buildGovernedAnswer(q, sources, related);
      fallback.notices.unshift("The AI response failed validation and was discarded; showing governed retrieval instead.");
      trace.push({ step: "Validate", detail: "Model output failed validation — discarded" });
      fallback.trace = trace;
      return fallback;
    }
    trace.push({ step: "Validate", detail: `${statements.filter((s) => s.kind === "FACT").length} FACT · ${statements.filter((s) => s.kind === "SUPPORTED_INFERENCE").length} inference · ${statements.filter((s) => s.kind === "ASSUMPTION").length} assumption` });
    const notices: string[] = [];
    if (sources.some((s) => !s.governed)) notices.push("One or more cited sources are not yet approved. Treat them as imported reference material until the owner confirms them.");
    return { question: q, mode: "ai-grounded", statements, sources, related, lastUpdated: latest(sources), notices, provider: `${result.provider}/${result.model}`, trace };
  } catch (error) {
    recordAudit({ actor: identity.subject, action: "ask.provider-error", outcome: "error", detail: { message: error instanceof Error ? error.message : "unknown" } });
    const fallback = buildGovernedAnswer(q, sources, related);
    fallback.notices.unshift("The AI provider was unavailable; showing governed retrieval instead.");
    trace.push({ step: "Fallback", detail: "Provider unavailable — governed retrieval" });
    fallback.trace = trace;
    return fallback;
  }
}
