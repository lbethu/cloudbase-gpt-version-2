import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";
import { MATURITY_MODEL } from "@/domain";
import { Badge } from "@/components/ui/Badge";
import { Callout, EmptyState, ItemList, ItemRow, PageHeader, Section } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "Capability Library" };

export default async function CapabilitiesPage({ searchParams }: { searchParams: Promise<{ maturity?: string; team?: string }> }) {
  const viewer = await getViewer();
  if (!viewer.has("capability.read")) return <Callout tone="warning" title="Not authorized">Capabilities require capability.read.</Callout>;
  const { maturity, team } = await searchParams;
  const repos = getRepositories();
  const all = filterVisible(viewer.identity, "capability", repos.cros.capabilities());
  const list = all.filter((c) => !maturity || c.maturity === maturity).filter((c) => !team || c.owningTeam === team || c.teams.includes(team));
  const clusters = filterVisible(viewer.identity, "capability-cluster", repos.cros.clusters());
  return (
    <>
      <PageHeader eyebrow="Intelligence" title="Capability Library" description="What Cloudpoint can reliably reuse — separate from project history." actions={<Link className="cb-btn" href="/capabilities/clusters">Capability clusters</Link>} />
      <div className="cb-grid cb-grid--2" style={{ marginBottom: 20 }}>
        <div className="cb-card cb-card--pad"><span className="cb-eyebrow">Project</span><p style={{ marginTop: 4 }}><b>= what Cloudpoint investigated.</b> Time-bound, may succeed or fail, produces evidence.</p></div>
        <div className="cb-card cb-card--pad"><span className="cb-eyebrow">Capability</span><p style={{ marginTop: 4 }}><b>= what Cloudpoint can reliably reuse.</b> Has an owner, maturity, limitations, SOPs and evidence.</p></div>
      </div>
      <div className="cb-chip-row" style={{ marginBottom: 18 }}>
        <Link className="cb-chip" aria-pressed={!maturity} href="/capabilities">All ({all.length})</Link>
        {(Object.keys(MATURITY_MODEL) as Array<keyof typeof MATURITY_MODEL>).map((m) => <Link key={m} className="cb-chip" aria-pressed={maturity === m} href={`/capabilities?maturity=${m}`}>{m} {MATURITY_MODEL[m].label}</Link>)}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={<Layers size={18} />} title={all.length ? "No capabilities match this filter" : "No capabilities registered"} description={maturity ? `No capability has a governed maturity of ${maturity}. Maturity is assigned through CROS evaluation and decision.` : "Capabilities are registered in CROS as R&D produces reusable results."} action={maturity ? { label: "Show all", href: "/capabilities" } : undefined} />
      ) : (
        <ItemList>
          {list.map((c) => (
            <ItemRow key={c.id} href={urlFor({ type: "capability", id: c.id })} title={c.title} type="capability" subtitle={c.description || c.summary || "Description pending — see the capability page for linked R&D and evidence."} meta={<><span className="cb-mono">{c.code}</span><span>{teamName(c.owningTeam)}</span>{c.maturity ? <Badge tone="violet">{c.maturity} {MATURITY_MODEL[c.maturity].label}</Badge> : <Badge tone="outline">maturity not assessed</Badge>}</>} />
          ))}
        </ItemList>
      )}
      <Section title="Clusters" action={{ label: "All clusters", href: "/capabilities/clusters" }}>
        {clusters.length ? (
          <div className="cb-grid cb-grid--3">
            {clusters.map((cl) => (
              <Link key={cl.id} href={urlFor({ type: "capability-cluster", id: cl.id })} className="cb-card cb-card--link cb-domain-card" style={{ minHeight: 0 }}><span className="cb-mono cb-subtle">{cl.code}</span><strong>{cl.title}</strong><p>{cl.description}</p></Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No clusters defined" />
        )}
      </Section>
    </>
  );
}
