import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Bot, ExternalLink, MessageSquare } from "lucide-react";
import { AGENT_PLATFORM_LABELS, COPILOT_STATUS_LABELS, DATA_BOUNDARY_LABELS, SOLUTION_STAGE_LABELS } from "@/domain";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { AsideCard, DetailHeader, DetailLayout, MetaList } from "@/components/ui/DetailPage";
import { BodySection, BulletList, Callout, NotRecorded } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().solutions.get(id)?.title ?? "Solution" };
}

export default async function SolutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  const repos = getRepositories();
  const solution = repos.solutions.get(id);
  if (!solution) notFound();
  requireVisible(viewer.identity, "solution", solution);

  const agents = solution.agentIds.map((aid) => repos.agents.get(aid)).filter((a) => a !== undefined);
  const copilots = solution.copilotIds.map((cid) => repos.copilots.get(cid)).filter((c) => c !== undefined);
  const missingAgentIds = solution.agentIds.filter((aid) => !repos.agents.get(aid));
  const missingCopilotIds = solution.copilotIds.filter((cid) => !repos.copilots.get(cid));
  const inService = solution.stage === "operational" || solution.stage === "pilot";

  return (
    <>
      <DetailHeader
        type="solution"
        title={solution.title}
        summary={solution.summary}
        facts={[
          { label: "Stage", value: SOLUTION_STAGE_LABELS[solution.stage] },
          { label: "Requested by", value: solution.requestedBy || (solution.requestingTeam ? teamName(solution.requestingTeam) : "Not recorded") },
          { label: "Delivered by", value: teamName(solution.owningTeam) },
          { label: "Delivery owner", value: solution.deliveryOwner || "Not assigned" },
        ]}
      />

      <DetailLayout
        aside={
          <>
            <AsideCard title="The pair">
              <MetaList
                items={[
                  { label: "Agents", value: `${agents.length} registered` },
                  { label: "Copilots", value: `${copilots.length} registered` },
                  { label: "Human review", value: solution.humanReview || "Not recorded" },
                ]}
              />
            </AsideCard>
            {solution.dataTouched.length > 0 && (
              <AsideCard title="Data this touches">
                <BulletList items={solution.dataTouched} />
              </AsideCard>
            )}
            <AsideCard title="Before it may be called operational">
              <p className="cb-small cb-muted" style={{ margin: 0 }}>
                A registered agent and copilot, each with test cases and a stated data boundary, and a dated evaluation naming who checked it and how many cases passed. Read the standard in{" "}
                <Link href="/docs/cloudbase/using-ai-safely">Using AI safely at Cloudpoint</Link>.
              </p>
            </AsideCard>
          </>
        }
      >
        <BodySection title="The problem">
          <p style={{ whiteSpace: "pre-wrap" }}>{solution.problem}</p>
        </BodySection>

        {(missingAgentIds.length > 0 || missingCopilotIds.length > 0) && (
          <Callout tone="warning" title="Referenced but not registered">
            {[...missingAgentIds, ...missingCopilotIds].join(", ")} — this solution points at something that does not exist in the registry.
          </Callout>
        )}

        <BodySection title="Agents">
          {agents.length === 0 ? (
            <NotRecorded>{inService ? "No agent is registered, yet this solution is in use — that is a gap, not a design choice." : "No agent registered yet."}</NotRecorded>
          ) : (
            <div className="cb-card">
              {agents.map((a) => (
                <div key={a.id} className="cb-item-row">
                  <div>
                    <div className="cb-item-row-title">
                      <Bot size={14} />
                      <Link href={`/agents/${encodeURIComponent(a.id)}`}>{a.title}</Link>
                      <Badge tone="outline">{AGENT_PLATFORM_LABELS[a.platform]}</Badge>
                      {!a.evaluation && <Badge tone="warning">no evaluation</Badge>}
                    </div>
                    <div className="cb-item-row-sub">{a.purpose}</div>
                  </div>
                  <div className="cb-item-row-meta">
                    <Badge tone={a.dataBoundary === "cloudpoint-tenant" ? "success" : a.dataBoundary === "vendor-consumer" ? "warning" : "outline"}>{DATA_BOUNDARY_LABELS[a.dataBoundary]}</Badge>
                    <StatusBadge status={a.status} />
                    {a.accessUrl && (
                      <a href={a.accessUrl} target="_blank" rel="noopener noreferrer" className="cb-btn cb-btn--sm">
                        <ExternalLink /> Open
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </BodySection>

        <BodySection title="Copilots">
          {copilots.length === 0 ? (
            <NotRecorded>{inService ? "No copilot is registered, yet this solution is in use — people have no way to question its output." : "No copilot registered yet."}</NotRecorded>
          ) : (
            <div className="cb-card">
              {copilots.map((c) => (
                <div key={c.id} className="cb-item-row">
                  <div>
                    <div className="cb-item-row-title">
                      <MessageSquare size={14} />
                      <Link href={`/copilots/${encodeURIComponent(c.id)}`}>{c.title}</Link>
                      <Badge tone="outline">{COPILOT_STATUS_LABELS[c.status]}</Badge>
                    </div>
                    <div className="cb-item-row-sub">{c.purpose}</div>
                  </div>
                  <div className="cb-item-row-meta">
                    {c.testCases.length > 0 ? <Badge tone="success">{c.testCases.length} test cases</Badge> : <Badge tone="warning">no test cases</Badge>}
                    {c.accessUrl ? (
                      <a href={c.accessUrl} target="_blank" rel="noopener noreferrer" className="cb-btn cb-btn--sm">
                        <ExternalLink /> Open
                      </a>
                    ) : (
                      <span className="cb-subtle cb-small">no deployment yet</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </BodySection>

        {solution.pairingRationale && (
          <BodySection title="Why this pairing">
            <p style={{ whiteSpace: "pre-wrap" }}>{solution.pairingRationale}</p>
          </BodySection>
        )}

        <BodySection title="How we will know it helped">
          {solution.outcome ? (
            <MetaList
              items={[
                { label: "Measure", value: solution.outcome.measure },
                { label: "Baseline", value: solution.outcome.baseline || "Not recorded" },
                { label: "Target", value: solution.outcome.target || "Not recorded" },
                { label: "Observed", value: solution.outcome.observed || "Not yet observed" },
              ]}
            />
          ) : (
            <NotRecorded>{"No success measure agreed yet. This is decided during scoping, before anything is built — afterwards it is too easy to describe whatever happened as the goal."}</NotRecorded>
          )}
        </BodySection>

        <BodySection title="What this pair may never decide">
          {solution.authorityBoundaries.length ? (
            <BulletList items={solution.authorityBoundaries} />
          ) : (
            <Callout tone="warning" title="No authority boundaries recorded">
              <AlertTriangle size={14} /> Every solution states what it must not decide on its own before it is built.
            </Callout>
          )}
        </BodySection>
      </DetailLayout>
    </>
  );
}
