import "server-only";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { AuditEvent } from "@/domain";
import { getConfig } from "@/server/config";

/**
 * Append-only audit log. Phase 1 writes JSON lines to `var/audit/<date>.jsonl`
 * (git-ignored). The write path is isolated here so a database sink can
 * replace it without touching callers.
 */

const memoryFallback: AuditEvent[] = [];

export function recordAudit(event: Omit<AuditEvent, "id" | "at">): AuditEvent {
  const full: AuditEvent = { id: randomUUID(), at: new Date().toISOString(), ...event, detail: event.detail ?? {} };
  const dir = getConfig().auditDir;
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, `${full.at.slice(0, 10)}.jsonl`), JSON.stringify(full) + "\n");
  } catch {
    memoryFallback.push(full);
  }
  return full;
}

export function listAuditEvents(limit = 200): AuditEvent[] {
  const dir = getConfig().auditDir;
  const events: AuditEvent[] = [...memoryFallback];
  if (fs.existsSync(dir)) {
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".jsonl"))
      .sort()
      .reverse()
      .slice(0, 7);
    for (const file of files) {
      for (const line of fs.readFileSync(path.join(dir, file), "utf8").split("\n")) {
        if (!line.trim()) continue;
        const parsed = AuditEvent.safeParse(JSON.parse(line));
        if (parsed.success) events.push(parsed.data);
      }
    }
  }
  return events.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
