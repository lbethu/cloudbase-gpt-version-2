"use client";

import { useMemo, useState } from "react";
import YAML from "yaml";

/**
 * Governed draft generator.
 *
 * First-release mutations are deliberately not written by the web app: a
 * draft is produced as a registry record (YAML) that the author submits
 * through the governed change process (pull request → review → approval).
 * The same field specs will drive server-side submission when write
 * workflows are enabled, without changing the UX.
 */

export type FieldSpec =
  | { name: string; label: string; kind: "text" | "textarea"; required?: boolean; help?: string; placeholder?: string }
  | { name: string; label: string; kind: "select"; required?: boolean; help?: string; options: Array<{ value: string; label: string }> }
  | { name: string; label: string; kind: "list"; required?: boolean; help?: string; placeholder?: string };

interface Props {
  title: string;
  intro: string;
  fields: FieldSpec[];
  /** Static values merged into the generated record. */
  base: Record<string, unknown>;
  /** Registry path the record belongs to, shown to the author. */
  destination: string;
  submitLabel?: string;
}

export function DraftForm({ title, intro, fields, base, destination, submitLabel = "Generate draft record" }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const missing = useMemo(() => fields.filter((f) => f.required && !values[f.name]?.trim()).map((f) => f.label), [fields, values]);

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    if (missing.length) return;
    const record: Record<string, unknown> = { ...base };
    for (const f of fields) {
      const raw = values[f.name] ?? "";
      if (!raw.trim()) continue;
      record[f.name] = f.kind === "list" ? raw.split("\n").map((s) => s.trim()).filter(Boolean) : raw.trim();
    }
    record.createdAt = new Date().toISOString().slice(0, 10);
    setGenerated(YAML.stringify(record, { lineWidth: 0 }));
    setCopied(false);
  };

  const copy = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="cb-grid cb-grid--2" style={{ alignItems: "start" }}>
      <form className="cb-card cb-card--pad" onSubmit={generate}>
        <h2 style={{ fontSize: 16, marginBottom: 6 }}>{title}</h2>
        <p className="cb-muted cb-small" style={{ marginBottom: 18 }}>{intro}</p>
        <div className="cb-form-grid">
          {fields.map((f) => (
            <label key={f.name} className={`cb-field ${f.kind === "textarea" || f.kind === "list" ? "cb-field--wide" : ""}`}>
              <span>
                {f.label}
                {f.required ? " *" : ""}
              </span>
              {f.help && <small>{f.help}</small>}
              {f.kind === "select" ? (
                <select className="cb-select" value={values[f.name] ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}>
                  <option value="">Select…</option>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : f.kind === "text" ? (
                <input className="cb-input" value={values[f.name] ?? ""} placeholder={f.placeholder} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
              ) : (
                <textarea className="cb-textarea" value={values[f.name] ?? ""} placeholder={f.kind === "list" ? (f.placeholder ?? "One item per line") : f.placeholder} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
              )}
            </label>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, gap: 12, flexWrap: "wrap" }}>
          <span className="cb-subtle cb-small">{missing.length ? `Required: ${missing.join(", ")}` : "All required fields provided."}</span>
          <button className="cb-btn cb-btn--primary" type="submit" disabled={missing.length > 0}>
            {submitLabel}
          </button>
        </div>
      </form>
      <div className="cb-card cb-card--pad">
        <h2 style={{ fontSize: 16, marginBottom: 6 }}>Draft record</h2>
        <p className="cb-muted cb-small" style={{ marginBottom: 12 }}>
          Destination: <code>{destination}</code>. Submit the record through the governed change process; it becomes visible after review. Nothing is published from this screen.
        </p>
        {generated ? (
          <>
            <div className="codeblock" data-lang="yaml">
              <pre>
                <code>{generated}</code>
              </pre>
              <button type="button" className="cb-copy" onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </>
        ) : (
          <p className="cb-subtle cb-small">Complete the form to generate a validated draft.</p>
        )}
      </div>
    </div>
  );
}
