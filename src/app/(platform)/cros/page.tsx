import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";
import { MATURITY_MODEL } from "@/domain";
import { MaturityLadder } from "@/components/cros/MaturityLadder";
import { Badge } from "@/components/ui/Badge";
import { Callout, EmptyState, ItemList, ItemRow, Section, Stat } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { portfolioSummary } from "@/server/services/cros";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "CROS" };

export default async function CrosOverview() {
  const viewer = await getViewer();
  const repos = getRepositories();
  const summary = portfolioSummary(repos);
  const projects = filterVisible(viewer.identity, "rnd-project", repos.cros.rndProjects());
  const capabilities = filterVisible(viewer.identity, "capability", repos.cros.capabilities());
  const maturityCounts = Object.fromEntries(summary.byMaturity.map((m) => [m.level, m.projects + m.capabilities]));
  return (
    <>
      <div className="cb-page-header">
        <div>
          <h1>CROS</h1>
          <p>
            <em>Given this idea, problem, technology, client need, or market signal — what should Cloudpoint do about it?</em> CROS is the governed path from idea to operational capability. CloudBase displays CROS read-only; CROS remains the source of truth.
          </p>
        </div>
        <div className="cb-page-actions">
          <Link className="cb-btn cb-btn--primary" href="/cros/copilot"><Bot /> Open CROS Copilot</Link>
          {viewer.has("rnd.submit") && <Link className="cb-btn" href="/cros/ideas/new">Submit an idea</Link>}
        </div>
      </div>
      <div className="cb-stats">
        <Stat value={summary.counts.projects} label="R&D projects" />
        <Stat value={summary.counts.capabilities} label="Capabilities" />
        <Stat value={summary.counts.clusters} label="Capability clusters" />
        <Stat value={summary.counts.ideas} label="Ideas" />
        <Stat value={summary.counts.evaluations} label="Evaluations" />
        <Stat value={summary.counts.evidence} label="Evidence records" />
        <Stat value={summary.counts.decisions} label="Decisions" />
      </div>
      <Section title="Maturity model" action={{ label: "How maturity is assigned", href: "/docs/cros-maturity-model" }}>
        <MaturityLadder counts={maturityCounts} />
        {(summary.unassessed.projects > 0 || summary.unassessed.capabilities > 0) && (
          <p className="cb-subtle cb-small" style={{ marginTop: 10 }}>
            {summary.unassessed.projects} project{summary.unassessed.projects === 1 ? "" : "s"} and {summary.unassessed.capabilities} capabilit{summary.unassessed.capabilities === 1 ? "y" : "ies"} have no governed maturity yet. Maturity is assigned by a CROS decision after evaluation — never inferred.
          </p>
        )}
      </Section>
      <div className="cb-grid cb-grid--2" style={{ marginTop: 36, gap: 32 }}>
        <Section title="R&D projects" action={{ label: "All projects", href: "/cros/projects" }}>
          {projects.length ? (
            <ItemList>
              {projects.map((p) => (
                <ItemRow key={p.id} href={urlFor({ type: "rnd-project", id: p.id })} title={p.title} subtitle={p.summary} status={p.status} meta={<><span className="cb-mono">{p.code}</span>{p.maturity && <Badge tone="violet">{p.maturity} {MATURITY_MODEL[p.maturity].label}</Badge>}</>} />
              ))}
            </ItemList>
          ) : (
            <EmptyState title="No R&D projects registered" />
          )}
        </Section>
        <Section title="Capabilities" action={{ label: "Capability library", href: "/capabilities" }}>
          {capabilities.length ? (
            <ItemList>
              {capabilities.map((c) => (
                <ItemRow key={c.id} href={urlFor({ type: "capability", id: c.id })} title={c.title} subtitle={c.description || c.summary} meta={<><span className="cb-mono">{c.code}</span>{c.maturity ? <Badge tone="violet">{c.maturity}</Badge> : <Badge tone="outline">maturity not assessed</Badge>}</>} />
              ))}
            </ItemList>
          ) : (
            <EmptyState title="No capabilities registered" />
          )}
        </Section>
      </div>
      <Section title="Governance">
        <Callout tone="neutral" title="Read-only integration">
          CloudBase reads the CROS registry ({summary.source}). Ideas, evaluations, evidence approvals, decisions and maturity changes happen through CROS workflows with human approval. The future write path — human idea → CROS Copilot draft → human confirmation → submission → evaluation → evidence → approval → decision → maturity — is designed but not enabled. <Link href="/docs/cros-maturity-model" style={{ fontWeight: 600 }}>Maturity model <ArrowRight size={12} /></Link>
        </Callout>
      </Section>
    </>
  );
}
