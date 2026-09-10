import type { Metadata } from "next";
import Link from "next/link";
import { FileCode2 } from "lucide-react";
import { Callout, EmptyState, ItemList, ItemRow, PageHeader } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Documentation" };

const DOMAINS = ["ArcGIS", "Experience Builder", "Python", "GeoAI", "AI Engineering", "Automation", "CloudBase", "CROS", "Reality Capture", "360 Imagery", "LiDAR", "Data Engineering", "DevOps", "Security", "RFP"];

export default async function DocsPage({ searchParams }: { searchParams: Promise<{ domain?: string; status?: string }> }) {
  const viewer = await getViewer();
  if (!viewer.has("knowledge.read")) return <Callout tone="warning" title="Not authorized">Your role does not include knowledge.read.</Callout>;
  const { domain, status } = await searchParams;
  const all = filterVisible(viewer.identity, "documentation", getRepositories().docs.list());
  const docs = all.filter((d) => !domain || d.domain === domain).filter((d) => !status || d.status === status).sort((a, b) => a.domain.localeCompare(b.domain) || a.title.localeCompare(b.title));
  const domains = [...new Set([...DOMAINS, ...all.map((d) => d.domain)])];
  const countFor = (d: string) => all.filter((x) => x.domain === d).length;
  return (
    <>
      <PageHeader eyebrow="Knowledge" title="Documentation / How-To" description="Internal technical documentation: how Cloudpoint builds things, with runnable examples. Published documents have passed review; drafts are visible but not yet authoritative." />
      <div className="cb-chip-row" style={{ marginBottom: 18 }}>
        <Link className="cb-chip" aria-pressed={!domain} href="/docs">All domains ({all.length})</Link>
        {domains.map((d) => (
          <Link key={d} className="cb-chip" aria-pressed={domain === d} href={`/docs?domain=${encodeURIComponent(d)}`}>
            {d} {countFor(d) ? `(${countFor(d)})` : ""}
          </Link>
        ))}
      </div>
      {docs.length === 0 ? (
        <EmptyState icon={<FileCode2 size={18} />} title={domain ? `No governed documentation has been published in ${domain}` : "No documentation published yet"} description="Documentation is authored as markdown with frontmatter under content/docs and reviewed before publication." action={domain ? { label: "All domains", href: "/docs" } : undefined} />
      ) : (
        <ItemList>
          {docs.map((d) => (
            <ItemRow key={d.id} href={`/docs/${d.slug}`} title={d.title} type="documentation" status={d.status} subtitle={d.summary} meta={<><span>{d.domain}</span><span>{teamName(d.owningTeam)}</span><span>v{d.version}</span></>} />
          ))}
        </ItemList>
      )}
    </>
  );
}
