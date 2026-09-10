import "server-only";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import YAML from "yaml";
import { eq, and, desc } from "drizzle-orm";
import type { AgentRun, AuditEvent, ImportedContent } from "@/domain";
import { AgentRun as AgentRunSchema, AuditEvent as AuditEventSchema } from "@/domain";
import { getConfig } from "@/server/config";
import { getDb, schema } from "@/server/db/client";
import { clearRegistryCache } from "./registry";
import { invalidateSnapshot } from "./postgres";

/**
 * Registry writer — the only path that mutates governed state.
 * file mode:     writes YAML/JSON under content/ and JSONL under var/audit
 * postgres mode: writes rows; the read snapshot is invalidated afterwards
 */
export interface RegistryWriter {
  readonly mode: "file" | "postgres";
  upsertRecord(type: string, record: { id: string; title?: string; owningTeam?: string; classification?: string; status?: string; searchText?: string; data: Record<string, unknown> }, actor: string): Promise<void>;
  upsertImportedContent(content: ImportedContent): Promise<void>;
  registerSourceFile(file: { id: string; path: string; mediaType: string; label: string; storage: "local" | "s3"; storageKey: string; bytes: number; uploadedBy: string }): Promise<void>;
  appendAudit(event: Omit<AuditEvent, "id" | "at">): Promise<AuditEvent> | AuditEvent;
  listAudit(limit: number): Promise<AuditEvent[]>;
  appendAgentRun(run: AgentRun): Promise<void>;
  listAgentRuns(limit: number): Promise<AgentRun[]>;
}

/** Which registry directory a record type is stored in (file mode). */
const FILE_LOCATIONS: Record<string, { dir: string; perFile: boolean }> = {
  sop: { dir: "sops", perFile: true },
};

class FileWriter implements RegistryWriter {
  readonly mode = "file" as const;
  private memoryAudit: AuditEvent[] = [];
  async upsertRecord(type: string, record: { id: string; data: Record<string, unknown> }) {
    const loc = FILE_LOCATIONS[type];
    if (!loc?.perFile) throw new Error(`File-mode writes are supported for SOPs only (got ${type}). Use CLOUDBASE_STORAGE=postgres for other entities.`);
    const file = path.join(getConfig().contentDir, "registry", loc.dir, `${record.id}.yaml`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, YAML.stringify(record.data, { lineWidth: 0 }));
    fs.renameSync(tmp, file);
    clearRegistryCache();
  }
  async upsertImportedContent(content: ImportedContent) {
    const file = path.join(getConfig().contentDir, "knowledge", "imported", "sop-content.json");
    const existing: ImportedContent[] = fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as ImportedContent[]) : [];
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify([...existing.filter((r) => r.id !== content.id), content], null, 2));
    clearRegistryCache();
  }
  async registerSourceFile() {
    /* file mode: the SOP record's sourceFile pointer is the registration */
  }
  appendAudit(event: Omit<AuditEvent, "id" | "at">): AuditEvent {
    const full: AuditEvent = { id: randomUUID(), at: new Date().toISOString(), ...event, detail: event.detail ?? {} };
    const dir = getConfig().auditDir;
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(path.join(dir, `${full.at.slice(0, 10)}.jsonl`), JSON.stringify(full) + "\n");
    } catch {
      this.memoryAudit.push(full);
    }
    return full;
  }
  async listAudit(limit: number) {
    const dir = getConfig().auditDir;
    const events: AuditEvent[] = [...this.memoryAudit];
    if (fs.existsSync(dir)) {
      for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".jsonl") && !f.startsWith("agent-runs")).sort().reverse().slice(0, 7)) {
        for (const line of fs.readFileSync(path.join(dir, file), "utf8").split("\n")) {
          if (!line.trim()) continue;
          const parsed = AuditEventSchema.safeParse(JSON.parse(line));
          if (parsed.success) events.push(parsed.data);
        }
      }
    }
    return events.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
  }
  private runsFile() {
    return path.join(getConfig().auditDir, "agent-runs.jsonl");
  }
  async appendAgentRun(run: AgentRun) {
    try {
      fs.mkdirSync(path.dirname(this.runsFile()), { recursive: true });
      fs.appendFileSync(this.runsFile(), JSON.stringify(run) + "\n");
    } catch {
      /* audit dir unavailable */
    }
  }
  async listAgentRuns(limit: number) {
    if (!fs.existsSync(this.runsFile())) return [];
    return fs
      .readFileSync(this.runsFile(), "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => AgentRunSchema.safeParse(JSON.parse(l)))
      .filter((r): r is { success: true; data: AgentRun } => r.success)
      .map((r) => r.data)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      .slice(0, limit);
  }
}

