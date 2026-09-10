import type { Metadata } from "next";
import { CrosRecord } from "@/components/cros/CrosRecord";
import { Badge } from "@/components/ui/Badge";
import { BulletList, NotRecorded } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { relatedFor, teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().cros.cluster(id)?.title ?? "Cluster" };
}

export default async function ClusterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  const cluster = requireVisible(viewer.identity, "capability-cluster", getRepositories().cros.cluster(id));
  const related = relatedFor(viewer.identity, { type: "capability-cluster", id: cluster.id });
  const members = related.find((g) => g.type === "capability")?.entries ?? [];
  return (
    <CrosRecord
      type="capability-cluster"
      record={cluster}
      teamName={teamName(cluster.owningTeam)}
      extraBadges={<Badge tone="outline">{cluster.code}</Badge>}
      related={related}
      sections={[
        { title: "Description", content: cluster.description ? <p>{cluster.description}</p> : <NotRecorded /> },
        { title: "Member capabilities", content: members.length ? <ul>{members.map((m) => <li key={m.ref.id}><a href={m.url}>{m.title}</a>{m.confidence === "proposed" ? " (proposed membership — pending confirmation)" : ""}</li>)}</ul> : <NotRecorded>No capabilities assigned to this cluster yet.</NotRecorded> },
        { title: "Service lines", content: <BulletList items={cluster.serviceLines} empty="No service lines recorded." /> },
      ]}
    />
  );
}
