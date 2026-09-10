import "server-only";
import type { AgentFinding, KnowledgeItem } from "@/domain";
import { MATURITY_MODEL, type MaturityLevel } from "@/domain";
import type { Identity } from "@/server/auth/identity";
import { can } from "@/server/authz";
import { getRepositories } from "@/server/repositories";
import { agentFindings } from "./agents";
import { crmOpportunities, pipelineSummary } from "./crm";
import { deriveReviewTasks } from "./reviews";
import { permittedItems } from "./search";

export type DashboardRole = "leadership" | "sales" | "gis" | "field" | "operations" | "ai";

export const DASHBOARDS: Record<DashboardRole, { title: string; description: string; teams: string[]; audience: string }> = {
  leadership: { title: "Leadership", description: "What Cloudpoint is researching, what capabilities are emerging, what needs approval, and where knowledge is stale.", teams: ["leadership", "rnd", "company-wide"], audience: "leadership" },
  sales: { title: "Sales / Business Development", description: "Pipeline health, RFP decisions, proposal SOPs and the project references that win work.", teams: ["sales-bd"], audience: "sales" },
  gis: { title: "GIS / Technical", description: "Engineering documentation, capabilities, copilots and the R&D that affects delivery.", teams: ["technical-gis"], audience: "gis" },
  field: { title: "Field / Reality Capture", description: "Safety, readiness and capture guidance, plus the indoor-intelligence R&D that field data feeds.", teams: ["field-reality-capture"], audience: "field" },
  operations: { title: "Operations / Admin", description: "Finance, startup and close-out SOPs, review cadence and duplicates.", teams: ["operations-admin"], audience: "operations" },
  ai: { title: "AI / Automation", description: "Copilots, automations, agents, and the platform's own governance.", teams: ["ai-automation"], audience: "ai" },
};

export const isDashboardRole = (v: string): v is DashboardRole => v in DASHBOARDS;

export interface DashboardData {
  role: DashboardRole;
  items: KnowledgeItem[];
  teamItems: KnowledgeItem[];
  findings: AgentFinding[];
  reviewCount: number;
  maturity: Array<{ level: MaturityLevel; label: string; count: number }>;
  sopStatus: Array<{ label: string; value: number; tone: "success" | "warning" | "neutral" }>;
  pipeline?: ReturnType<typeof pipelineSummary> & { source: string; live: boolean };
  typeCounts: Record<string, number>;
}

export async function dashboardData(identity: Identity, role: DashboardRole): Promise<DashboardData> {
  const def = DASHBOARDS[role];
  const repos = getRepositories();
  const items = permittedItems(identity);
  const teamItems = items.filter((i) => i.ref.type !== "team" && (role === "leadership" || def.teams.includes(i.owningTeam) || i.teams.some((t) => def.teams.includes(t))));
  const { findings } = await agentFindings(identity, { audience: def.audience });
  const scoped = findings.filter((f) => !f.owningTeam || def.teams.includes(f.owningTeam) || role === "leadership" || role === "ai");
  const reviewCount = can(identity, "review.read") ? deriveReviewTasks(repos).filter((t) => can(identity, t.requiredPermission) && (role === "leadership" || def.teams.includes(t.owningTeam))).length : 0;
  const levels = Object.keys(MATURITY_MODEL) as MaturityLevel[];
  const maturity = levels.map((level) => ({ level, label: MATURITY_MODEL[level].label, count: repos.cros.rndProjects().filter((p) => p.maturity === level).length + repos.cros.capabilities().filter((c) => c.maturity === level).length }));
  const sops = items.filter((i) => i.ref.type === "sop");
  const sopStatus = [
    { label: "Approved", value: sops.filter((s) => s.status === "Approved").length, tone: "success" as const },
    { label: "In review", value: sops.filter((s) => s.status === "In review").length, tone: "warning" as const },
    { label: "Draft", value: sops.filter((s) => s.status === "Draft").length, tone: "neutral" as const },
    { label: "Superseded / historical", value: sops.filter((s) => s.status === "Superseded" || s.status === "Historical").length, tone: "neutral" as const },
  ];
  let pipeline: DashboardData["pipeline"];
  if ((role === "sales" || role === "leadership") && can(identity, "crm.read")) {
    const opps = await crmOpportunities(identity);
    pipeline = { ...pipelineSummary(opps.items), source: opps.source.connector, live: opps.source.live };
  }
  const typeCounts = teamItems.reduce<Record<string, number>>((acc, i) => ((acc[i.ref.type] = (acc[i.ref.type] ?? 0) + 1), acc), {});
  return { role, items, teamItems, findings: scoped, reviewCount, maturity, sopStatus, pipeline, typeCounts };
}
