import type { Metadata } from "next";
import { AskCloudBase } from "@/components/ask/AskCloudBase";
import { Callout, PageHeader } from "@/components/ui/primitives";
import { getAiProvider } from "@/server/ai/adapters";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Ask CloudBase" };

export default async function AskPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const viewer = await getViewer();
  const { q } = await searchParams;
  if (!viewer.has("ask.use")) {
    return (
      <>
        <PageHeader eyebrow="Ask CloudBase" title="Ask CloudBase" />
        <Callout tone="warning" title="Not authorized">Your role does not include ask.use.</Callout>
      </>
    );
  }
  let provider = { enabled: false, provider: "disabled" };
  try {
    const p = getAiProvider();
    provider = { enabled: p.enabled, provider: p.name };
  } catch {
    provider = { enabled: false, provider: "misconfigured" };
  }
  return (
    <>
      <PageHeader eyebrow="Ask CloudBase" title="What does Cloudpoint know about this?" description="A source-backed answer from governed knowledge: the relevant SOP, documentation, project examples, capabilities and copilots — with citations, owners and versions." />
      <AskCloudBase initialQuestion={q?.slice(0, 500) ?? ""} aiMode={provider} />
    </>
  );
}
