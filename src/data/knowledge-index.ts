import { richMockDocuments } from "@/data/rich-mock";
import { sopKnowledgeDocuments } from "@/data/sop-knowledge-base";

// CloudBase AI currently indexes both the fictional prototype foundation and
// the imported real SOP navigator layer from source-documents.
export const allKnowledgeDocuments = [...richMockDocuments, ...sopKnowledgeDocuments];
