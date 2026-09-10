import { allKnowledgeDocuments } from "@/legacy/data/knowledge-index";
import {
  Confidence,
  KnowledgeAnswer,
  KnowledgeDocument,
  KnowledgeChunk,
  SearchResult,
} from "@/legacy/types";

const stopWords = new Set([
  "a", "an", "and", "are", "be", "before", "do", "for", "how", "i", "in",
  "is", "it", "me", "my", "need", "of", "on", "or", "should", "the", "to",
  "what", "when", "where", "who", "with",
]);

const semanticConcepts: Record<string, string[]> = {
  field_readiness: [
    "beginning field activity",
    "before field activity",
    "before field work",
    "before going onsite",
    "field work",
    "field activity",
    "going onsite",
    "onsite",
    "on site",
    "site readiness",
    "work conditions",
    "required equipment",
    "safety expectations",
    "escalation procedures",
    "hazard awareness",
    "check before field",
    "review before field",
  ],
  field_safety: [
    "field safety",
    "safety checklist",
    "safety guide",
    "site safety",
    "jobsite",
    "hazard",
    "ppe",
    "protective equipment",
    "crew readiness",
  ],
  pm_pl_responsibility: [
    "project lead",
    "project manager",
    "pm",
    "pl",
    "project responsibilities",
    "manage project responsibilities",
    "delivery ownership",
    "coordination expectations",
    "kickoff preparation",
    "handoff responsibilities",
  ],
  sales_process: [
    "sales process",
    "sales playbook",
    "opportunity",
    "discovery",
    "qualification",
    "proposal",
    "quote",
    "customer communication",
    "handoff to delivery",
  ],
  lead_qualification: [
    "lead qualification",
    "inbound lead",
    "qualify leads",
    "pipedrive",
    "prospect",
    "sales lead",
  ],
  proposal_quote: [
    "proposal",
    "quote",
    "pandadoc",
    "creating and sending proposals",
    "proposal requirements",
    "closing a won deal",
  ],
  finance_payment: [
    "invoice",
    "invoicing",
    "payment",
    "past due",
    "accounts payable",
    "vendor invoice",
    "bank accounts",
    "credit cards",
    "employee expenses",
  ],
  marketing_approval: [
    "marketing content",
    "approval",
    "review approval",
    "brand",
    "website pages",
    "blog posts",
    "social media",
    "newsletter",
    "webinar",
    "campaign",
  ],
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9%/]+/g, " ")
    .trim();

const tokenize = (value: string) =>
  normalize(value)
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopWords.has(token));

const compact = (value: string) => normalize(value).replace(/\s+/g, "");

const unique = <T,>(items: T[]) => [...new Set(items)];

const documentSearchText = (document: KnowledgeDocument, chunk: KnowledgeChunk) =>
  [
    document.title,
    document.type,
    document.category,
    document.ownerRole,
    document.companyName,
    document.sourceGroup,
    document.department,
    document.sourceFile,
    document.sopNumber,
    document.summary,
    ...(document.tags || []),
    ...(document.audience || []),
    ...(document.exampleQuestions || []),
    chunk.section,
    chunk.content,
    ...(chunk.keywords || []),
  ]
    .filter(Boolean)
    .join(" ");

const expandedQueryTerms = (query: string) => {
  const normalized = normalize(query);
  const queryTokens = tokenize(query);
  const matchedConceptTerms = Object.values(semanticConcepts).flatMap((terms) => {
    const conceptMatched = terms.some((term) => {
      const normalizedTerm = normalize(term);
      return (
        normalized.includes(normalizedTerm) ||
        normalizedTerm.split(" ").some((piece) => piece.length > 3 && queryTokens.includes(piece))
      );
    });
    return conceptMatched ? terms : [];
  });

  return unique([
    ...queryTokens,
    ...matchedConceptTerms.flatMap(tokenize),
  ]);
};

const phraseBonus = (query: string, text: string, weight: number) => {
  const normalizedQuery = normalize(query);
  const normalizedText = normalize(text);
  const compactQuery = compact(query);
  const compactText = compact(text);
  return normalizedQuery.length > 3 && (normalizedText.includes(normalizedQuery) || compactText.includes(compactQuery))
    ? weight
    : 0;
};

const confidenceFor = (score: number): Confidence => {
  if (score >= 26) return "High";
  if (score >= 11) return "Medium";
  return "Low";
};

interface SearchOptions {
  companyId?: string;
  sourceKind?: "real" | "mock";
  limit?: number;
}

const documentMatchesConcept = (document: KnowledgeDocument, pattern: RegExp) =>
  pattern.test(`${document.id} ${document.title} ${document.category} ${document.sourceGroup} ${document.sourceFile}`);

