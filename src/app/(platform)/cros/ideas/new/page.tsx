import type { Metadata } from "next";
import { DraftForm } from "@/components/forms/DraftForm";
import { Callout, PageHeader } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Submit R&D idea" };

export default async function NewIdeaPage() {
  const viewer = await getViewer();
  if (!viewer.has("rnd.submit")) return <Callout tone="warning" title="Not authorized">Submitting ideas requires rnd.submit.</Callout>;
  const teams = getRepositories().teams.list();
  return (
    <>
      <PageHeader title="Submit an R&D idea" description="Ideas enter CROS at R0. A reviewer triages them into an evaluation. This intake is compatible with the future CROS Copilot draft flow." />
      <DraftForm
        title="Idea intake"
        intro="Describe the signal and the problem — not the solution. Search CloudBase first and list what already exists."
        destination="content/registry/cros/ideas.yaml"
        base={{ id: "idea-<slug>", status: "new", submittedBy: viewer.identity?.email ?? "", classification: "internal" }}
        fields={[
          { name: "title", label: "Title", kind: "text", required: true },
          { name: "signal", label: "Signal type", kind: "select", required: true, options: [{ value: "idea", label: "Idea" }, { value: "problem", label: "Problem" }, { value: "technology", label: "Technology" }, { value: "client-need", label: "Client need" }, { value: "market-signal", label: "Market signal" }] },
          { name: "owningTeam", label: "Proposing team", kind: "select", required: true, options: teams.map((t) => ({ value: t.id, label: t.name })) },
          { name: "summary", label: "What is the idea / problem?", kind: "textarea", required: true },
          { name: "tags", label: "Existing internal knowledge (ids)", kind: "list", help: "SOP, capability, R&D or project ids you found in CloudBase", placeholder: "CAP-004\nsop-223" },
        ]}
      />
    </>
  );
}
