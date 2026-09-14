import type { AgentDefinition, AgentFinding, FindingSeverity, KnowledgeItem, Opportunity } from "@/domain";
import { MATURITY_MODEL, refKey } from "@/domain";
import { urlFor } from "@/lib/urls";
import type { Repositories } from "@/server/repositories/interfaces";

/**
 * Deterministic agent implementations. Pure functions over the registry and
 * the (permission-scoped) knowledge index — testable, auditable, and never
 * mutating. Each returns findings with a recommended human action.
 */

export interface AgentContext {
  repos: Repositories;
  /** Items the requesting identity may read; findings never reference others. */
  index: KnowledgeItem[];
  now: Date;
  /** Live CRM records (already permission-checked by the caller) — optional. */
  opportunities?: Opportunity[];
}

type Impl = (agent: AgentDefinition, ctx: AgentContext) => AgentFinding[];

const finding = (agent: AgentDefinition, severity: FindingSeverity, title: string, extra: Partial<AgentFinding> & { detail?: string; recommendedAction?: string }): AgentFinding => ({
  id: `${agent.id}:${extra.target ? refKey(extra.target) : title}`.toLowerCase().replace(/[^a-z0-9:-]+/g, "-"),
  agentId: agent.id,
  severity,
  title,
  detail: extra.detail ?? "",
  target: extra.target,
  url: extra.url ?? (extra.target ? urlFor(extra.target) : undefined),
  owningTeam: extra.owningTeam ?? "",
  recommendedAction: extra.recommendedAction ?? "",
  requiredPermission: extra.requiredPermission,
});

const visible = (ctx: AgentContext, type: KnowledgeItem["ref"]["type"], id: string) => ctx.index.some((i) => i.ref.type === type && i.ref.id === id);

const coverage: Impl = (agent, ctx) => {
  const out: AgentFinding[] = [];
  const { repos } = ctx;
  for (const sop of repos.sops.list()) {
    if (!visible(ctx, "sop", sop.id)) continue;
    if (!sop.owner) out.push(finding(agent, "medium", `SOP has no named owner: ${sop.title}`, { target: { type: "sop", id: sop.id }, owningTeam: sop.owningTeam, recommendedAction: "Assign an owner in the registry so review and approval can be routed." }));
    if (!sop.summary) out.push(finding(agent, "low", `SOP has no summary: ${sop.title}`, { target: { type: "sop", id: sop.id }, owningTeam: sop.owningTeam, recommendedAction: "Add a one-sentence summary; it drives search snippets and Ask CloudBase answers." }));
  }
  for (const cap of repos.cros.capabilities()) {
    if (!visible(ctx, "capability", cap.id)) continue;
    if (!cap.description) out.push(finding(agent, "medium", `Capability has no description: ${cap.code}`, { target: { type: "capability", id: cap.id }, owningTeam: cap.owningTeam, recommendedAction: "Describe what the capability reliably does, its inputs/outputs and limitations." }));
    if (!cap.maturity) out.push(finding(agent, "high", `Capability has no governed maturity: ${cap.code} ${cap.title}`, { target: { type: "capability", id: cap.id }, owningTeam: cap.owningTeam, recommendedAction: "Run a CROS evaluation and record a decision assigning R0–R7.", requiredPermission: "rnd.approve" }));
  }
  for (const p of repos.cros.rndProjects()) {
    if (!visible(ctx, "rnd-project", p.id)) continue;
    if (!p.problem) out.push(finding(agent, "medium", `R&D project has no problem statement: ${p.code}`, { target: { type: "rnd-project", id: p.id }, owningTeam: p.owningTeam, recommendedAction: "Record the problem and hypothesis so evaluations have a baseline." }));
  }
  for (const c of repos.copilots.list()) {
    if (!visible(ctx, "copilot", c.id)) continue;
    if (c.status !== "concept" && c.testCases.length === 0) out.push(finding(agent, "high", `Copilot beyond concept without test cases: ${c.title}`, { target: { type: "copilot", id: c.id }, owningTeam: c.owningTeam, recommendedAction: "Add test cases per the Copilot Engineering Standard before pilot.", requiredPermission: "copilot.manage" }));
    if (!c.instructions && c.status !== "concept") out.push(finding(agent, "medium", `Copilot has no governed instructions: ${c.title}`, { target: { type: "copilot", id: c.id }, owningTeam: c.owningTeam, recommendedAction: "Author the master instructions in the registry." }));
  }
  for (const t of repos.teams.list()) {
    if (t.owners.length === 0 && t.scope !== "company-wide") out.push(finding(agent, "low", `Team has no owners: ${t.name}`, { target: { type: "team", id: t.id }, owningTeam: t.id, recommendedAction: "Name at least one knowledge owner for the workspace." }));
  }
  return out;
};

