import type { Metadata } from "next";
import Link from "next/link";
import { DraftForm } from "@/components/forms/DraftForm";
import { Callout, PageHeader, Section } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Create a Cloudpoint Copilot" };

const STEPS = ["Start with the business problem", "Determine whether AI is needed", "Define user / persona", "Define authority boundaries", "Define knowledge sources", "Define instructions", "Define output contracts", "Define security / data restrictions", "Define human review", "Test", "Evaluate", "Version", "Publish (authorized review only)", "Maintain"];
const TEMPLATES = ["Master Instructions", "Knowledge Context", "Governance", "Output Contracts", "Test Cases", "Evaluation Rubric", "Release Notes"];

export default async function CreateCopilotPage() {
  const viewer = await getViewer();
  if (!viewer.has("copilot.read")) return <Callout tone="warning" title="Not authorized">Requires copilot.read.</Callout>;
  const teams = getRepositories().teams.list();
  return (
    <>
      <PageHeader eyebrow="Copilot Creation Center" title="How to Create a Cloudpoint Copilot" description="The internal AI engineering playbook. Follow the fourteen steps, use the templates, and generate a draft registry definition. Publication requires authorized review — nothing here publishes a copilot." actions={<><Link className="cb-btn cb-btn--primary" href="/docs/how-to-create-a-cloudpoint-copilot">Read the full playbook</Link><Link className="cb-btn" href="/docs/copilot-engineering-standard">Engineering Standard</Link></>} />
      <div className="cb-grid cb-grid--2">
        <Section title="The fourteen steps">
          <ol className="cb-card cb-card--pad cb-steps" style={{ margin: 0 }}>{STEPS.map((s) => <li key={s}><strong>{s}</strong></li>)}</ol>
        </Section>
        <Section title="Templates (in the Engineering Standard)">
          <ul className="cb-card cb-card--pad" style={{ margin: 0, paddingLeft: 36, display: "grid", gap: 6 }}>{TEMPLATES.map((t) => <li key={t}><Link href="/docs/copilot-engineering-standard#templates">{t}</Link></li>)}</ul>
        </Section>
      </div>
      <Section title="Draft a copilot definition">
        {viewer.has("copilot.manage") || viewer.has("knowledge.create") ? (
          <DraftForm
            title="Copilot definition (draft)"
            intro="Generates a registry record with status draft. An AI steward reviews it before it appears as anything more than a draft."
            destination="content/registry/copilots/copilots.yaml"
            base={{ id: "<slug>", status: "draft", version: "0.1.0", securityClassification: "internal", accessUrl: undefined, knowledgeSources: [], testCases: [], releaseNotes: [{ version: "0.1.0", note: "Initial draft" }] }}
            fields={[
              { name: "title", label: "Name", kind: "text", required: true },
              { name: "owningTeam", label: "Owning team", kind: "select", required: true, options: teams.map((t) => ({ value: t.id, label: t.name })) },
              { name: "purpose", label: "Purpose (one sentence)", kind: "text", required: true },
              { name: "owner", label: "Owner", kind: "text", required: true },
              { name: "description", label: "Business problem and description", kind: "textarea", required: true },
              { name: "supportedUsers", label: "Supported users / personas", kind: "list", required: true },
              { name: "authorityBoundaries", label: "Authority boundaries (MAY / MUST NOT)", kind: "list", required: true },
              { name: "instructions", label: "Master instructions (draft)", kind: "textarea" },
              { name: "outputContract", label: "Output contract", kind: "textarea" },
              { name: "humanReview", label: "Human review points", kind: "textarea", required: true },
              { name: "limitations", label: "Known limitations", kind: "list" },
            ]}
          />
        ) : (
          <Callout tone="info">Drafting copilot definitions requires the contributor or AI steward role. You can still read the playbook and standard.</Callout>
        )}
      </Section>
    </>
  );
}
