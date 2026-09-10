import type { MaturityLevel } from "@/domain";
import { MATURITY_MODEL } from "@/domain";
import type { Repositories } from "@/server/repositories/interfaces";

/**
 * Read-only CROS views. CloudBase never mutates CROS; future governed write
 * flows (idea → copilot draft → human confirm → submission) will be added as a
 * separate service behind `rnd.submit`/`rnd.approve`.
 */

export interface PortfolioSummary {
  source: Repositories["cros"]["source"];
  counts: { projects: number; capabilities: number; clusters: number; ideas: number; evaluations: number; evidence: number; experiments: number; decisions: number };
  byMaturity: Array<{ level: MaturityLevel; label: string; projects: number; capabilities: number }>;
  unassessed: { projects: number; capabilities: number };
  byStatus: Record<string, number>;
}

export function portfolioSummary(repos: Repositories): PortfolioSummary {
  const cros = repos.cros;
  const projects = cros.rndProjects();
  const capabilities = cros.capabilities();
  const levels = Object.keys(MATURITY_MODEL) as MaturityLevel[];
  const byStatus: Record<string, number> = {};
  for (const p of projects) byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;
  return {
    source: cros.source,
    counts: {
      projects: projects.length,
      capabilities: capabilities.length,
      clusters: cros.clusters().length,
      ideas: cros.ideas().length,
      evaluations: cros.evaluations().length,
      evidence: cros.evidence().length,
      experiments: cros.experiments().length,
      decisions: cros.decisions().length,
    },
    byMaturity: levels.map((level) => ({
      level,
      label: MATURITY_MODEL[level].label,
      projects: projects.filter((p) => p.maturity === level).length,
      capabilities: capabilities.filter((c) => c.maturity === level).length,
    })),
    unassessed: { projects: projects.filter((p) => !p.maturity).length, capabilities: capabilities.filter((c) => !c.maturity).length },
    byStatus,
  };
}
