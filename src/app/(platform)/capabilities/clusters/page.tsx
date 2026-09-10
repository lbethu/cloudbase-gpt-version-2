import type { Metadata } from "next";
import { CrosCollection } from "@/components/cros/CrosCollection";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Capability Clusters" };

export default async function ClustersPage() {
  const viewer = await getViewer();
  const items = filterVisible(viewer.identity, "capability-cluster", getRepositories().cros.clusters());
  return <CrosCollection type="capability-cluster" title="Capability Clusters" description="Groups of related capabilities that together support a service line." items={items} status={() => undefined} meta={(c) => <span className="cb-mono">{c.code}</span>} emptyTitle="No clusters defined" emptyDescription="Clusters are defined in the CROS registry." />;
}
