import type { Metadata } from "next";
import { DraftForm } from "@/components/forms/DraftForm";
import { Callout, PageHeader } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Create SOP draft" };

export default async function NewSopPage() {
  const viewer = await getViewer();
  if (!viewer.has("sop.author")) return <Callout tone="warning" title="Not authorized">Creating SOP drafts requires sop.author.</Callout>;
  const teams = getRepositories().teams.list();
  return (
    <>
      <PageHeader eyebrow="SOP Library" title="Create an SOP draft" description="Drafts enter the governed lifecycle at DRAFT. A reviewer moves them to REVIEW; an approver publishes the effective version. AI never approves." />
      <DraftForm
        title="SOP draft"
        intro="Describe the procedure. Structured steps make the SOP searchable and let Ask CloudBase cite exact sections."
        destination="content/registry/sops/<id>.yaml"
        base={{ id: "sop-<number-or-slug>", kind: "sop", classification: "internal", version: "draft", effectiveVersion: undefined, versions: [{ version: "1.0", status: "draft", purpose: "", prerequisites: [], procedure: [], verification: [], warnings: [], references: [] }], provenance: { importedFrom: `authored in CloudBase by ${viewer.identity?.email ?? "unknown"}`, locked: true } }}
        fields={[
          { name: "title", label: "Title", kind: "text", required: true, placeholder: "Publish an ArcGIS Online Hosted Feature Layer" },
          { name: "sopNumber", label: "SOP number", kind: "text", placeholder: "e.g. 301.2" },
          { name: "owningTeam", label: "Owning team", kind: "select", required: true, options: teams.map((t) => ({ value: t.id, label: t.name })) },
          { name: "owner", label: "Owner (role or person)", kind: "text", required: true },
          { name: "category", label: "Category", kind: "text", required: true, placeholder: "GIS Engineering" },
          { name: "summary", label: "Summary", kind: "textarea", required: true },
          { name: "tags", label: "Tags", kind: "list", placeholder: "arcgis online\nhosted feature layer" },
          { name: "relatedSystems", label: "Related systems / tools", kind: "list", placeholder: "ArcGIS Online\nArcGIS Pro" },
        ]}
      />
    </>
  );
}
