import "server-only";
import type { ZodType } from "zod";
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
  Sop,
  Team,
  TechnicalDocument,
} from "@/domain";
import { getDb, schema } from "@/server/db/client";
import type { Repositories } from "./interfaces";

/**
 * PostgreSQL-backed repositories.
 *
 * The registry is small (hundreds of records), so the whole governed state is
 * loaded into an in-memory snapshot once per request window (TTL) and served
 * through the same synchronous `Repositories` interface the services already
 * use. Writes go through the RegistryWriter and invalidate the snapshot.
 */

const TTL_MS = 15_000;

interface Snapshot {
  loadedAt: number;
  byType: Map<string, unknown[]>;
  imported: ImportedContent[];
  relationships: Relationship[];
}

let snapshot: Snapshot | null = null;
let loading: Promise<Snapshot> | null = null;

export function invalidateSnapshot() {
  snapshot = null;
}

const parseAll = <T>(name: string, rows: unknown[], s: ZodType<T>): T[] =>
  rows.map((r, i) => {
    const result = s.safeParse(r);
    if (!result.success) throw new Error(`Invalid ${name} record #${i} in database: ${result.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")}`);
    return result.data;
  });

async function load(): Promise<Snapshot> {
  const db = getDb();
  const [records, imported, rels] = await Promise.all([db.select({ type: schema.governedRecords.type, data: schema.governedRecords.data }).from(schema.governedRecords), db.select({ data: schema.importedContent.data }).from(schema.importedContent), db.select().from(schema.relationships)]);
  const byType = new Map<string, unknown[]>();
  for (const r of records) byType.set(r.type, [...(byType.get(r.type) ?? []), r.data]);
  return {
    loadedAt: Date.now(),
    byType,
    imported: parseAll("imported_content", imported.map((r) => r.data), ImportedContent),
    relationships: parseAll("relationships", rels.map((r) => ({ from: { type: r.fromType, id: r.fromId }, to: { type: r.toType, id: r.toId }, type: r.type, confidence: r.confidence, note: r.note })), Relationship),
  };
}

/** Ensures a fresh snapshot exists. Called once per request (layouts, routes, actions). */
export async function ensureSnapshot(): Promise<void> {
  if (snapshot && Date.now() - snapshot.loadedAt < TTL_MS) return;
  if (!loading) loading = load().finally(() => (loading = null));
  try {
    snapshot = await loading;
  } catch (error) {
    // A database that is unreachable, unmigrated or unseeded would otherwise
    // surface as a raw driver stack on every page. Say what to do instead.
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `CloudBase is configured to serve governed records from PostgreSQL (CLOUDBASE_STORAGE=postgres) but the database could not be read: ${reason}\n` +
        `Check that DATABASE_URL is reachable from this machine, then run \`npm run db:migrate\` and \`npm run db:seed\`. ` +
        `To go back to the git-versioned file registry, unset CLOUDBASE_STORAGE (or set it to "file").`,
      { cause: error },
    );
  }
}

function current(): Snapshot {
  if (!snapshot) throw new Error("Database snapshot not loaded — call ensureRepositories() before reading governed data.");
  return snapshot;
}

export function createPostgresRepositories(): Repositories {
  const list = <T>(type: string, s: ZodType<T>): T[] => parseAll(type, current().byType.get(type) ?? [], s);
  const byId = <T extends { id: string }>(items: T[]) => new Map(items.map((i) => [i.id, i]));
  const teams = () => list("team", Team).sort((a, b) => a.sortOrder - b.sortOrder);
  const sops = () => list("sop", Sop);
  const rnd = () => list("rnd-project", RndProject);
  const caps = () => list("capability", Capability);
  const clusters = () => list("capability-cluster", CapabilityCluster);
  const copilots = () => list("copilot", Copilot);
  const automations = () => list("automation", Automation);
  const projects = () => list("project-reference", ProjectReference);
  const research = () => list("research", ResearchDocument);
  const rfp = () => list("rfp", RfpRecord);
  const docs = () => list("documentation", TechnicalDocument);
  const accounts = () => list("account", Account);
  const contacts = () => list("contact", Contact);
  const opportunities = () => list("opportunity", Opportunity);
  const agents = () => list("agent", AgentDefinition);
  return {
    crm: { accounts, account: (id) => byId(accounts()).get(id), contacts, contact: (id) => byId(contacts()).get(id), opportunities, opportunity: (id) => byId(opportunities()).get(id), activities: () => list("activity", Activity) },
    agents: { list: agents, get: (id) => byId(agents()).get(id) },
    teams: { list: teams, get: (id) => byId(teams()).get(id) },
    roles: { list: () => list("role", Role) },
    sops: { list: sops, get: (id) => byId(sops()).get(id), importedContent: (id) => current().imported.find((c) => c.id === id), allImportedContent: () => current().imported },
    cros: {
      source: "local-registry",
      rndProjects: rnd,
      rndProject: (id) => byId(rnd()).get(id),
      capabilities: caps,
      capability: (id) => byId(caps()).get(id),
      clusters,
      cluster: (id) => byId(clusters()).get(id),
      ideas: () => list("idea", Idea),
      evaluations: () => list("evaluation", Evaluation),
      evidence: () => list("evidence", Evidence),
      experiments: () => list("experiment", Experiment),
      decisions: () => list("decision", Decision),
    },
    copilots: { list: copilots, get: (id) => byId(copilots()).get(id) },
    automations: { list: automations, get: (id) => byId(automations()).get(id) },
    projectReferences: { list: projects, get: (id) => byId(projects()).get(id) },
    research: { list: research, get: (id) => byId(research()).get(id) },
    rfp: { list: rfp, get: (id) => byId(rfp()).get(id) },
    docs: { list: docs, get: (id) => docs().find((d) => d.id === id || d.slug === id) },
    relationships: { list: () => current().relationships },
  };
}
