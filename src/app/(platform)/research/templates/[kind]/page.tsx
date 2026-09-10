import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeCopy } from "@/components/docs/CodeCopy";
import { Callout, PageHeader } from "@/components/ui/primitives";
import { renderMarkdown } from "@/server/services/markdown";
import { getResearchTemplate } from "@/server/services/templates";
import { getViewer } from "@/server/services/viewer";

export async function generateMetadata({ params }: { params: Promise<{ kind: string }> }): Promise<Metadata> {
  const { kind } = await params;
  return { title: getResearchTemplate(kind)?.title ?? "Template" };
}

export default async function TemplatePage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const viewer = await getViewer();
  if (!viewer.has("knowledge.read")) notFound();
  const template = getResearchTemplate(kind);
  if (!template) notFound();
  const { html } = await renderMarkdown(template.body);
  return (
    <>
      <PageHeader eyebrow="Research template" title={template.title} description={template.summary} />
      <Callout tone="info" title="How to use this template">Copy the markdown below into a new research record (content/registry/research). Fill every section — write “unknown” rather than leaving it blank — and link the CROS ids so the research stays connected to evaluation, R&amp;D, capability, experiment, evidence and decision records.</Callout>
      <div className="cb-doc-layout" style={{ marginTop: 20 }}>
        <article id="template-body" className="cb-prose" dangerouslySetInnerHTML={{ __html: html }} />
        <aside>
          <div className="cb-card cb-aside-card">
            <h3>Raw markdown</h3>
            <div id="template-raw" className="codeblock" data-lang="markdown">
              <pre style={{ maxHeight: 420 }}><code>{template.body}</code></pre>
            </div>
          </div>
        </aside>
      </div>
      <CodeCopy containerId="template-raw" />
    </>
  );
}