const freshness: Impl = (agent, ctx) => {
  const out: AgentFinding[] = [];
  const staleMs = 365 * 86_400_000;
  const stale = (d?: string) => !d || ctx.now.getTime() - new Date(d).getTime() > staleMs;
  const inReview = ctx.repos.sops.list().filter((s) => visible(ctx, "sop", s.id) && !s.effectiveVersion);
  if (inReview.length) out.push(finding(agent, inReview.length > 10 ? "high" : "medium", `${inReview.length} SOP${inReview.length === 1 ? "" : "s"} have no approved effective version`, { url: "/governance/reviews?kind=sop-approval", recommendedAction: "Owners confirm the effective version; approvers publish it.", requiredPermission: "sop.approve", owningTeam: "company-wide" }));
  for (const s of ctx.repos.sops.list()) {
    const eff = s.versions.find((v) => v.version === s.effectiveVersion);
    if (eff?.status === "approved" && stale(eff.reviewedAt ?? s.lastReviewedAt) && visible(ctx, "sop", s.id)) out.push(finding(agent, "medium", `Approved SOP past review cadence: ${s.title}`, { target: { type: "sop", id: s.id }, owningTeam: s.owningTeam, recommendedAction: "Review and re-approve or supersede." }));
  }
  for (const d of ctx.repos.docs.list()) {
    if (d.status === "published" && stale(d.lastReviewedAt) && visible(ctx, "documentation", d.id)) out.push(finding(agent, "low", `Published documentation past review cadence: ${d.title}`, { target: { type: "documentation", id: d.id }, owningTeam: d.owningTeam, recommendedAction: "Re-review or archive." }));
    if (d.status === "draft" && visible(ctx, "documentation", d.id)) out.push(finding(agent, "info", `Documentation still in draft: ${d.title}`, { target: { type: "documentation", id: d.id }, owningTeam: d.owningTeam, recommendedAction: "Submit for review when ready; drafts are not authoritative." }));
  }
  return out;
};

const relationships: Impl = (agent, ctx) => {
  const out: AgentFinding[] = [];
  const rels = ctx.repos.relationships.list();
  const proposed = rels.filter((r) => r.confidence === "proposed");
  if (proposed.length) out.push(finding(agent, "medium", `${proposed.length} relationships are proposed and unconfirmed`, { url: "/graph?confidence=proposed", recommendedAction: "Confirm or remove each proposed link in content/registry/relationships.yaml.", owningTeam: "rnd", requiredPermission: "rnd.review" }));
  const linked = new Set(rels.map((r) => `${refKey(r.from)}→${refKey(r.to)}`));
  for (const p of ctx.repos.cros.rndProjects()) {
    if (!visible(ctx, "rnd-project", p.id)) continue;
    const hasCap = rels.some((r) => r.from.type === "rnd-project" && r.from.id === p.id && r.to.type === "capability");
    if (!hasCap) out.push(finding(agent, "medium", `R&D project creates no capability yet: ${p.code}`, { target: { type: "rnd-project", id: p.id }, owningTeam: p.owningTeam, recommendedAction: "Link the capability this project is meant to create or strengthen." }));
  }
  for (const c of ctx.repos.cros.capabilities()) {
    if (!visible(ctx, "capability", c.id)) continue;
    const hasEvidence = rels.some((r) => r.to.type === "capability" && r.to.id === c.id && (r.from.type === "evidence" || r.from.type === "project-reference"));
    if (!hasEvidence) out.push(finding(agent, "low", `Capability has no evidence or project reference: ${c.code}`, { target: { type: "capability", id: c.id }, owningTeam: c.owningTeam, recommendedAction: "Attach approved evidence or the project that proved the capability." }));
    const inCluster = rels.some((r) => r.from.type === "capability" && r.from.id === c.id && r.to.type === "capability-cluster");
    if (!inCluster) out.push(finding(agent, "info", `Capability is not in a cluster: ${c.code}`, { target: { type: "capability", id: c.id }, owningTeam: c.owningTeam, recommendedAction: "Assign to a cluster if it supports a service line with other capabilities." }));
  }
  void linked;
  return out;
};

