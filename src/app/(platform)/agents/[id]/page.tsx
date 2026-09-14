import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RunAgentButton } from "@/components/agents/RunAgentButton";
import { FindingsList } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/Badge";
import { AsideCard, DetailHeader, DetailLayout, MetaList } from "@/components/ui/DetailPage";
import { BodySection, BulletList, Callout } from "@/components/ui/primitives";
import { AGENT_PLATFORM_LABELS, DATA_BOUNDARY_LABELS } from "@/domain";
import { getRepositories } from "@/server/repositories";
import { agentFindings, listAgentRuns } from "@/server/services/agents";
import { teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().agents.get(id)?.title ?? "Agent" };
}

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  if (!viewer.has("agent.read")) notFound();
  const agent = getRepositories().agents.get(id);
  if (!agent) notFound();
  const { findings } = await agentFindings(viewer.identity!, { agentIds: [agent.id] });
  const runs = (await listAgentRuns(100)).filter((r) => r.agentId === agent.id).slice(0, 8);
  return (
    <>
      <DetailHeader type="agent" title={agent.title} status={agent.status} summary={agent.purpose} extraBadges={<>{<Badge tone={agent.kind === "ai-assisted" ? "violet" : "outline"}>{agent.kind}</Badge>}{agent.evaluation ? <Badge tone="success">evaluated</Badge> : <Badge tone="warning">not evaluated</Badge>}</>} facts={[{ label: "Team", value: <Link href={`/teams/${agent.owningTeam}`}>{teamName(agent.owningTeam)}</Link> }, { label: "Cadence", value: agent.cadence }, { label: "Audiences", value: agent.audiences.join(", ") || "—" }, { label: "Runs on", value: AGENT_PLATFORM_LABELS[agent.platform] }, { label: "Owner", value: agent.owner || "Not assigned" }]} actions={<RunAgentButton agentId={agent.id} disabled={!viewer.has("agent.run") || agent.status !== "active" || agent.kind === "ai-assisted"} />} />
      <DetailLayout aside={<><AsideCard title="Access & data boundary">
          <MetaList items={[{ label: "Platform", value: AGENT_PLATFORM_LABELS[agent.platform] }, { label: "Data boundary", value: DATA_BOUNDARY_LABELS[agent.dataBoundary] }, { label: "Open", value: agent.accessUrl ? <a href={agent.accessUrl} target="_blank" rel="noopener noreferrer">Open this agent</a> : "No deployment link recorded" }]} />
          <p className="cb-subtle cb-small" style={{ marginTop: 8 }}>What may be given to this agent is governed by <Link href="/docs/cloudbase/using-ai-safely">Using AI safely at Cloudpoint</Link>.</p>
        </AsideCard><AsideCard title="Permitted inputs"><BulletList items={agent.permittedInputs} empty="Not assessed. Until this is recorded, give it nothing beyond public information." /></AsideCard><AsideCard title="Authority boundaries"><BulletList items={agent.authorityBoundaries} empty="None declared." /></AsideCard><AsideCard title="Recent runs">{runs.length ? <ul className="cb-aside-list">{runs.map((r) => <li key={r.id}><span>{r.startedAt.slice(0, 16).replace("T", " ")}</span><small>{r.status} · {r.summary} · {r.actor}</small></li>)}</ul> : <p className="cb-muted cb-small">No explicit runs yet.</p>}</AsideCard><AsideCard title="Metadata"><MetaList items={[{ label: "Id", value: <span className="cb-mono">{agent.id}</span> }, { label: "Kind", value: agent.kind }, { label: "Status", value: agent.status }]} /></AsideCard></>}>
        <BodySection title="Accuracy evidence">
          {agent.evaluation ? (
            <MetaList
              items={[
                { label: "Evaluated", value: agent.evaluation.evaluatedAt },
                { label: "By", value: agent.evaluation.evaluatedBy },
                { label: "Cases", value: `${agent.evaluation.casesPassed} of ${agent.evaluation.casesRun} passed` },
                { label: "Method", value: agent.evaluation.method || "Not recorded" },
              ]}
            />
          ) : (
            <Callout tone="warning" title="No evaluation recorded">
              This agent has no dated evaluation naming who checked it and how many test cases passed{agent.testCases.length ? ` (${agent.testCases.length} test cases are defined but no run is recorded)` : ""}. Treat its output as unverified, and do not present it as operational.
            </Callout>
          )}
        </BodySection>
        <BodySection title={`Current findings (${findings.length})`}>
          {agent.kind === "ai-assisted" ? <p className="cb-muted cb-small">AI-assisted agents run only with a configured AI provider and an explicit request; this agent is {agent.status}.</p> : <FindingsList findings={findings} emptyLabel="Nothing to flag in your scope right now." />}
        </BodySection>
      </DetailLayout>
    </>
  );
}
