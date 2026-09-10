import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Callout, EmptyState, ItemList, ItemRow, PageHeader } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "Project References" };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ q?: string; serviceLine?: string; status?: string }> }) {
  const viewer = await getViewer();
  if (!viewer.has("knowledge.read")) return <Callout tone="warning" title="Not authorized">Project references require knowledge.read.</Callout>;
  const { q = "", serviceLine = "", status = "" } = await searchParams;
  const repos = getRepositories();
  const all = filterVisible(viewer.identity, "project-reference", repos.projectReferences.list());
  const list = all.filter((p) => !serviceLine || p.serviceLine === serviceLine).filter((p) => !status || p.status === status).filter((p) => !q || `${p.title} ${p.client} ${p.location} ${p.technologies.join(" ")}`.toLowerCase().includes(q.toLowerCase()));
  const serviceLines = [...new Set(all.map((p) => p.serviceLine).filter(Boolean))];
  const sop223 = repos.sops.get("sop-223");
  return (
    <>
      <PageHeader eyebrow="Intelligence" title="Project Reference Library" description="Cloudpoint's reusable experience for proposals, sales, leadership, project managers and technical teams. References with approved client-facing wording can be used in proposals." actions={<><Link className="cb-btn" href="/projects/assistant">Project Reference Assistant</Link>{sop223 && <Link className="cb-btn" href={urlFor({ type: "sop", id: sop223.id })}>SOP 223 — creating references</Link>}</>} />
      <form className="cb-toolbar" method="get">
        <input className="cb-input cb-search-input" type="search" name="q" defaultValue={q} placeholder="Filter by name, client, location or technology…" aria-label="Filter project references" />
        <select className="cb-select" name="serviceLine" defaultValue={serviceLine} aria-label="Service line"><option value="">All service lines</option>{serviceLines.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <select className="cb-select" name="status" defaultValue={status} aria-label="Status"><option value="">Any status</option>{["draft", "review", "published", "archived"].map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <button className="cb-btn" type="submit">Apply</button>
      </form>
      {list.length === 0 ? (
        <EmptyState icon={<Briefcase size={18} />} title={all.length ? "No project references match these filters" : "No project references are registered yet"} description={all.length ? "Try clearing a filter." : "Project references are created following SOP 223 and stored as governed records with client, dates, outcomes and approved wording. None are fabricated."} action={all.length ? { label: "Clear filters", href: "/projects" } : undefined} />
      ) : (
        <ItemList>
          {list.map((p) => (
            <ItemRow key={p.id} href={urlFor({ type: "project-reference", id: p.id })} title={p.title} type="project-reference" status={p.status} subtitle={[p.client, p.location, p.serviceLine].filter(Boolean).join(" · ")} meta={<><span>{teamName(p.owningTeam)}</span>{p.approvedClientFacingWording && <span className="cb-badge cb-badge--success">approved wording</span>}</>} />
          ))}
        </ItemList>
      )}
    </>
  );
}
