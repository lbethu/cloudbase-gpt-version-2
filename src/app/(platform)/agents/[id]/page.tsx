import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RunAgentButton } from "@/components/agents/RunAgentButton";
import { FindingsList } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/Badge";
import { AsideCard, DetailHeader, DetailLayout, MetaList } from "@/components/ui/DetailPage";
import { BodySection, BulletList } from "@/components/ui/primitives";
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
      <DetailHeader type="agent" title={agent.title} status={agent.status} summary={agent.purpose} extraBadges={<Badge tone={agent.kind === "ai-assisted" ? "violet" : "outline"}>{agent.kind}</Badge>} facts={[{ label: "Team", value: <Link href={`/teams/${agent.owningTeam}`}>{teamName(agent.owningTeam)}</Link> }, { label: "Cadence", value: agent.cadence }, { label: "Audiences", value: agent.audiences.join(", ") || "—" }, { label: "Implementation", value: <span className="cb-mono">{agent.implementation}</span> }]} actions={<RunAgentButton agentId={agent.id} disabled={!viewer.has("agent.run") || agent.status !== "active" || agent.kind === "ai-assisted"} />} />
      <DetailLayout aside={<><AsideCard title="Authority boundaries"><BulletList items={agent.authorityBoundaries} empty="None declared." /></AsideCard><AsideCard title="Recent runs">{runs.length ? <ul className="cb-aside-list">{runs.map((r) => <li key={r.id}><span>{r.startedAt.slice(0, 16).replace("T", " ")}</span><small>{r.status} · {r.summary} · {r.actor}</small></li>)}</ul> : <p className="cb-muted cb-small">No explicit runs yet.</p>}</AsideCard><AsideCard title="Metadata"><MetaList items={[{ label: "Id", value: <span className="cb-mono">{agent.id}</span> }, { label: "Kind", value: agent.kind }, { label: "Status", value: agent.status }]} /></AsideCard></>}>
        <BodySection title={`Current findings (${findings.length})`}>
          {agent.kind === "ai-assisted" ? <p className="cb-muted cb-small">AI-assisted agents run only with a configured AI provider and an explicit request; this agent is {agent.status}.</p> : <FindingsList findings={findings} emptyLabel="Nothing to flag in your scope right now." />}
        </BodySection>
      </DetailLayout>
    </>
  );
}
