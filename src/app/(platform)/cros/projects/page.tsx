import type { Metadata } from "next";
import { MATURITY_MODEL } from "@/domain";
import { CrosCollection } from "@/components/cros/CrosCollection";
import { Badge } from "@/components/ui/Badge";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "R&D Projects" };

export default async function RndProjectsPage() {
  const viewer = await getViewer();
  const items = filterVisible(viewer.identity, "rnd-project", getRepositories().cros.rndProjects());
  return <CrosCollection type="rnd-project" title="R&D Projects" description="What Cloudpoint is investigating. A project creates or strengthens capabilities; its maturity is decided through evaluation and evidence." items={items} status={(p) => p.status} meta={(p) => <><span className="cb-mono">{p.code}</span>{p.maturity ? <Badge tone="violet">{p.maturity} {MATURITY_MODEL[p.maturity].label}</Badge> : <Badge tone="outline">maturity not assessed</Badge>}</>} emptyTitle="No R&D projects registered" emptyDescription="Projects appear here from the CROS registry." />;
}
