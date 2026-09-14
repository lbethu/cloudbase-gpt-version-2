/**
 * Seeds the PostgreSQL registry from the git-versioned content/ directory.
 *
 *   npm run db:seed
 *
 * Idempotent: every record is upserted on (type, id), so re-running after a
 * registry change brings the database back in line without duplicating rows.
 * It never deletes governed records that only exist in the database (records
 * created through the app's own approval workflows), unless --prune is passed.
 *
 * This is a migration/administration tool, not application code: it runs with
 * whatever DATABASE_URL is in the environment and writes no audit events.
 */
import { config as loadEnv } from "dotenv";

// Match Next.js: .env.local wins over .env, and neither is committed.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });
import { createFileRepositories } from "../src/server/repositories/file-registry";
import { getDb, closeDb, schema } from "../src/server/db/client";
import { getConfig } from "../src/server/config";

type Rec = { id: string; title?: string; owningTeam?: string; classification?: string; status?: string; [k: string]: unknown };

const text = (...parts: unknown[]) =>
  parts
    .filter((p) => typeof p === "string" && p.trim())
    .join(" ")
    .slice(0, 20_000);

async function main() {
  const prune = process.argv.includes("--prune");
  const cfg = getConfig();
  if (!cfg.database.url) throw new Error("DATABASE_URL is not set — nothing to seed into.");
  const repos = createFileRepositories(cfg.contentDir);
  const db = getDb();

  const groups: Array<[string, Rec[]]> = [
    ["team", repos.teams.list() as unknown as Rec[]],
    ["role", repos.roles.list() as unknown as Rec[]],
    ["sop", repos.sops.list() as unknown as Rec[]],
    ["rnd-project", repos.cros.rndProjects() as unknown as Rec[]],
    ["capability", repos.cros.capabilities() as unknown as Rec[]],
    ["capability-cluster", repos.cros.clusters() as unknown as Rec[]],
    ["idea", repos.cros.ideas() as unknown as Rec[]],
    ["evaluation", repos.cros.evaluations() as unknown as Rec[]],
    ["evidence", repos.cros.evidence() as unknown as Rec[]],
    ["experiment", repos.cros.experiments() as unknown as Rec[]],
    ["decision", repos.cros.decisions() as unknown as Rec[]],
    ["copilot", repos.copilots.list() as unknown as Rec[]],
    ["automation", repos.automations.list() as unknown as Rec[]],
    ["project-reference", repos.projectReferences.list() as unknown as Rec[]],
    ["research", repos.research.list() as unknown as Rec[]],
    ["rfp", repos.rfp.list() as unknown as Rec[]],
    ["documentation", repos.docs.list() as unknown as Rec[]],
    ["account", repos.crm.accounts() as unknown as Rec[]],
    ["contact", repos.crm.contacts() as unknown as Rec[]],
    ["opportunity", repos.crm.opportunities() as unknown as Rec[]],
    ["activity", repos.crm.activities() as unknown as Rec[]],
    ["agent", repos.agents.list() as unknown as Rec[]],
    ["solution", repos.solutions.list() as unknown as Rec[]],
  ];

  let written = 0;
  for (const [type, records] of groups) {
    for (const record of records) {
      const row = {
        type,
        id: record.id,
        title: String(record.title ?? record.id),
        owningTeam: String(record.owningTeam ?? ""),
        classification: String(record.classification ?? "internal"),
        status: String(record.status ?? ""),
        searchText: text(record.title, record.summary, record.description, record.body),
        data: record as Record<string, unknown>,
        updatedBy: "seed",
        updatedAt: new Date(),
      };
      await db
        .insert(schema.governedRecords)
        .values(row)
        .onConflictDoUpdate({ target: [schema.governedRecords.type, schema.governedRecords.id], set: row });
      written++;
    }
    if (records.length) console.log(`  ${type.padEnd(20)} ${records.length}`);
  }

  const imported = repos.sops.allImportedContent();
  for (const content of imported) {
    await db
      .insert(schema.importedContent)
      .values({ id: content.id, sourcePath: content.sourcePath, data: content, updatedAt: new Date() })
      .onConflictDoUpdate({ target: schema.importedContent.id, set: { sourcePath: content.sourcePath, data: content, updatedAt: new Date() } });
  }
  console.log(`  ${"imported-content".padEnd(20)} ${imported.length} (${imported.reduce((n, c) => n + c.chunks.length, 0)} passages)`);

  const rels = repos.relationships.list();
  await db.delete(schema.relationships);
  if (rels.length) {
    await db.insert(schema.relationships).values(rels.map((r) => ({ fromType: r.from.type, fromId: r.from.id, toType: r.to.type, toId: r.to.id, type: r.type, confidence: r.confidence ?? "declared", note: r.note ?? "" })));
  }
  console.log(`  ${"relationships".padEnd(20)} ${rels.length}`);

  if (prune) {
    const keep = new Set(groups.flatMap(([type, records]) => records.map((r) => `${type}:${r.id}`)));
    const existing = await db.select({ type: schema.governedRecords.type, id: schema.governedRecords.id }).from(schema.governedRecords);
    const stale = existing.filter((r) => !keep.has(`${r.type}:${r.id}`));
    console.log(`  prune: ${stale.length} database-only record(s) would be removed — review before enabling deletes.`);
  }

  console.log(`\nSeeded ${written} governed records into ${cfg.database.url.replace(/:[^:@/]+@/, ":***@")}`);
  console.log(`Set CLOUDBASE_STORAGE=postgres to serve from the database.`);
  await closeDb();
}

main().catch(async (error) => {
  console.error(error);
  await closeDb().catch(() => {});
  process.exit(1);
});