export function searchKnowledgeBase(
  query: string,
  options: SearchOptions = {},
): SearchResult[] {
  const { companyId, sourceKind, limit = 5 } = options;
  const tokens = tokenize(query);
  const expandedTokens = expandedQueryTerms(query);
  const normalizedQuery = normalize(query);
  if (!tokens.length) return [];

  const indexedDocuments = allKnowledgeDocuments.filter(
    (document) =>
      (!companyId || companyId === "all" || document.companyId === companyId) &&
      (!sourceKind || document.sourceKind === sourceKind),
  );

  const scoredResults = indexedDocuments
    .flatMap((document) =>
      document.chunks.map((chunk) => {
        const title = normalize(document.title);
        const category = normalize(document.category);
        const tags = normalize(document.tags.join(" "));
        const section = normalize(chunk.section);
        const content = normalize(chunk.content);
        const keywords = normalize(chunk.keywords.join(" "));
        const company = normalize(document.companyName || "");
        const sourceGroup = normalize(document.sourceGroup || "");
        const sourceFile = normalize(document.sourceFile || "");
        const documentType = normalize(document.documentType || document.type);
        const audience = normalize((document.audience || []).join(" "));
        const department = normalize(document.department || "");
        const exampleQuestions = normalize((document.exampleQuestions || []).join(" "));
        const searchableRaw = documentSearchText(document, chunk);
        const searchable = normalize(searchableRaw);
        const compactSearchable = compact(searchableRaw);

        let score = 0;
        for (const token of tokens) {
          if (content.includes(token)) score += 4;
          if (keywords.includes(token)) score += 4;
          if (section.includes(token)) score += 5;
          if (title.includes(token)) score += 5;
          if (category.includes(token)) score += 4;
          if (tags.includes(token)) score += 3;
          if (company.includes(token)) score += 2;
          if (sourceGroup.includes(token)) score += 5;
          if (sourceFile.includes(token)) score += 4;
          if (documentType.includes(token)) score += 2;
          if (audience.includes(token)) score += 3;
          if (department.includes(token)) score += 2;
          if (exampleQuestions.includes(token)) score += 4;
        }

        for (const token of expandedTokens) {
          if (searchable.includes(token)) score += 1.5;
          if (content.includes(token)) score += 1.5;
          if (title.includes(token)) score += 1.2;
          if (compactSearchable.includes(compact(token))) score += 0.8;
        }

        score += phraseBonus(query, chunk.content, 14);
        score += phraseBonus(query, chunk.section, 10);
        score += phraseBonus(query, document.title, 18);
        score += phraseBonus(query, document.sourceGroup || "", 12);
        score += phraseBonus(query, document.sourceFile || "", 10);
        score += phraseBonus(query, (document.exampleQuestions || []).join(" "), 12);

        // Hybrid semantic routing for the imported SOP corpus. This preserves
        // grounded chunk retrieval while handling normal employee phrasing such
        // as "going onsite" vs. "field activity".
        if (
          /(field|onsite|on site|site|jobsite|worksite|activity|equipment|readiness|safety|hazard|escalat)/.test(normalizedQuery) &&
          document.sourceKind === "real" &&
          document.category === "Field Safety"
        ) score += 20;
        if (
          /(check|review|confirm|verify|prepare|before|start|begin|going)/.test(normalizedQuery) &&
          document.id === "real-field-safety-checklist"
        ) score += 22;
        if (
          /(safety expectation|site readiness|work condition|required equipment|field activity|field work|going onsite|before field|before going)/.test(normalizedQuery) &&
          document.id === "real-field-safety-checklist"
        ) score += 26;
        if (
          /(project lead|project manager|pm|pl|responsibil|delivery ownership|coordination|kickoff|handoff)/.test(normalizedQuery) &&
          document.id === "real-project-manager-and-project-lead-overview"
        ) score += 26;
        if (
          /(sales process|sales|playbook|opportunity|discovery|qualification|proposal|customer communication|handoff to delivery)/.test(normalizedQuery) &&
          document.id === "real-cloudpoint-sales-playbook-processes-training-manual"
        ) score += 26;
        if (/(inbound lead|lead qualification|qualify lead|sales lead)/.test(normalizedQuery) && /lead qualification/i.test(document.title)) score += 22;
        if (/(proposal|quote|pandadoc|won deal)/.test(normalizedQuery) && /(proposal|quote|pandadoc|won deal)/i.test(document.title)) score += 20;
        if (/(marketing|approval|brand|content review)/.test(normalizedQuery) && document.category === "Marketing SOP") score += 16;
        if (/(invoice|payment|past due|accounts payable|expense|credit card|bank)/.test(normalizedQuery) && document.category === "Finance SOP") score += 16;

        if (/(qa\/qc|quality|check|validate|validation)/.test(normalizedQuery) && document.category === "QA/QC") score += 9;
        if (/(raw data|gis data|geospatial data|backup|version)/.test(normalizedQuery) && document.category === "Data Management") score += 7;
        if (/(folder|project setup|kickoff|project metadata)/.test(normalizedQuery) && document.category === "Project Setup") score += 7;
        if (/(sales|lead|discovery|proposal|rfp)/.test(normalizedQuery) && ["Sales", "Lead Qualification", "Proposals & Quotes"].includes(document.category)) score += 7;
        if (/(pm|pl|project manager|project lead|escalat)/.test(normalizedQuery) && document.category === "PM/PL Guidance") score += 6;
        if (/(com site|internal resource|where.*find|template)/.test(normalizedQuery) && document.category === "COM Site Reference") score += 7;
        if (/(campaign|marketing list|pipedrive activity)/.test(normalizedQuery) && document.category === "Campaign Management") score += 8;
        if (/(marketing content|approval tier|brand|publish|call to action|cta)/.test(normalizedQuery) && document.category === "Content Approval") score += 8;
        if (document.sourceKind === "real") score += 2;

        // Keep mock fallback available, but prioritize the real SOP corpus when
        // both real and mock records match the same employee question.
        if (document.sourceKind === "mock" && indexedDocuments.some((item) => item.sourceKind === "real")) score *= 0.72;

        return {
          document,
          chunk,
          score,
          confidence: confidenceFor(score),
        };
      }),
    )
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  const seenDocuments = new Set<string>();
  const results = scoredResults.filter((result) => {
    if (seenDocuments.has(result.document.id)) return false;
    seenDocuments.add(result.document.id);
    return true;
  }).slice(0, limit);

  if (process.env.NODE_ENV !== "production") {
    const chunkCount = indexedDocuments.reduce((count, document) => count + document.chunks.length, 0);
    console.info("[CloudBase retrieval]", {
      query,
      indexedDocuments: indexedDocuments.length,
      searchableChunks: chunkCount,
      retrievedChunkCandidates: scoredResults.slice(0, 10).map((result) => ({
        chunkId: result.chunk.id,
        documentTitle: result.document.title,
        sourceFile: result.document.sourceFile,
        score: Number(result.score.toFixed(2)),
      })),
      selectedDocuments: results.map((result) => ({
        documentId: result.document.id,
        chunkId: result.chunk.id,
        section: result.chunk.section,
      })),
    });
  }

  return results;
}

