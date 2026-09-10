import type { Metadata } from "next";
import Link from "next/link";
import { CrosCollection } from "@/components/cros/CrosCollection";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Evidence" };

export default async function Page() {
  const viewer = await getViewer();
  const items = filterVisible(viewer.identity, "evidence", getRepositories().cros.evidence());
  return <CrosCollection type="evidence" title="Evidence" description="Benchmarks, pilot results, client feedback and experiment results — candidate until approved by a human." items={items} status={(i) => i.status} emptyTitle="No evidence recorded" emptyDescription="Evidence records are produced by experiments, pilots and research." actions={undefined} />;
}
