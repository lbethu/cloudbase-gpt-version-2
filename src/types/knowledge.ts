export type DocumentStatus =
  | "Mock Prototype"
  | "Ready for Review"
  | "Replace with Real Data Later"
  | "Indexed Real SOP";

export type SourceKind = "mock" | "real";

export interface KnowledgeChunk {
  id: string;
  section: string;
  content: string;
  keywords: string[];
}

export interface KnowledgeSection {
  title: string;
  summary: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  type: string;
  category: string;
  ownerRole: string;
  lastUpdated: string;
  status: DocumentStatus;
  tags: string[];
  summary: string;
  sections: KnowledgeSection[];
  chunks: KnowledgeChunk[];
  companyId?: string;
  companyName?: string;
  sourceKind?: SourceKind;
  sourceFile?: string;
  sourceUrl?: string;
  sopNumber?: string;
  effectiveDate?: string;
  collection?: string;
  sourceGroup?: string;
  documentType?: string;
  audience?: string[];
  department?: string;
  reviewStatus?: string;
  confidentialityLevel?: string;
  relatedDocuments?: string[];
  exampleQuestions?: string[];
  replacementNote?: string;
  responsibleRole?: string;
  requiredInputs?: string[];
  expectedOutputs?: string[];
  commonMistakes?: string[];
  replacementPlan?: string;
}

export type AutomationStatus = "Prototype" | "Planned" | "Future";

export interface AIGuidanceModule {
  id: string;
  title: string;
  purpose: string;
  input: string;
  output: string;
  sourceGroups: string[];
  status: AutomationStatus;
  businessValue: string;
  primaryAudience: string;
}

export interface CompanyWorkspace {
  id: string;
  name: string;
  shortName: string;
  description: string;
  status: "Connected" | "Awaiting SOP package";
  accent: string;
}

export type Confidence = "High" | "Medium" | "Low";

export interface SearchResult {
  document: KnowledgeDocument;
  chunk: KnowledgeChunk;
  score: number;
  confidence: Confidence;
}

export interface KnowledgeAnswer {
  answer: string;
  results: SearchResult[];
  confidence: Confidence;
  nextStep: string;
  relatedDocuments?: KnowledgeDocument[];
  betterQuestions?: string[];
}
