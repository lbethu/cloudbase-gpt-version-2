"use client";

import { useRouter } from "next/navigation";
import { Archive, Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { sopTransitionAction, type ActionState } from "@/server/actions/sops";

interface Props {
  sopId: string;
  title: string;
  retired: boolean;
  canRetire: boolean;
  canDelete: boolean;
}

/**
 * Removing an SOP, with the two outcomes kept deliberately far apart.
 *
 * Retire is the normal one: the guidance stops being findable, the record and
 * its history stay. Delete destroys the record, its indexed text and the
 * uploaded document, so it asks for the SOP's title to be typed back — a
 * confirm dialog is too easy to click through for something irreversible.
 * Both re-check permission and record a reason on the server.
 */
export function RemoveActions({ sopId, title, retired, canRetire, canDelete }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(sopTransitionAction, {});
  const [mode, setMode] = useState<"none" | "retire" | "delete">("none");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!state.ok) return;
    setMode("none");
    setConfirmTitle("");
    setReason("");
    router.refresh();
  }, [state.ok, router]);

  if (!canRetire && !canDelete) return null;
  const titleMatches = confirmTitle.trim() === title.trim();

  return (
    <div className="cb-card cb-card--pad" style={{ display: "grid", gap: 10 }}>
      <strong style={{ fontSize: 13 }}>Remove this SOP</strong>

      {mode === "none" && (
        <>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {canRetire && !retired && (
              <button type="button" className="cb-btn" onClick={() => setMode("retire")}>
                <Archive /> Retire
              </button>
            )}
            {canDelete && (
              <button type="button" className="cb-btn" onClick={() => setMode("delete")}>
                <Trash2 /> Delete permanently
              </button>
            )}
          </div>
          <p className="cb-subtle" style={{ fontSize: 11.5, margin: 0 }}>
            {retired ? "This SOP is retired: it no longer appears in the library or in search. Approving a version again brings it back." : "Retiring withdraws the guidance — it leaves the library and search, and the record and its history stay for audit. Deleting destroys the record, its indexed text and any document uploaded here; use it for a wrong file or a duplicate, not to withdraw guidance."}
          </p>
        </>
      )}

      {mode !== "none" && (
        <form action={formAction} style={{ display: "grid", gap: 8 }}>
          <input type="hidden" name="sopId" value={sopId} />
          <input type="hidden" name="version" value="" />
          <input type="hidden" name="action" value={mode} />
          <label className="cb-small" htmlFor={`reason-${mode}`}>
            {mode === "retire" ? "Why is this SOP being retired? (recorded in the audit log)" : "Why is this being deleted? (recorded in the audit log, which survives the deletion)"}
          </label>
          <input id={`reason-${mode}`} className="cb-input" name="note" value={reason} onChange={(e) => setReason(e.target.value)} placeholder={mode === "retire" ? "Superseded by the new field process" : "Wrong file uploaded"} />

          {mode === "delete" && (
            <>
              <label className="cb-small" htmlFor="confirm-title">
                Type the SOP title to confirm: <span className="cb-mono">{title}</span>
              </label>
              <input id="confirm-title" className="cb-input" value={confirmTitle} onChange={(e) => setConfirmTitle(e.target.value)} autoComplete="off" />
              <p className="cb-sev cb-sev--high cb-small" style={{ margin: 0 }}>
                This cannot be undone. The record, its extracted text and any document uploaded through CloudBase are removed. Original repository documents are never destroyed.
              </p>
            </>
          )}

          <div style={{ display: "flex", gap: 6 }}>
            <button className="cb-btn cb-btn--primary" disabled={pending || reason.trim().length < 5 || (mode === "delete" && !titleMatches)}>
              {mode === "retire" ? "Retire this SOP" : "Delete permanently"}
            </button>
            <button type="button" className="cb-btn" onClick={() => setMode("none")} disabled={pending}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {state.message && <span className={`cb-small ${state.ok ? "cb-muted" : "cb-sev cb-sev--high"}`}>{state.message}</span>}
    </div>
  );
}
