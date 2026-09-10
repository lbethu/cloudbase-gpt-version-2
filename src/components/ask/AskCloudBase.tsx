"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { ContentType } from "@/domain/common";
import { CONTENT_TYPE_LABELS } from "@/domain/common";
import { Badge, StatusBadge, TypeBadge } from "@/components/ui/Badge";
import type { AskAnswer } from "@/server/services/ask-core";

const KIND_TONE = { FACT: "success", SUPPORTED_INFERENCE: "info", ASSUMPTION: "warning", UNKNOWN: "neutral" } as const;
const KIND_HELP = {
  FACT: "Stated in a cited source.",
  SUPPORTED_INFERENCE: "Follows from cited sources.",
  ASSUMPTION: "Not in any governed source.",
  UNKNOWN: "No governed source supports an answer.",
} as const;

const SAMPLE_QUESTIONS = [
  "How do we start a block of hours project?",
  "What is the process for qualifying an inbound lead?",
  "Do we have a capability for indoor asset detection?",
  "Which copilot helps with RFP evaluation?",
  "What must be checked before field work?",
];

export function AskCloudBase({ initialQuestion = "", aiMode }: { initialQuestion?: string; aiMode: { enabled: boolean; provider: string } }) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState<AskAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 3) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: trimmed }) });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setAnswer((await res.json()) as AskAnswer);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ask CloudBase is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuestion) void ask(initialQuestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void ask(question);
  };

  const relatedTypes = (Object.keys(answer?.related ?? {}) as ContentType[]).filter((t) => answer?.related[t]?.length);

  return (
    <div className="cb-ask-layout">
      <div>
        <form className="cb-card cb-ask-box" onSubmit={submit}>
          <label className="sr-only" htmlFor="ask-input">
            Ask CloudBase
          </label>
          <textarea id="ask-input" className="cb-textarea" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask what the organization knows — “How do we close out a project?”, “Is there an SOP for vendor invoices?”, “Which capability covers indoor mapping?”" maxLength={500} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") void ask(question); }} />
          <div className="cb-ask-box-actions">
            <span className="cb-subtle cb-small">
              {aiMode.enabled ? `AI-grounded answers via ${aiMode.provider}. ` : "Governed retrieval mode — AI synthesis is disabled. "}
              Every statement is labelled and cited.
            </span>
            <button className="cb-btn cb-btn--primary" type="submit" disabled={loading || question.trim().length < 3}>
              <Sparkles /> {loading ? "Searching…" : "Ask"}
            </button>
          </div>
        </form>

        {error && (
          <div className="cb-callout cb-callout--warning" style={{ marginTop: 16 }}>
            <div>{error}</div>
          </div>
        )}

        {!answer && !loading && (
          <div style={{ marginTop: 24 }}>
            <span className="cb-eyebrow">Try asking</span>
            <div className="cb-sample-questions">
              {SAMPLE_QUESTIONS.map((q) => (
                <button key={q} type="button" onClick={() => { setQuestion(q); void ask(q); }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {answer && (
          <section className="cb-card" style={{ marginTop: 16 }} aria-live="polite">
            <div className="cb-result" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge tone={answer.mode === "ai-grounded" ? "violet" : "outline"}>{answer.mode === "ai-grounded" ? "AI-grounded" : "Governed retrieval"}</Badge>
                {answer.lastUpdated && <span className="cb-subtle cb-small">Sources last updated {answer.lastUpdated}</span>}
              </div>
              {answer.provider && <span className="cb-subtle cb-small">{answer.provider}</span>}
            </div>
            <div style={{ padding: "4px 18px 8px" }}>
              {answer.statements.map((s, i) => (
                <div key={i} className="cb-statement">
                  <div className="cb-statement-kind">
                    <Badge tone={KIND_TONE[s.kind]}>{s.kind.replace("_", " ")}</Badge>
                    <span className="cb-subtle" style={{ fontSize: 11.5 }}>
                      {KIND_HELP[s.kind]}
                    </span>
                  </div>
                  <div>
                    {s.text}
                    {s.citations.map((c) => (
                      <a key={c} className="cb-cite" href={`#source-${c}`} title={answer.sources[c]?.title}>
                        {c + 1}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {answer.notices.length > 0 && (
              <div style={{ padding: "0 18px 16px" }}>
                {answer.notices.map((n, i) => (
                  <p key={i} className="cb-subtle cb-small">
                    {n}
                  </p>
                ))}
              </div>
            )}
          </section>
        )}

        {answer && answer.trace.length > 0 && (
          <section style={{ marginTop: 16 }}>
            <span className="cb-eyebrow">Agent trace</span>
            <div className="cb-agent-trace" style={{ marginTop: 8 }}>
              {answer.trace.map((t, i) => (
                <div key={i}>
                  <span className="cb-step-n">{i + 1}</span>
                  <span><b>{t.step}</b> · {t.detail}</span>
                  <span className="cb-subtle cb-mono">{t.ms !== undefined ? `${t.ms} ms` : ""}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {answer && answer.sources.length > 0 && (
          <section style={{ marginTop: 20 }}>
            <span className="cb-eyebrow">Sources</span>
            <div className="cb-card" style={{ marginTop: 8 }}>
              {answer.sources.map((s) => (
                <div key={s.index} id={`source-${s.index}`} className="cb-source">
                  <div className="cb-source-title">
                    <span className="cb-cite" style={{ marginLeft: 0 }}>
                      {s.index + 1}
                    </span>
                    <TypeBadge type={s.ref.type} />
                    <Link href={s.passageUrl ?? s.url}>{s.title}</Link>
                    <StatusBadge status={s.status} />
                    {s.occurrences ? <span className="cb-subtle cb-small">{s.occurrences} mention{s.occurrences === 1 ? "" : "s"}</span> : null}
                    {!s.governed && (
                      <Badge tone="warning" title="This source has not been approved through the governed workflow.">
                        not yet approved
                      </Badge>
                    )}
                  </div>
                  <p className="cb-source-passage">
                    {s.section ? <strong>{s.section} — </strong> : null}
                    {s.passage}
                  </p>
                  {s.morePassages && s.morePassages.length > 0 && (
                    <details style={{ marginTop: 6 }}>
                      <summary className="cb-small" style={{ cursor: "pointer", color: "var(--accent-soft-fg)", fontWeight: 600 }}>
                        {s.morePassages.length} more passage{s.morePassages.length === 1 ? "" : "s"} in this document
                      </summary>
                      {s.morePassages.map((m, i) => (
                        <p key={i} className="cb-source-passage" style={{ marginTop: 6 }}>
                          {m.section ? <strong>{m.section}{m.page && !/^page\b/i.test(m.section) ? ` (p. ${m.page})` : ""} — </strong> : null}
                          {m.text}
                          {m.url && (
                            <>
                              {" "}
                              <Link href={m.url} style={{ fontWeight: 600 }}>open ↗</Link>
                            </>
                          )}
                        </p>
                      ))}
                    </details>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="cb-card cb-aside-card">
          <h3>How answers are governed</h3>
          <ul className="cb-aside-list cb-small">
            <li>Only knowledge you are authorized to read is retrieved.</li>
            <li>Priority: approved SOP → documentation → project examples → copilot/tool → known limitations.</li>
            <li>If no governed source supports an answer, CloudBase says so instead of guessing.</li>
            <li>Ask CloudBase never replaces the governed SOP. Open the cited source before acting.</li>
          </ul>
        </div>
        {answer && relatedTypes.length > 0 && (
          <div className="cb-card cb-aside-card">
            <h3>Related knowledge</h3>
            {relatedTypes.map((t) => (
              <div key={t} style={{ marginBottom: 10 }}>
                <span className="cb-subtle" style={{ fontSize: 11, fontWeight: 700 }}>
                  {CONTENT_TYPE_LABELS[t]}
                </span>
                <ul className="cb-aside-list" style={{ marginTop: 4 }}>
                  {answer.related[t]!.slice(0, 5).map((r) => (
                    <li key={r.ref.id}>
                      <Link href={r.url}>{r.title}</Link>
                      <small>{r.status}</small>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div className="cb-card cb-aside-card">
          <h3>Looking for what to do about a new idea?</h3>
          <p className="cb-small cb-muted">Ask CloudBase tells you what the organization knows. CROS Copilot helps decide what Cloudpoint should investigate or do about a new idea.</p>
          <Link className="cb-btn cb-btn--sm" href="/cros/copilot" style={{ marginTop: 10 }}>
            Open CROS Copilot <ArrowRight />
          </Link>
        </div>
      </aside>
    </div>
  );
}
