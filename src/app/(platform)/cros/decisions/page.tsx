import type { Metadata } from "next";
import Link from "next/link";
import { CrosCollection } from "@/components/cros/CrosCollection";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Decisions" };

export default async function Page() {
  const viewer = await getViewer();
  const items = filterVisible(viewer.identity, "decision", getRepositories().cros.decisions());
  return <CrosCollection type="decision" title="Decisions" description="Governed decisions — proceed, hold, stop, promote, retire — with rationale and maturity changes." items={items} status={(i) => i.outcome} emptyTitle="No decisions recorded" emptyDescription="Decisions are recorded by authorized CROS approvers." actions={undefined} />;
}
