import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Callout, EmptyState, PageHeader } from "@/components/ui/primitives";
import { requirePermission } from "@/server/authz";
import { listAuditEvents } from "@/server/services/audit";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Audit history" };

export default async function AuditPage() {
  const viewer = await getViewer();
  if (!viewer.has("audit.read")) return <Callout tone="warning" title="Not authorized">Audit history requires audit.read.</Callout>;
  await requirePermission("audit.read", { audit: true });
  const events = await listAuditEvents(300);
  return (
    <>
      <PageHeader eyebrow="Governance" title="Audit history" description="Privileged and sensitive actions: source-file access, Ask CloudBase queries (metadata only), denied authorizations, provider errors and governance views. Append-only." />
      {events.length === 0 ? (
        <EmptyState icon={<ScrollText size={18} />} title="No audit events recorded yet" description="Events are written as JSON lines under the configured audit directory." />
      ) : (
        <div className="cb-table-wrap cb-card">
          <table className="cb-table">
            <thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Target</th><th>Outcome</th><th>Detail</th></tr></thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td className="cb-mono cb-small">{e.at.replace("T", " ").slice(0, 19)}</td>
                  <td>{e.actor}</td>
                  <td className="cb-mono cb-small">{e.action}</td>
                  <td className="cb-mono cb-small">{e.target ? `${e.target.type}:${e.target.id}` : "—"}</td>
                  <td><Badge tone={e.outcome === "allowed" ? "success" : e.outcome === "denied" ? "danger" : "warning"}>{e.outcome}</Badge></td>
                  <td className="cb-mono cb-small cb-muted">{JSON.stringify(e.detail)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
