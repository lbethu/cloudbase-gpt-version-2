import type { Metadata } from "next";
import Link from "next/link";
import { CrosCollection } from "@/components/cros/CrosCollection";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Experiments" };

export default async function Page() {
  const viewer = await getViewer();
  const items = filterVisible(viewer.identity, "experiment", getRepositories().cros.experiments());
  return <CrosCollection type="experiment" title="Experiments" description="Planned and executed experiments with success and failure criteria." items={items} status={(i) => i.status} emptyTitle="No experiments recorded" emptyDescription="Experiments are planned from research proposals." actions={undefined} />;
}
