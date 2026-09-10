import type { Metadata } from "next";
import { DraftForm } from "@/components/forms/DraftForm";
import { Callout, PageHeader } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Propose a New Automation" };

export default async function ProposeAutomationPage() {
  const viewer = await getViewer();
  if (!viewer.has("automation.read")) return <Callout tone="warning" title="Not authorized">Requires automation.read.</Callout>;
  const teams = getRepositories().teams.list();
  const yn = [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" }];
  return (
    <>
      <PageHeader eyebrow="AI Automation" title="Propose a New Automation" description="Start from the workflow problem. The intake decides between deterministic automation, AI-assisted automation and no automation, and is compatible with future CROS intake." />
      <DraftForm
        title="Automation proposal"
        intro="Answer in plain language. An AI steward triages proposals; approved automations are registered with owner, trigger, systems and human-review points."
        destination="content/registry/automations/records.yaml (status: proposed)"
        base={{ id: "<slug>", status: "proposed", kind: "deterministic", proposedBy: viewer.identity?.email ?? "", classification: "internal" }}
        submitLabel="Generate proposal"
        fields={[
          { name: "title", label: "Proposal title", kind: "text", required: true },
          { name: "proposedTeam", label: "Team", kind: "select", required: true, options: teams.map((t) => ({ value: t.id, label: t.name })) },
          { name: "problem", label: "What problem are you solving?", kind: "textarea", required: true },
          { name: "whoExperiencesIt", label: "Who experiences it?", kind: "text", required: true },
          { name: "frequency", label: "How often?", kind: "select", required: true, options: [{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }, { value: "monthly", label: "Monthly" }, { value: "per-project", label: "Per project" }, { value: "ad-hoc", label: "Ad hoc" }] },
          { name: "currentSystem", label: "What system currently handles it?", kind: "text" },
          { name: "deterministicEnough", label: "Is deterministic automation enough?", kind: "select", required: true, options: yn },
          { name: "aiNeeded", label: "Is AI actually needed?", kind: "select", required: true, options: yn, help: "AI is justified only when judgment over unstructured information is the bottleneck." },
          { name: "dataInvolved", label: "What data is involved?", kind: "textarea", help: "Include classification (internal / confidential / restricted)." },
          { name: "permissionsRequired", label: "What permissions are required?", kind: "textarea" },
          { name: "successDefinition", label: "What does success mean?", kind: "textarea", required: true, help: "A measurable outcome." },
        ]}
      />
    </>
  );
}
