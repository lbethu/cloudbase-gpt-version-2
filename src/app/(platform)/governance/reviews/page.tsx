import type { Metadata } from "next";
import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { Badge, TypeBadge } from "@/components/ui/Badge";
import { Callout, EmptyState, PageHeader } from "@/components/ui/primitives";
import { WorkflowActions } from "@/components/sops/WorkflowActions";
import { getRepositories } from "@/server/repositories";
import { teamName } from "@/server/services/catalog";
import { deriveReviewTasks } from "@/server/services/reviews";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Review queue" };
const KIND_LABEL: Record<string, string> = { "sop-approval": "SOP approval", "copilot-approval": "Copilot approval", "automation-approval": "Automation approval", "stale-content": "Stale content", publication: "Publication", "evidence-approval": "Evidence approval" };

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ kind?: string; team?: string }> }) {
  const viewer = await getViewer();
  if (!viewer.has("review.read")) return <Callout tone="warning" title="Not authorized">The review queue requires review.read.</Callout>;
  const { kind, team } = await searchParams;
  const all = deriveReviewTasks(getRepositories());
  const mine = all.filter((t) => viewer.has(t.requiredPermission));
  const list = mine.filter((t) => !kind || t.kind === kind).filter((t) => !team || t.owningTeam === team);
  const counts = mine.reduce<Record<string, number>>((acc, t) => ((acc[t.kind] = (acc[t.kind] ?? 0) + 1), acc), {});
  const hidden = all.length - mine.length;
  return (
    <>
      <PageHeader eyebrow="Governance" title="Review queue" description="Everything that needs a human decision: SOP approvals, publications, copilot and automation approvals, evidence approvals and stale-content reviews. You only see tasks your role can act on. Decisions are recorded through the governed change process." />
      <div className="cb-chip-row" style={{ marginBottom: 18 }}>
        <Link className="cb-chip" aria-pressed={!kind} href="/governance/reviews">All ({mine.length})</Link>
        {Object.entries(KIND_LABEL).filter(([k]) => counts[k]).map(([k, label]) => <Link key={k} className="cb-chip" aria-pressed={kind === k} href={`/governance/reviews?kind=${k}`}>{label} ({counts[k]})</Link>)}
      </div>
      {hidden > 0 && <p className="cb-subtle cb-small" style={{ marginBottom: 12 }}>{hidden} task{hidden === 1 ? "" : "s"} require permissions you do not hold and are not shown.</p>}
      {list.length === 0 ? (
        <EmptyState icon={<CheckSquare size={18} />} title="Nothing awaiting your review" description="Tasks appear here when governed content enters review, when approved content passes its review cadence, or when AI assets await promotion." />
      ) : (
        <div className="cb-table-wrap cb-card">
          <table className="cb-table">
            <thead><tr><th>Task</th><th>Item</th><th>Team</th><th>Requires</th><th>Note</th><th>Decision</th></tr></thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id}>
                  <td><Badge tone={t.kind === "stale-content" ? "warning" : "accent"}>{KIND_LABEL[t.kind]}</Badge></td>
                  <td><div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><TypeBadge type={t.target.type} /><Link href={t.url} style={{ fontWeight: 600 }}>{t.title}</Link></div></td>
                  <td>{teamName(t.owningTeam)}</td>
                  <td className="cb-mono">{t.requiredPermission}</td>
                  <td className="cb-muted">{t.note}</td>
                  <td>
                    {t.kind === "sop-approval" && (() => {
                      const sop = getRepositories().sops.get(t.target.id);
                      const pending = sop?.versions.filter((v) => v.status === "review") ?? [];
                      return pending.length === 1 ? <WorkflowActions compact sopId={t.target.id} version={pending[0].version} status="review" canApprove={viewer.has("sop.approve")} canReview={viewer.has("sop.review")} canAuthor={false} /> : <Link href={t.url} className="cb-btn cb-btn--sm">Choose version</Link>;
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
