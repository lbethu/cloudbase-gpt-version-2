import type { Metadata } from "next";
import Link from "next/link";
import { Bot, MessageSquare, ShieldCheck, Workflow } from "lucide-react";
import { SOLUTION_STAGE_LABELS, type SolutionStage } from "@/domain";
import { Kpi } from "@/components/dashboard/widgets";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Callout, EmptyState, PageHeader, Section } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { teamName } from "@/server/services/catalog";
import { permittedItems } from "@/server/services/search";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "AI Solutions" };

const STAGE_ORDER: SolutionStage[] = ["intake", "scoping", "building", "pilot", "operational", "retired"];

/**
 * The delivery pipeline. Every business problem goes to the AI & Automation
 * team and is answered with an agent + copilot pair; this board is where that
 * commitment is visible, including the parts that have not been done.
 */
export default async function SolutionsPage() {
  const viewer = await getViewer();
  if (!viewer.has("knowledge.read")) return <Callout tone="warning" title="Not authorized">This board requires knowledge.read.</Callout>;

  const repos = getRepositories();
  const visible = new Set(permittedItems(viewer.identity!).filter((i) => i.ref.type === "solution").map((i) => i.ref.id));
  const solutions = repos.solutions.list().filter((s) => visible.has(s.id));
  const agents = repos.agents.list();
  const copilots = repos.copilots.list();

  const inFlight = solutions.filter((s) => s.stage !== "retired");
  const unowned = inFlight.filter((s) => !s.deliveryOwner.trim());
  const operationalWithoutEvidence = solutions.filter((s) => s.stage === "operational" && !s.agentIds.concat(s.copilotIds).length);

  return (
    <>
      <PageHeader
        eyebrow="AI & Automation"
        title="AI Solutions"
        description="Every business problem is submitted here and answered with a pair: an agent that runs on its own and reports, and a copilot the affected people can interrogate. The pair is the unit of delivery — an agent alone produces reports nobody can question, and a copilot alone never notices anything unless asked."
      />

      <div className="cb-kpi-grid">
        <Kpi label="In the pipeline" value={inFlight.length} foot={<span>{solutions.filter((s) => s.stage === "intake").length} awaiting scoping</span>} />
        <Kpi label="In service" value={solutions.filter((s) => s.stage === "operational").length} foot={<span>{solutions.filter((s) => s.stage === "pilot").length} in pilot</span>} />
        <Kpi label="Without a delivery owner" value={unowned.length} tone={unowned.length ? "warning" : "success"} foot={<span>A request with no named owner is not yet accepted</span>} />
      </div>

      {operationalWithoutEvidence.length > 0 && (
        <Callout tone="warning" title="In service without a registered agent or copilot">
          {operationalWithoutEvidence.map((s) => s.title).join("; ")} — an operational solution must point at the agent and copilot it delivered.
        </Callout>
      )}

      <Section title="How a request becomes a solution">
        <div className="cb-card cb-card--pad" style={{ display: "grid", gap: 10 }}>
          <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8, fontSize: 13 }}>
            <li><strong>Intake.</strong> Anyone states a problem in their own words — not a feature request. It is recorded here with the requester and the team.</li>
            <li><strong>Scoping.</strong> The AI &amp; Automation team names a delivery owner, agrees how anyone would tell whether it helped, and decides what the pair must never decide on its own.</li>
            <li><strong>Building.</strong> The agent and the copilot are registered, each with test cases and an explicit data boundary.</li>
            <li><strong>Pilot.</strong> Real users, real work, evidence collected against the test cases.</li>
            <li><strong>Operational.</strong> Only after a dated evaluation with a named reviewer. Nothing reaches this stage on an opinion.</li>
          </ol>
          <p className="cb-subtle" style={{ fontSize: 11.5, margin: 0 }}>
            Human authority is unchanged at every stage: agents and copilots recommend, draft, summarize and find. Approving, publishing, promoting and authorizing stay with the people who hold those permissions.
          </p>
        </div>
      </Section>

      {STAGE_ORDER.map((stage) => {
        const group = solutions.filter((s) => s.stage === stage);
        if (!group.length) return null;
        return (
          <Section key={stage} title={SOLUTION_STAGE_LABELS[stage]}>
            <div className="cb-card">
              {group.map((s) => {
                const pairedAgents = s.agentIds.map((id) => agents.find((a) => a.id === id)).filter(Boolean);
                const pairedCopilots = s.copilotIds.map((id) => copilots.find((c) => c.id === id)).filter(Boolean);
                return (
                  <Link key={s.id} href={`/solutions/${encodeURIComponent(s.id)}`} className="cb-item-row">
                    <div>
                      <div className="cb-item-row-title">
                        <Workflow size={14} /> {s.title}
                        {!s.deliveryOwner.trim() && <Badge tone="warning">no owner</Badge>}
                      </div>
                      <div className="cb-item-row-sub">{s.summary || s.problem.slice(0, 160)}</div>
                    </div>
                    <div className="cb-item-row-meta">
                      <Badge tone={pairedAgents.length ? "success" : "outline"}>
                        <Bot size={12} /> {pairedAgents.length} agent{pairedAgents.length === 1 ? "" : "s"}
                      </Badge>
                      <Badge tone={pairedCopilots.length ? "success" : "outline"}>
                        <MessageSquare size={12} /> {pairedCopilots.length} copilot{pairedCopilots.length === 1 ? "" : "s"}
                      </Badge>
                      <StatusBadge status={s.stage} />
                      <span>{teamName(s.requestingTeam || s.owningTeam)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Section>
        );
      })}

      {solutions.length === 0 && (
        <EmptyState icon={<ShieldCheck size={18} />} title="No requests in the pipeline" description="Problems submitted to the AI & Automation team appear here, each answered with an agent and a copilot." />
      )}
    </>
  );
}
