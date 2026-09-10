import { index, integer, jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

/**
 * CloudBase PostgreSQL schema.
 *
 * Governed objects are stored as validated JSON documents (`data` always passes
 * the entity's Zod schema before it is written) with the columns needed for
 * authorization, listing and search promoted alongside. This keeps one source
 * of truth per record, supports every entity type without a table per type,
 * and lets the registry files be seeded in unchanged. Forward-only migrations
 * live in /drizzle.
 */

export const governedRecords = pgTable(
  "governed_records",
  {
    type: text("type").notNull(), // sop | documentation | rnd-project | … | team | role | synonym-group
    id: text("id").notNull(),
    tenantId: text("tenant_id").notNull().default("cloudpoint"),
    title: text("title").notNull().default(""),
    owningTeam: text("owning_team").notNull().default(""),
    classification: text("classification").notNull().default("internal"),
    status: text("status").notNull().default(""),
    searchText: text("search_text").notNull().default(""),
    data: jsonb("data").notNull(),
    version: integer("version").notNull().default(1),
    updatedBy: text("updated_by").notNull().default("seed"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.type, t.id] }), index("governed_records_type_idx").on(t.type), index("governed_records_team_idx").on(t.owningTeam), index("governed_records_updated_idx").on(t.updatedAt)],
);

export const relationships = pgTable(
  "relationships",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    fromType: text("from_type").notNull(),
    fromId: text("from_id").notNull(),
    toType: text("to_type").notNull(),
    toId: text("to_id").notNull(),
    type: text("type").notNull(),
    confidence: text("confidence").notNull().default("declared"),
    note: text("note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("relationships_from_idx").on(t.fromType, t.fromId), index("relationships_to_idx").on(t.toType, t.toId)],
);

export const importedContent = pgTable("imported_content", {
  id: text("id").primaryKey(),
  sourcePath: text("source_path").notNull(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sourceFiles = pgTable("source_files", {
  id: text("id").primaryKey(),
  path: text("path").notNull(),
  mediaType: text("media_type").notNull(),
  label: text("label").notNull().default(""),
  storage: text("storage").notNull().default("local"), // local | s3
  storageKey: text("storage_key").notNull(),
  bytes: integer("bytes").notNull().default(0),
  uploadedBy: text("uploaded_by").notNull().default(""),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditEvents = pgTable(
  "audit_events",
  {
    id: text("id").primaryKey(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
    actor: text("actor").notNull(),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    outcome: text("outcome").notNull(),
    detail: jsonb("detail").notNull().default({}),
  },
  (t) => [index("audit_events_at_idx").on(t.at), index("audit_events_actor_idx").on(t.actor)],
);

export const agentRuns = pgTable("agent_runs", {
  id: text("id").primaryKey(),
  agentId: text("agent_id").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true }).notNull(),
  actor: text("actor").notNull(),
  status: text("status").notNull(),
  findingCount: integer("finding_count").notNull().default(0),
  summary: text("summary").notNull().default(""),
});
