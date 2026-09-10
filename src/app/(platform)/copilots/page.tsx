import type { Metadata } from "next";
import Link from "next/link";
import { Bot, ExternalLink } from "lucide-react";
import { COPILOT_STATUS_LABELS, type CopilotStatus } from "@/domain";
import { Badge, StatusBadge, TypeBadge } from "@/components/ui/Badge";
import { Callout, EmptyState, PageHeader, Section } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "AI Copilots" };
const ORDER: CopilotStatus[] = ["operational", "pilot", "prototype", "draft", "concept", "deprecated"];

export default async function CopilotsPage({ searchParams }: { searchParams: Promise<{ status?: string; team?: string }> }) {
  const viewer = await getViewer();
  if (!viewer.has("copilot.read")) return <Callout tone="warning" title="Not authorized">The Copilot registry requires copilot.read.</Callout>;
  const { status, team } = await searchParams;
  const all = filterVisible(viewer.identity, "copilot", getRepositories().copilots.list());
  const list = all.filter((c) => !status || c.status === status).filter((c) => !team || c.owningTeam === team || c.teams.includes(team)).sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || a.title.localeCompare(b.title));
  return (
    <>
      <PageHeader eyebrow="AI" title="Copilot Registry" description="The central catalog of Cloudpoint AI assistants: purpose, owner, authority boundaries, knowledge sources, status and limitations. A copilot is operational only after governed review — statuses here are not aspirational." actions={<><Link className="cb-btn cb-btn--primary" href="/copilots/create">How to create a Cloudpoint Copilot</Link><Link className="cb-btn" href="/copilots/standard">Engineering Standard</Link></>} />
      <div className="cb-chip-row" style={{ marginBottom: 18 }}>
        <Link className="cb-chip" aria-pressed={!status} href="/copilots">All ({all.length})</Link>
        {ORDER.map((s) => <Link key={s} className="cb-chip" aria-pressed={status === s} href={`/copilots?status=${s}`}>{COPILOT_STATUS_LABELS[s]} ({all.filter((c) => c.status === s).length})</Link>)}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={<Bot size={18} />} title={all.length ? "No copilots with this status" : "No copilots registered"} description="Copilots are registered by AI stewards following the Copilot Engineering Standard." />
      ) : (
        <div className="cb-grid cb-grid--3">
          {list.map((c) => (
            <article key={c.id} className="cb-card cb-domain-card">
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}><TypeBadge type="copilot" /><StatusBadge status={c.status} /><Badge tone="outline">v{c.version}</Badge></div>
              <strong><Link href={urlFor({ type: "copilot", id: c.id })}>{c.title}</Link></strong>
              <p>{c.purpose || c.description}</p>
              <div className="cb-subtle cb-small">{teamName(c.owningTeam)}{c.supportedUsers.length ? ` · for ${c.supportedUsers.slice(0, 2).join(", ")}` : ""}</div>
              <div style={{ display: "flex", gap: 8, marginTop: "auto", flexWrap: "wrap" }}>
                {c.accessUrl ? <a className="cb-btn cb-btn--sm cb-btn--primary" href={c.accessUrl} target="_blank" rel="noopener noreferrer"><ExternalLink /> Open Copilot</a> : <span className="cb-btn cb-btn--sm" aria-disabled="true" title="No approved deployment link configured">Open Copilot — not configured</span>}
                <Link className="cb-btn cb-btn--sm" href={urlFor({ type: "copilot", id: c.id })}>Documentation</Link>
              </div>
            </article>
          ))}
        </div>
      )}
      <Section title="Governance">
        <Callout tone="neutral" title="Copilot answers are not official policy">Every copilot points back to the governed SOP or record. Access links appear only after an AI steward records an approved deployment; none are fabricated.</Callout>
      </Section>
    </>
  );
}
