import type { Metadata } from "next";
import Link from "next/link";
import { Workflow } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Callout, EmptyState, ItemList, ItemRow, PageHeader } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "AI Automations" };
const CATEGORIES = ["Sales", "GIS", "Operations", "R&D", "Knowledge", "Field", "Administration"];

export default async function AutomationsPage({ searchParams }: { searchParams: Promise<{ category?: string; status?: string }> }) {
  const viewer = await getViewer();
  if (!viewer.has("automation.read")) return <Callout tone="warning" title="Not authorized">The Automation library requires automation.read.</Callout>;
  const { category, status } = await searchParams;
  const all = filterVisible(viewer.identity, "automation", getRepositories().automations.list());
  const list = all.filter((a) => !category || a.category === category).filter((a) => !status || a.status === status);
  const approved = all.filter((a) => a.status === "approved").length;
  return (
    <>
      <PageHeader eyebrow="AI" title="AI Automation Library" description="Which automations already exist, how they work, what triggers them, which systems they touch and where humans review. Deterministic first; AI only where judgment is the bottleneck." actions={<><Link className="cb-btn cb-btn--primary" href="/automations/propose">Propose a New Automation</Link><Link className="cb-btn" href="/automations/standard">Engineering Standard</Link></>} />
      <div className="cb-stats" style={{ marginBottom: 20 }}>
        <div className="cb-card cb-stat"><strong>{all.length}</strong><span>automations registered</span></div>
        <div className="cb-card cb-stat"><strong>{approved}</strong><span>approved</span></div>
        <div className="cb-card cb-stat"><strong>{all.filter((a) => a.kind !== "deterministic").length}</strong><span>AI-assisted</span></div>
      </div>
      <div className="cb-chip-row" style={{ marginBottom: 18 }}>
        <Link className="cb-chip" aria-pressed={!category} href="/automations">All categories</Link>
        {CATEGORIES.map((c) => <Link key={c} className="cb-chip" aria-pressed={category === c} href={`/automations?category=${encodeURIComponent(c)}`}>{c}</Link>)}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={<Workflow size={18} />} title={all.length ? "No automations match this filter" : "No approved automations are registered yet"} description="Automations are registered with owner, trigger, inputs, workflow, systems, human-review points and success metric, then approved by an AI steward. Propose one to start." action={{ label: "Propose a New Automation", href: "/automations/propose" }} />
      ) : (
        <ItemList>{list.map((a) => <ItemRow key={a.id} href={urlFor({ type: "automation", id: a.id })} title={a.title} type="automation" status={a.status} subtitle={a.businessProblem || a.summary} meta={<><Badge tone="outline">{a.kind}</Badge><span>{a.category}</span><span>{teamName(a.owningTeam)}</span></>} />)}</ItemList>
      )}
    </>
  );
}
