"use client";

import Link from "next/link";
import { useActionState } from "react";
import { uploadSopAction, type ActionState } from "@/server/actions/sops";

interface Props {
  teams: Array<{ id: string; name: string }>;
  sops: Array<{ id: string; title: string }>;
  defaultTeam?: string;
  defaultExisting?: string;
}

export function UploadForm({ teams, sops, defaultTeam, defaultExisting }: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(uploadSopAction, {});
  return (
    <form action={formAction} className="cb-card cb-card--pad" style={{ display: "grid", gap: 16 }} encType="multipart/form-data">
      <div className="cb-form-grid">
        <label className="cb-field cb-field--wide">
          <span>Document (.docx or .pdf, up to 25 MB) *</span>
          <input className="cb-input" type="file" name="file" accept=".docx,.pdf" required style={{ paddingTop: 6 }} />
        </label>
        <label className="cb-field">
          <span>Add as a new version of an existing SOP</span>
          <small>Leave blank to create a new SOP.</small>
          <select className="cb-select" name="existingSopId" defaultValue={defaultExisting ?? ""}>
            <option value="">— New SOP —</option>
            {sops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <label className="cb-field">
          <span>Owning team *</span>
          <select className="cb-select" name="owningTeam" defaultValue={defaultTeam ?? teams[0]?.id} required>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="cb-field">
          <span>Title *</span>
          <input className="cb-input" name="title" required placeholder="e.g. 301.1 - Publish a Hosted Feature Layer" />
        </label>
        <label className="cb-field">
          <span>SOP number</span>
          <input className="cb-input" name="sopNumber" placeholder="e.g. 301.1" />
        </label>
        <label className="cb-field">
          <span>Category</span>
          <input className="cb-input" name="category" placeholder="e.g. GIS Engineering" />
        </label>
        <label className="cb-field cb-field--wide">
          <span>Summary</span>
          <textarea className="cb-textarea" name="summary" placeholder="One or two sentences — drives search snippets and Ask CloudBase answers." />
        </label>
        <label className="cb-field cb-field--wide" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <input type="checkbox" name="submitForReview" /> <span>Submit for review immediately (otherwise it stays a draft you can submit later)</span>
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span className="cb-subtle cb-small">Stored under source-documents/uploads/ (never public), text-extracted and searchable immediately, status draft or review. Approval is a separate governed step.</span>
        <button className="cb-btn cb-btn--primary" type="submit" disabled={pending}>
          {pending ? "Uploading & indexing…" : "Upload document"}
        </button>
      </div>
      {state.message && (
        <div className={`cb-callout ${state.ok ? "cb-callout--success" : "cb-callout--warning"}`}>
          <div>
            {state.message}
            {state.ok && state.sopId && (
              <>
                {" "}
                <Link href={`/sops/${state.sopId}`} style={{ fontWeight: 600 }}>
                  Open the SOP →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