const duplicates: Impl = (agent, ctx) => {
  const out: AgentFinding[] = [];
  const sops = ctx.repos.sops.list().filter((s) => visible(ctx, "sop", s.id));
  for (const s of sops) {
    const pending = s.versions.filter((v) => v.status === "review" || v.status === "draft");
    if (pending.length > 1) out.push(finding(agent, "high", `Multiple unreconciled versions: ${s.title}`, { target: { type: "sop", id: s.id }, owningTeam: s.owningTeam, recommendedAction: `Confirm which of ${pending.map((v) => v.version).join(", ")} is effective; mark the other superseded.`, requiredPermission: "sop.approve" }));
  }
  const norm = (t: string) => t.toLowerCase().replace(/^[\d.]+\s*-?\s*/, "").replace(/[^a-z0-9]+/g, " ").trim();
  const seen = new Map<string, string>();
  for (const s of sops) {
    const key = norm(s.title);
    const other = seen.get(key);
    if (other && other !== s.id) out.push(finding(agent, "medium", `Near-duplicate SOP titles: ${s.title}`, { target: { type: "sop", id: s.id }, owningTeam: s.owningTeam, detail: `Also: ${other}`, recommendedAction: "Merge or clearly differentiate scope." }));
    seen.set(key, s.id);
  }
  return out;
};

const pipeline: Impl = (agent, ctx) => {
  const out: AgentFinding[] = [];
  const opps = ctx.opportunities ?? ctx.repos.crm.opportunities();
  const staleMs = 30 * 86_400_000;
  for (const o of opps) {
    if (o.stage === "won" || o.stage === "lost") {
      if (o.stage === "won" && !ctx.repos.relationships.list().some((r) => r.from.type === "opportunity" && r.from.id === o.id && r.to.type === "project-reference")) out.push(finding(agent, "low", `Won opportunity without a project reference: ${o.title}`, { target: { type: "opportunity", id: o.id }, owningTeam: o.owningTeam, recommendedAction: "Create a project reference per SOP 223 once delivery starts." }));
      continue;
    }
    if (!o.nextStep) out.push(finding(agent, "medium", `No next step: ${o.title}`, { target: { type: "opportunity", id: o.id }, owningTeam: o.owningTeam, recommendedAction: "Record the next activity (SOP 216 / 209)." }));
    if ((o.stage === "sql" || o.stage === "proposal") && !o.rfpDecision) out.push(finding(agent, "medium", `Qualified deal without a GO / NO_GO decision: ${o.title}`, { target: { type: "opportunity", id: o.id }, owningTeam: o.owningTeam, recommendedAction: "Run the RFP appraisal and record the decision." }));
    if (o.updatedAt && ctx.now.getTime() - new Date(o.updatedAt).getTime() > staleMs) out.push(finding(agent, "low", `Stale for 30+ days in ${o.stage}: ${o.title}`, { target: { type: "opportunity", id: o.id }, owningTeam: o.owningTeam, recommendedAction: "Advance, park, or close." }));
  }
  return out;
};

/**
 * Enforces the delivery standard: a solution or agent that claims to be in
 * service must carry the evidence that justifies the claim. This is the agent
 * that makes "operational" mean something.
 */
