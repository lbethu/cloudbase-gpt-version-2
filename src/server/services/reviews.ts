import type { ReviewTask } from "@/domain";
import { urlFor } from "@/lib/urls";
import type { Repositories } from "@/server/repositories/interfaces";

/**
 * Review queue derived from governed state. There is no separate task table
 * yet: anything whose lifecycle says "needs a human" appears here, and the
 * required permission decides who sees it. Stale = approved/published and not
 * reviewed within `staleAfterDays`.
 */
export function deriveReviewTasks(repos: Repositories, options: { now?: Date; staleAfterDays?: number } = {}): ReviewTask[] {
  const now = options.now ?? new Date();
  const staleMs = (options.staleAfterDays ?? 365) * 86_400_000;
  const tasks: ReviewTask[] = [];
  const isStale = (date?: string) => !date || now.getTime() - new Date(date).getTime() > staleMs;

  for (const sop of repos.sops.list()) {
    const pending = sop.versions.filter((v) => v.status === "review" || v.status === "draft");
    if (pending.length) {
      tasks.push({
        id: `sop-approval:${sop.id}`,
        target: { type: "sop", id: sop.id },
        title: sop.title,
        kind: "sop-approval",
        requiredPermission: "sop.approve",
        owningTeam: sop.owningTeam,
        openedAt: sop.updatedAt,
        note: pending.length > 1 ? `${pending.length} versions awaiting review — confirm the effective version.` : `Version ${pending[0].version} awaiting review.`,
        url: urlFor({ type: "sop", id: sop.id }),
      });
    }
    const effective = sop.versions.find((v) => v.version === sop.effectiveVersion);
    if (effective?.status === "approved" && isStale(effective.reviewedAt ?? sop.lastReviewedAt)) {
      tasks.push({
        id: `stale:${sop.id}`,
        target: { type: "sop", id: sop.id },
        title: sop.title,
        kind: "stale-content",
        requiredPermission: "sop.review",
        owningTeam: sop.owningTeam,
        note: "Approved SOP has not been reviewed within the review cadence.",
        url: urlFor({ type: "sop", id: sop.id }),
      });
    }
  }
  for (const doc of repos.docs.list()) {
    if (doc.status === "review") {
      tasks.push({ id: `pub:${doc.id}`, target: { type: "documentation", id: doc.id }, title: doc.title, kind: "publication", requiredPermission: "knowledge.publish", owningTeam: doc.owningTeam, openedAt: doc.updatedAt, note: "Documentation submitted for publication.", url: urlFor({ type: "documentation", id: doc.id }) });
    } else if (doc.status === "published" && isStale(doc.lastReviewedAt)) {
      tasks.push({ id: `stale:${doc.id}`, target: { type: "documentation", id: doc.id }, title: doc.title, kind: "stale-content", requiredPermission: "knowledge.publish", owningTeam: doc.owningTeam, note: "Published documentation is past its review cadence.", url: urlFor({ type: "documentation", id: doc.id }) });
    }
  }
  for (const copilot of repos.copilots.list()) {
    if (copilot.status === "pilot" || copilot.status === "draft") {
      tasks.push({ id: `copilot:${copilot.id}`, target: { type: "copilot", id: copilot.id }, title: copilot.title, kind: "copilot-approval", requiredPermission: "copilot.manage", owningTeam: copilot.owningTeam, note: `Copilot in ${copilot.status} — review before promotion.`, url: urlFor({ type: "copilot", id: copilot.id }) });
    }
  }
  for (const automation of repos.automations.list()) {
    if (automation.status === "proposed" || automation.status === "pilot") {
      tasks.push({ id: `automation:${automation.id}`, target: { type: "automation", id: automation.id }, title: automation.title, kind: "automation-approval", requiredPermission: "automation.manage", owningTeam: automation.owningTeam, note: `Automation ${automation.status} — approval required.`, url: urlFor({ type: "automation", id: automation.id }) });
    }
  }
  for (const evidence of repos.cros.evidence()) {
    if (evidence.status === "candidate") {
      tasks.push({ id: `evidence:${evidence.id}`, target: { type: "evidence", id: evidence.id }, title: evidence.title, kind: "evidence-approval", requiredPermission: "rnd.approve", owningTeam: evidence.owningTeam, note: "Candidate evidence awaiting approval.", url: urlFor({ type: "evidence", id: evidence.id }) });
    }
  }
  return tasks;
}
