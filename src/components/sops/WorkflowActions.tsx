"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Send, Undo2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { sopTransitionAction, type ActionState } from "@/server/actions/sops";

interface Props {
  sopId: string;
  version: string;
  status: "draft" | "review" | "approved" | "superseded" | "historical";
  canApprove: boolean;
  canReview: boolean;
  canAuthor: boolean;
  compact?: boolean;
}

/** Governed lifecycle controls — rendered only for the actions the viewer may take; the server re-checks. */
export function WorkflowActions({ sopId, version, status, canApprove, canReview, canAuthor, compact }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(sopTransitionAction, {});
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  const showApprove = status === "review" && canApprove;
  const showSendBack = status === "review" && canReview;
  const showSubmit = status === "draft" && canAuthor;
  if (!showApprove && !showSendBack && !showSubmit) return null;

  return (
    <form action={formAction} className={compact ? "" : "cb-card cb-card--pad"} style={compact ? { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" } : { display: "grid", gap: 10 }}>
      <input type="hidden" name="sopId" value={sopId} />
      <input type="hidden" name="version" value={version} />
      {!compact && <strong style={{ fontSize: 13 }}>Governed decision — version {version}</strong>}
      {(showApprove || showSendBack) && <input className="cb-input" name="note" placeholder={compact ? "Note (required to send back)" : "Approval note or reason for sending back"} style={compact ? { height: 30, fontSize: 12, minWidth: 220 } : undefined} aria-label="Decision note" />}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {showApprove && (
          <button className={`cb-btn cb-btn--primary ${compact ? "cb-btn--sm" : ""}`} name="action" value="approve" disabled={pending} title="Approve and make this the effective version">
            <CheckCircle2 /> Approve
          </button>
        )}
        {showSendBack && (
          <button className={`cb-btn ${compact ? "cb-btn--sm" : ""}`} name="action" value="send-back" disabled={pending} title="Return to the author as a draft">
            <Undo2 /> Send back
          </button>
        )}
        {showSubmit && (
          <button className={`cb-btn cb-btn--primary ${compact ? "cb-btn--sm" : ""}`} name="action" value="submit" disabled={pending}>
            <Send /> Submit for review
          </button>
        )}
      </div>
      {state.message && <span className={`cb-small ${state.ok ? "cb-muted" : "cb-sev cb-sev--high"}`}>{state.message}</span>}
      {!compact && <p className="cb-subtle" style={{ fontSize: 11.5 }}>Approval is recorded with your identity, date and note, sets this as the effective version, supersedes any previously approved version, and is written to the audit log. AI never approves.</p>}
    </form>
  );
}