const assurance: Impl = (agent, ctx) => {
  const out: AgentFinding[] = [];
  const { repos } = ctx;

  for (const s of repos.solutions.list()) {
    if (!visible(ctx, "solution", s.id)) continue;
    const inService = s.stage === "operational" || s.stage === "pilot";
    if (s.stage !== "intake" && !s.deliveryOwner.trim())
      out.push(finding(agent, "high", `Solution past intake with no delivery owner: ${s.title}`, { target: { type: "solution", id: s.id }, owningTeam: s.owningTeam, recommendedAction: "Name the human accountable for this answer before any building starts." }));
    if (inService && s.agentIds.length === 0 && s.copilotIds.length === 0)
      out.push(finding(agent, "high", `Solution in use with neither agent nor copilot registered: ${s.title}`, { target: { type: "solution", id: s.id }, owningTeam: s.owningTeam, recommendedAction: "Register what was actually delivered, or move the stage back to building." }));
    if (inService && s.copilotIds.length === 0)
      out.push(finding(agent, "medium", `Solution in use with no copilot: ${s.title}`, { target: { type: "solution", id: s.id }, owningTeam: s.owningTeam, recommendedAction: "People have no way to question the agent's output. Register the copilot or record why one is not needed." }));
    if (s.stage !== "intake" && !s.outcome?.measure)
      out.push(finding(agent, "medium", `Solution with no agreed success measure: ${s.title}`, { target: { type: "solution", id: s.id }, owningTeam: s.owningTeam, recommendedAction: "Agree during scoping how anyone would tell whether this helped." }));
    if (inService && s.authorityBoundaries.length === 0)
      out.push(finding(agent, "high", `Solution in use with no authority boundaries: ${s.title}`, { target: { type: "solution", id: s.id }, owningTeam: s.owningTeam, recommendedAction: "State what this pair may never decide on its own." }));
    for (const id of s.agentIds) if (!repos.agents.get(id)) out.push(finding(agent, "medium", `Solution references an agent that is not registered: ${id}`, { target: { type: "solution", id: s.id }, owningTeam: s.owningTeam, recommendedAction: "Register the agent or correct the reference." }));
    for (const id of s.copilotIds) if (!repos.copilots.get(id)) out.push(finding(agent, "medium", `Solution references a copilot that is not registered: ${id}`, { target: { type: "solution", id: s.id }, owningTeam: s.owningTeam, recommendedAction: "Register the copilot or correct the reference." }));
  }

  for (const a of repos.agents.list()) {
    if (a.status !== "active") continue;
    if (a.platform !== "in-platform") {
      if (a.dataBoundary === "unassessed")
        out.push(finding(agent, "high", `Hosted agent with an unassessed data boundary: ${a.title}`, { target: { type: "agent", id: a.id }, owningTeam: a.owningTeam, recommendedAction: "Record where this agent's inputs go before anyone gives it company information." }));
      if (a.dataBoundary === "vendor-consumer")
        out.push(finding(agent, "high", `Active agent on a consumer account: ${a.title}`, { target: { type: "agent", id: a.id }, owningTeam: a.owningTeam, recommendedAction: "Consumer accounts may only ever receive public information. Move it into the tenant or restrict its use." }));
      if (!a.owner.trim())
        out.push(finding(agent, "medium", `Hosted agent with no named owner: ${a.title}`, { target: { type: "agent", id: a.id }, owningTeam: a.owningTeam, recommendedAction: "Name the human accountable for this agent's behaviour." }));
      if (!a.evaluation)
        out.push(finding(agent, "medium", `Active agent with no recorded evaluation: ${a.title}`, { target: { type: "agent", id: a.id }, owningTeam: a.owningTeam, recommendedAction: "Run its test cases and record the date, the reviewer and the pass count." }));
    }
  }
  return out;
};

const IMPLEMENTATIONS: Record<string, Impl> = { coverage, freshness, relationships, duplicates, pipeline, assurance };

export function runAgent(agent: AgentDefinition, ctx: AgentContext): { findings: AgentFinding[]; skipped?: string } {
  if (agent.status !== "active") return { findings: [], skipped: `agent is ${agent.status}` };
  if (agent.kind === "ai-assisted") return { findings: [], skipped: "AI-assisted agents run only with a configured provider and an explicit request" };
  const impl = IMPLEMENTATIONS[agent.implementation];
  if (!impl) return { findings: [], skipped: `no implementation for ${agent.implementation}` };
  return { findings: impl(agent, ctx) };
}

export const SEVERITY_ORDER: FindingSeverity[] = ["high", "medium", "low", "info"];

export function summarizeFindings(findings: AgentFinding[]): Record<FindingSeverity, number> {
  return findings.reduce((acc, f) => ((acc[f.severity] = (acc[f.severity] ?? 0) + 1), acc), { high: 0, medium: 0, low: 0, info: 0 } as Record<FindingSeverity, number>);
}

export const maturityLabel = (m?: string) => (m && m in MATURITY_MODEL ? `${m} ${MATURITY_MODEL[m as keyof typeof MATURITY_MODEL].label}` : "not assessed");