class PostgresWriter implements RegistryWriter {
  readonly mode = "postgres" as const;
  async upsertRecord(type: string, record: { id: string; title?: string; owningTeam?: string; classification?: string; status?: string; searchText?: string; data: Record<string, unknown> }, actor: string) {
    const db = getDb();
    const row = { type, id: record.id, title: record.title ?? String(record.data.title ?? ""), owningTeam: record.owningTeam ?? String(record.data.owningTeam ?? ""), classification: record.classification ?? String(record.data.classification ?? "internal"), status: record.status ?? String(record.data.status ?? ""), searchText: record.searchText ?? "", data: record.data, updatedBy: actor, updatedAt: new Date() };
    await db
      .insert(schema.governedRecords)
      .values(row)
      .onConflictDoUpdate({ target: [schema.governedRecords.type, schema.governedRecords.id], set: { ...row, version: undefined } });
    invalidateSnapshot();
  }
  async upsertImportedContent(content: ImportedContent) {
    const db = getDb();
    await db.insert(schema.importedContent).values({ id: content.id, sourcePath: content.sourcePath, data: content, updatedAt: new Date() }).onConflictDoUpdate({ target: schema.importedContent.id, set: { sourcePath: content.sourcePath, data: content, updatedAt: new Date() } });
    invalidateSnapshot();
  }
  async registerSourceFile(file: { id: string; path: string; mediaType: string; label: string; storage: "local" | "s3"; storageKey: string; bytes: number; uploadedBy: string }) {
    await getDb().insert(schema.sourceFiles).values(file).onConflictDoUpdate({ target: schema.sourceFiles.id, set: file });
  }
  async appendAudit(event: Omit<AuditEvent, "id" | "at">): Promise<AuditEvent> {
    const full: AuditEvent = { id: randomUUID(), at: new Date().toISOString(), ...event, detail: event.detail ?? {} };
    try {
      await getDb().insert(schema.auditEvents).values({ id: full.id, at: new Date(full.at), actor: full.actor, action: full.action, targetType: full.target?.type, targetId: full.target?.id, outcome: full.outcome, detail: full.detail });
    } catch (error) {
      console.error("[audit] write failed", error);
    }
    return full;
  }
  async listAudit(limit: number) {
    const rows = await getDb().select().from(schema.auditEvents).orderBy(desc(schema.auditEvents.at)).limit(limit);
    return rows.map((r) => AuditEventSchema.parse({ id: r.id, at: r.at.toISOString(), actor: r.actor, action: r.action, target: r.targetType && r.targetId ? { type: r.targetType, id: r.targetId } : undefined, outcome: r.outcome, detail: r.detail }));
  }
  async appendAgentRun(run: AgentRun) {
    await getDb().insert(schema.agentRuns).values({ id: run.id, agentId: run.agentId, startedAt: new Date(run.startedAt), finishedAt: new Date(run.finishedAt), actor: run.actor, status: run.status, findingCount: run.findingCount, summary: run.summary });
  }
  async listAgentRuns(limit: number) {
    const rows = await getDb().select().from(schema.agentRuns).orderBy(desc(schema.agentRuns.startedAt)).limit(limit);
    return rows.map((r) => ({ id: r.id, agentId: r.agentId, startedAt: r.startedAt.toISOString(), finishedAt: r.finishedAt.toISOString(), actor: r.actor, status: r.status as AgentRun["status"], findingCount: r.findingCount, summary: r.summary }));
  }
}

let writer: RegistryWriter | null = null;
export function getRegistryWriter(): RegistryWriter {
  if (writer) return writer;
  writer = getConfig().storage.mode === "postgres" ? new PostgresWriter() : new FileWriter();
  return writer;
}
export function resetWriterForTests() {
  writer = null;
}
void eq;
void and;
