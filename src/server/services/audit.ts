import "server-only";
import { AuditEvent } from "@/domain";
import { getRegistryWriter } from "@/server/repositories/writer";

/**
 * Append-only audit log. Sink depends on storage mode: JSON lines under
 * var/audit (file) or the audit_events table (postgres).
 *
 * Returns a promise that callers in a write path MUST await. It was previously
 * fire-and-forget, which loses events: a floating promise is only as reliable
 * as the process outliving it, and a serverless instance is free to freeze the
 * moment a response is sent. An approval that happened but was never recorded
 * is worse than a slow page — the audit trail exists precisely for the actions
 * nobody can afford to lose.
 *
 * It never throws: a failing sink is logged, and the caller's own result is
 * unaffected.
 */
export async function recordAudit(event: Omit<AuditEvent, "id" | "at">): Promise<void> {
  try {
    await getRegistryWriter().appendAudit(event);
  } catch (error) {
    console.error("[audit] write failed", error, { action: event.action, actor: event.actor });
  }
}

export async function listAuditEvents(limit = 200): Promise<AuditEvent[]> {
  return getRegistryWriter().listAudit(limit);
}

export { AuditEvent };