export function generateKnowledgeAnswer(
  query: string,
  options: SearchOptions = {},
): KnowledgeAnswer {
  const results = searchKnowledgeBase(query, options);

  if (!results.length) {
    return {
      answer:
        "I could not find this information in the currently indexed CloudBase AI knowledge sources.",
      results: [],
      confidence: "Low",
      nextStep:
        "Refine the question or browse the SOP Navigator to identify the closest governed process.",
      betterQuestions: [
        "Which team or role is performing the process?",
        "What project phase, system, or deliverable is involved?",
        "Are you looking for a checklist, approval rule, or source location?",
      ],
    };
  }

  const strongest = results[0];
  const supporting = results
    .slice(1, 4)
    .filter((result) => result.document.id !== strongest.document.id);
  const supportText = supporting.length
    ? ` Related indexed SOP content also appears in ${supporting
        .map((result) => `“${result.document.title}”`)
        .join(" and ")}.`
    : "";

  return {
    answer: `${strongest.chunk.content} Source: ${strongest.document.title}. Relevant section: ${strongest.chunk.section}.${supportText}`,
    results,
    confidence: strongest.confidence,
    nextStep:
      strongest.document.category === "QA/QC"
        ? "Open the cited QA/QC section, run the applicable checks, and record findings before release approval."
        : `Open “${strongest.document.title}” and review the cited section before applying the guidance.`,
    relatedDocuments: allKnowledgeDocuments.filter((document) =>
      (strongest.document.relatedDocuments || []).includes(document.id),
    ).slice(0, 3),
    betterQuestions:
      strongest.confidence === "Low"
        ? strongest.document.exampleQuestions?.slice(0, 3)
        : [],
  };
}

// Production extension point:
// Replace the transparent local semantic router with embeddings + hybrid vector
// search when a production database/model endpoint is approved. Preserve these
// metadata filters and access controls, and send only authorized top chunks to
// the approved language model for grounded answer synthesis.
