import type { Metadata } from "next";
import { KnowledgeGraph } from "@/components/graph/KnowledgeGraph";
import { Callout, PageHeader } from "@/components/ui/primitives";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Knowledge Graph" };

export default async function GraphPage({ searchParams }: { searchParams: Promise<{ focus?: string; confidence?: string }> }) {
  const viewer = await getViewer();
  const { focus, confidence } = await searchParams;
  if (!viewer.has("knowledge.read")) return <Callout tone="warning" title="Not authorized">The knowledge graph requires knowledge.read.</Callout>;
  return (
    <>
      <PageHeader eyebrow="Intelligence" title="Knowledge Graph" description="Everything connected: SOPs, documentation, R&D, capabilities, clusters, copilots, automations, project references, opportunities and the teams that own them. Drag to arrange, scroll to zoom, click a node to open it or focus its neighbourhood." />
      <KnowledgeGraph initialFocus={focus} initialConfidence={confidence} />
    </>
  );
}
