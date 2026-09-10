import "server-only";
import { randomUUID } from "node:crypto";
import type { AgentDefinition, AgentFinding, AgentRun } from "@/domain";
import type { Identity } from "@/server/auth/identity";
import { can } from "@/server/authz";
import { getRepositories } from "@/server/repositories";
import { getRegistryWriter } from "@/server/repositories/writer";
import { runAgent, SEVERITY_ORDER } from "@/server/agents/engine";
import { recordAudit } from "./audit";
import { crmOpportunities } from "./crm";
import { permittedItems } from "./search";

/** Findings for the identity — computed on demand over what they may read. */
export async function agentFindings(identity: Identity, options: { agentIds?: string[]; audience?: string } = {}): Promise<{ findings: AgentFinding[]; agents: AgentDefinition[] }> {
  if (!can(identity, "agent.read")) return { findings: [], agents: [] };
  const repos = getRepositories();
  const agents = repos.agents.list().filter((a) => (!options.agentIds || options.agentIds.includes(a.id)) && (!options.audience || a.audiences.includes(options.audience)));
  const index = permittedItems(identity);
  const opportunities = can(identity, "crm.read") ? (await crmOpportunities(identity)).items : [];
  const findings = agents.flatMap((agent) => runAgent(agent, { repos, index, now: new Date(), opportunities }).findings);
  findings.sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) || a.title.localeCompare(b.title));
  return { findings: findings.filter((f) => !f.requiredPermission || can(identity, f.requiredPermission as Parameters<typeof can>[1])), agents };
}

/** Explicit run: audited and recorded. Requires agent.run. */
export async function executeAgent(identity: Identity, agentId: string): Promise<{ run: AgentRun; findings: AgentFinding[] } | { error: string; status: 403 | 404 }> {
  if (!can(identity, "agent.run")) return { error: "agent.run required", status: 403 };
  const agent = getRepositories().agents.get(agentId);
  if (!agent) return { error: "Unknown agent", status: 404 };
  const startedAt = new Date().toISOString();
  const { findings } = await agentFindings(identity, { agentIds: [agentId] });
  const result = runAgent(agent, { repos: getRepositories(), index: permittedItems(identity), now: new Date() });
  const run: AgentRun = { id: randomUUID(), agentId, startedAt, finishedAt: new Date().toISOString(), actor: identity.subject, status: result.skipped ? "skipped" : "completed", findingCount: findings.length, summary: result.skipped ?? `${findings.length} finding(s)` };
  await getRegistryWriter().appendAgentRun(run);
  recordAudit({ actor: identity.subject, action: "agent.run", target: { type: "agent", id: agentId }, outcome: "allowed", detail: { findings: findings.length, status: run.status } });
  return { run, findings };
}

export async function listAgentRuns(limit = 50): Promise<AgentRun[]> {
  return getRegistryWriter().listAgentRuns(limit);
}
