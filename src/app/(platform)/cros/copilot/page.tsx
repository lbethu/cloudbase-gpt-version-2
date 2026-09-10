import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Callout, PageHeader, Section } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "CROS Copilot" };

export default async function CrosCopilotPage() {
  const viewer = await getViewer();
  const copilot = getRepositories().copilots.get("cros-copilot");
  const canOpen = viewer.has("copilot.read") && copilot?.accessUrl;
  return (
    <>
      <PageHeader title="CROS Copilot" description="R&D decision and research intelligence. Tell CROS Copilot about a new idea, problem, technology, client need or market signal, and it helps decide what Cloudpoint should investigate or do about it." actions={canOpen ? <a className="cb-btn cb-btn--primary" href={copilot!.accessUrl} target="_blank" rel="noopener noreferrer"><ExternalLink /> Open CROS Copilot</a> : <span className="cb-btn" aria-disabled="true">Open CROS Copilot — link not configured</span>} />
      {copilot && <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 18 }}><StatusBadge status={copilot.status} /><Badge tone="outline">v{copilot.version}</Badge><Link href={`/copilots/${copilot.id}`} className="cb-small" style={{ fontWeight: 600 }}>Registry entry <ArrowRight size={12} /></Link></div>}
      {!canOpen && <Callout tone="info" title="Prototype entry point">The CROS Copilot prototype runs outside CloudBase today. Its access link is configured by an AI steward in the registry once the deployment is approved; the button above activates automatically. The UI is architected so the copilot can later run natively here through the provider-neutral AI layer.</Callout>}
      <div className="cb-grid cb-grid--2" style={{ marginTop: 24 }}>
        <Section title="CROS Copilot helps leadership and technical teams">
          <ul className="cb-card cb-card--pad" style={{ margin: 0, paddingLeft: 36, display: "grid", gap: 8 }}>
            <li>evaluate new ideas</li><li>search internal reuse before building</li><li>research industry context</li><li>analyze GIS / Esri alignment</li><li>identify evidence gaps</li><li>plan experiments</li><li>recommend next actions</li>
          </ul>
        </Section>
        <Section title="Ask CloudBase vs. CROS Copilot">
          <div className="cb-card cb-card--pad">
            <p><b>Ask CloudBase</b> — “Tell me what the organization knows.” Source-backed answers from governed knowledge.</p>
            <p style={{ marginTop: 10 }}><b>CROS Copilot</b> — “Tell me what we should investigate or do about this new idea.” Advisory; drafts intake for human confirmation.</p>
            <p className="cb-muted cb-small" style={{ marginTop: 12 }}>Neither creates CROS records. Future governed flow: human idea → CROS Copilot → draft intake → human confirms → backend submission → evaluation → research → evidence candidate → human approval → governed evidence → decision → maturity → capability.</p>
          </div>
        </Section>
      </div>
    </>
  );
}
