import path from "node:path";
import { z } from "zod";
import {
  Account,
  Activity,
  AgentDefinition,
  Automation,
  Capability,
  CapabilityCluster,
  Contact,
  Copilot,
  Decision,
  Evaluation,
  Evidence,
  Experiment,
  Idea,
  ImportedContent,
  Opportunity,
  ProjectReference,
  Relationship,
  ResearchDocument,
  RfpRecord,
  Role,
  RndProject,
  Solution,
  Sop,
  Team,
  TechnicalDocument,
} from "@/domain";
import { loadJsonCollection, loadMarkdownDir, loadYamlCollection } from "./registry";
import type { Repositories } from "./interfaces";

/**
 * Git-versioned file registry under `content/`.
 *
 *   content/registry/teams.yaml, roles.yaml, relationships.yaml
 *   content/registry/sops/*.yaml
 *   content/registry/cros/*.yaml
 *   content/registry/copilots|automations|project-references|research|rfp/*.yaml
 *   content/knowledge/imported/sop-content.json
 *   content/docs/** /*.md   (frontmatter = TechnicalDocument metadata, body = markdown)
 */

const byId = <T extends { id: string }>(items: T[]) => new Map(items.map((i) => [i.id, i]));

/** Frontmatter schema for markdown documentation. */
const DocFrontmatter = TechnicalDocument.omit({ body: true, slug: true }).partial({ id: true, title: true, owningTeam: true, category: true, domain: true });

export function createFileRepositories(contentDir: string): Repositories {
  const reg = (...p: string[]) => path.join(contentDir, "registry", ...p);

  const teams = () => loadYamlCollection(reg("teams.yaml"), Team).sort((a, b) => a.sortOrder - b.sortOrder);
  const roles = () => loadYamlCollection(reg("roles.yaml"), Role);
  const sops = () => loadYamlCollection(reg("sops"), Sop);
  const imported = () => loadJsonCollection(path.join(contentDir, "knowledge", "imported", "sop-content.json"), ImportedContent);
  const rnd = () => loadYamlCollection(reg("cros", "rnd-projects.yaml"), RndProject);
  const caps = () => loadYamlCollection(reg("cros", "capabilities.yaml"), Capability);
  const clusters = () => loadYamlCollection(reg("cros", "clusters.yaml"), CapabilityCluster);
  const copilots = () => loadYamlCollection(reg("copilots"), Copilot);
  const automations = () => loadYamlCollection(reg("automations"), Automation);
  const projects = () => loadYamlCollection(reg("project-references"), ProjectReference);
  const research = () => loadYamlCollection(reg("research"), ResearchDocument);
  const rfp = () => loadYamlCollection(reg("rfp"), RfpRecord);
  const relationships = () => loadYamlCollection(reg("relationships.yaml"), Relationship);

  const docs = (): TechnicalDocument[] =>
    loadMarkdownDir(path.join(contentDir, "docs")).map((record) => {
      const fm = DocFrontmatter.parse(record.frontmatter);
      const id = fm.id ?? record.slug.split("/").pop() ?? record.slug;
      const parsed = TechnicalDocument.safeParse({
        ...fm,
        id,
        title: fm.title ?? id,
        owningTeam: fm.owningTeam ?? "company-wide",
        category: fm.category ?? "General",
        domain: fm.domain ?? record.slug.split("/")[0] ?? "General",
        slug: record.slug,
        body: record.body,
      });
      if (!parsed.success) {
        throw new Error(`Invalid documentation frontmatter in ${record.file}: ${z.prettifyError(parsed.error)}`);
      }
      return parsed.data;
    });

  const accounts = () => loadYamlCollection(reg("crm", "accounts.yaml"), Account);
  const contacts = () => loadYamlCollection(reg("crm", "contacts.yaml"), Contact);
  const opportunities = () => loadYamlCollection(reg("crm", "opportunities.yaml"), Opportunity);
  const agents = () => loadYamlCollection(reg("agents"), AgentDefinition);
  const solutions = () => loadYamlCollection(reg("solutions"), Solution);

  return {
    crm: {
      accounts,
      account: (id) => byId(accounts()).get(id),
      contacts,
      contact: (id) => byId(contacts()).get(id),
      opportunities,
      opportunity: (id) => byId(opportunities()).get(id),
      activities: () => loadYamlCollection(reg("crm", "activities.yaml"), Activity),
    },
    agents: { list: agents, get: (id) => byId(agents()).get(id) },
    solutions: { list: solutions, get: (id) => byId(solutions()).get(id) },
    teams: { list: teams, get: (id) => byId(teams()).get(id) },
    roles: { list: roles },
    sops: {
      list: sops,
      get: (id) => byId(sops()).get(id),
      importedContent: (id) => byId(imported()).get(id),
      allImportedContent: imported,
    },
    cros: {
      source: "local-registry",
      rndProjects: rnd,
      rndProject: (id) => byId(rnd()).get(id),
      capabilities: caps,
      capability: (id) => byId(caps()).get(id),
      clusters,
      cluster: (id) => byId(clusters()).get(id),
      ideas: () => loadYamlCollection(reg("cros", "ideas.yaml"), Idea),
      evaluations: () => loadYamlCollection(reg("cros", "evaluations.yaml"), Evaluation),
      evidence: () => loadYamlCollection(reg("cros", "evidence.yaml"), Evidence),
      experiments: () => loadYamlCollection(reg("cros", "experiments.yaml"), Experiment),
      decisions: () => loadYamlCollection(reg("cros", "decisions.yaml"), Decision),
    },
    copilots: { list: copilots, get: (id) => byId(copilots()).get(id) },
    automations: { list: automations, get: (id) => byId(automations()).get(id) },
    projectReferences: { list: projects, get: (id) => byId(projects()).get(id) },
    research: { list: research, get: (id) => byId(research()).get(id) },
    rfp: { list: rfp, get: (id) => byId(rfp()).get(id) },
    docs: { list: docs, get: (id) => docs().find((d) => d.id === id || d.slug === id) },
    relationships: { list: relationships },
  };
}
