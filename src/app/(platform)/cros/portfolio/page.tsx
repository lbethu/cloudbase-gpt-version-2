import type { Metadata } from "next";
import Link from "next/link";
import { MATURITY_MODEL } from "@/domain";
import { Badge } from "@/components/ui/Badge";
import { PageHeader, Section, Stat } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { portfolioSummary } from "@/server/services/cros";
import { relatedTo } from "@/server/services/relationships";
import { permittedItems } from "@/server/services/search";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "R&D Portfolio" };

export default async function PortfolioPage() {
  const viewer = await getViewer();
  const repos = getRepositories();
  const summary = portfolioSummary(repos);
  const projects = filterVisible(viewer.identity, "rnd-project", repos.cros.rndProjects());
  const index = permittedItems(viewer.identity);
  return (
    <>
      <PageHeader title="Portfolio" description="Leadership view: what Cloudpoint is researching, what capabilities are emerging, which projects are stuck, and where evidence is missing." />
      <div className="cb-stats">
        {Object.entries(summary.byStatus).map(([status, n]) => <Stat key={status} value={n} label={`projects ${status}`} />)}
        <Stat value={summary.unassessed.projects} label="projects without governed maturity" />
        <Stat value={summary.counts.evidence} label="evidence records" />
      </div>
      <Section title="Projects by maturity">
        <div className="cb-table-wrap cb-card">
          <table className="cb-table">
            <thead><tr><th>Level</th><th>Stage</th><th>Projects</th><th>Capabilities</th></tr></thead>
            <tbody>
              {summary.byMaturity.map((m) => (
                <tr key={m.level}><td className="cb-mono">{m.level}</td><td>{m.label}</td><td>{m.projects}</td><td>{m.capabilities}</td></tr>
              ))}
              <tr><td className="cb-mono">—</td><td>Not assessed</td><td>{summary.unassessed.projects}</td><td>{summary.unassessed.capabilities}</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="Project → capability → cluster">
        <div className="cb-card">
          {projects.map((p) => {
            const rel = relatedTo(repos, { type: "rnd-project", id: p.id }, index);
            const caps = rel.find((g) => g.type === "capability")?.entries ?? [];
            return (
              <div key={p.id} className="cb-item-row" style={{ gridTemplateColumns: "1fr" }}>
                <div className="cb-rel-chain">
                  <Link href={urlFor({ type: "rnd-project", id: p.id })} style={{ fontWeight: 600 }}>{p.code} {p.title}</Link>
                  {p.maturity ? <Badge tone="violet">{p.maturity} {MATURITY_MODEL[p.maturity].label}</Badge> : <Badge tone="outline">not assessed</Badge>}
                  {caps.length === 0 && <span className="cb-subtle">→ no capability linked</span>}
                  {caps.map((c) => {
                    const clusters = relatedTo(repos, c.ref, index).find((g) => g.type === "capability-cluster")?.entries ?? [];
                    return (
                      <span key={c.ref.id} className="cb-rel-chain">
                        <span className="cb-arrow">→</span>
                        <Link href={c.url}>{c.title}</Link>
                        {c.confidence === "proposed" && <Badge tone="outline">proposed</Badge>}
                        {clusters.map((cl) => (
                          <span key={cl.ref.id} className="cb-rel-chain"><span className="cb-arrow">→</span><Link href={cl.url}>{cl.title}</Link></span>
                        ))}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
