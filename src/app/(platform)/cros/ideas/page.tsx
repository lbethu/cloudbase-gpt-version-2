import type { Metadata } from "next";
import Link from "next/link";
import { CrosCollection } from "@/components/cros/CrosCollection";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Ideas" };

export default async function Page() {
  const viewer = await getViewer();
  const items = filterVisible(viewer.identity, "idea", getRepositories().cros.ideas());
  return <CrosCollection type="idea" title="Ideas" description="Captured ideas, problems, technologies, client needs and market signals awaiting triage." items={items} status={(i) => i.status} emptyTitle="No ideas have been submitted yet" emptyDescription="Ideas enter CROS through governed intake. Submit one to start an evaluation." actions={viewer.has("rnd.submit") ? <Link className="cb-btn cb-btn--primary" href="/cros/ideas/new">Submit an idea</Link> : undefined} />;
}
