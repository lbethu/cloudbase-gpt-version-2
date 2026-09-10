import Link from "next/link";
import type { AgentFinding } from "@/domain";
import { TypeBadge } from "@/components/ui/Badge";

export function Kpi({ label, value, unit, foot, href, tone }: { label: string; value: React.ReactNode; unit?: string; foot?: React.ReactNode; href?: string; tone?: "success" | "warning" | "danger" }) {
  const body = (
    <>
      <div className="cb-kpi-label">
        <span>{label}</span>
        {tone && <span className={`cb-sev cb-sev--${tone === "success" ? "low" : tone === "warning" ? "medium" : "high"}`} aria-hidden="true" />}
      </div>
      <div className="cb-kpi-value">
        {value}
        {unit && <small>{unit}</small>}
      </div>
      {foot && <div className="cb-kpi-foot">{foot}</div>}
    </>
  );
  return href ? (
    <Link href={href} className="cb-card cb-kpi cb-kpi--link">
      {body}
    </Link>
  ) : (
    <div className="cb-card cb-kpi">{body}</div>
  );
}

export interface BarDatum {
  label: string;
  value: number;
  href?: string;
  tone?: "accent" | "success" | "warning" | "neutral" | "violet";
}

/** Single-hue horizontal bars with direct labels (magnitude), or status-toned when `tone` is set per row. */
export function Bars({ data, title, unit = "" }: { data: BarDatum[]; title?: string; unit?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <figure style={{ margin: 0 }}>
      {title && <figcaption className="cb-eyebrow" style={{ marginBottom: 10 }}>{title}</figcaption>}
      <div className="cb-bars" role="list">
        {data.map((d) => (
          <div key={d.label} className="cb-bar-row" role="listitem" title={`${d.label}: ${d.value}${unit}`}>
            <span>{d.href ? <Link href={d.href}>{d.label}</Link> : d.label}</span>
            <div className="cb-bar-track">
              <div className={`cb-bar-fill ${d.tone && d.tone !== "accent" ? `cb-bar-fill--${d.tone}` : ""}`} style={{ width: `${Math.max(2, (d.value / max) * 100)}%` }} />
            </div>
            <span>
              {d.value}
              {unit}
            </span>
          </div>
        ))}
        {data.length === 0 && <p className="cb-muted cb-small">No data yet.</p>}
      </div>
    </figure>
  );
}

export function FindingsList({ findings, limit, emptyLabel = "No findings — the agents found nothing to flag for this scope." }: { findings: AgentFinding[]; limit?: number; emptyLabel?: string }) {
  const list = limit ? findings.slice(0, limit) : findings;
  if (!list.length) return <p className="cb-muted cb-small" style={{ padding: 16 }}>{emptyLabel}</p>;
  return (
    <div className="cb-card">
      {list.map((f) => (
        <div key={f.id} className="cb-finding">
          <span className={`cb-sev cb-sev--${f.severity}`}>{f.severity}</span>
          <div>
            <div className="cb-finding-title" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {f.target && <TypeBadge type={f.target.type} />}
              {f.url ? <Link href={f.url}>{f.title}</Link> : f.title}
            </div>
            {f.detail && <div className="cb-finding-action">{f.detail}</div>}
            {f.recommendedAction && <div className="cb-finding-action">→ {f.recommendedAction}</div>}
          </div>
          <span className="cb-subtle cb-small cb-mono">{f.agentId}</span>
        </div>
      ))}
      {limit && findings.length > limit && (
        <div className="cb-finding" style={{ gridTemplateColumns: "1fr" }}>
          <Link href="/agents" className="cb-small" style={{ fontWeight: 600 }}>
            {findings.length - limit} more findings in the Agents console →
          </Link>
        </div>
      )}
    </div>
  );
}
