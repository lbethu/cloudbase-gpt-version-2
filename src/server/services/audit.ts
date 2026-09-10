import "server-only";
import { AuditEvent } from "@/domain";
import { getRegistryWriter } from "@/server/repositories/writer";

/**
 * Append-only audit log. Sink depends on storage mode: JSON lines under
 * var/audit (file) or the audit_events table (postgres). Fire-and-forget so a
 * slow sink never blocks a page.
 */
export function recordAudit(event: Omit<AuditEvent, "id" | "at">): void {
  const result = getRegistryWriter().appendAudit(event);
  if (result instanceof Promise) result.catch((e) => console.error("[audit]", e));
}

export async function listAuditEvents(limit = 200): Promise<AuditEvent[]> {
  return getRegistryWriter().listAudit(limit);
}

export { AuditEvent };
