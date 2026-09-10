import type { Metadata } from "next";
import Link from "next/link";
import { CrosCollection } from "@/components/cros/CrosCollection";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Evaluations" };

export default async function Page() {
  const viewer = await getViewer();
  const items = filterVisible(viewer.identity, "evaluation", getRepositories().cros.evaluations());
  return <CrosCollection type="evaluation" title="Evaluations" description="Structured assessments of ideas, projects and capabilities that lead to decisions." items={items} status={(i) => i.decision} emptyTitle="No evaluations recorded" emptyDescription="Evaluations are created by CROS reviewers." actions={undefined} />;
}
