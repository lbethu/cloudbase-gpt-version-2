import Link from "next/link";
import type { ContentType } from "@/domain/common";
import { CONTENT_TYPE_LABELS } from "@/domain/common";
import type { RelatedGroup } from "@/server/services/relationships";
import { Badge, StatusBadge, TypeBadge } from "./Badge";

/**
 * Content detail page standard. Every major knowledge object renders through
 * this: title, type badge, status, owner, team, version, last reviewed and
 * actions at the top; main body; related knowledge / sources / history aside.
 */

export interface DetailFact {
  label: string;
  value: React.ReactNode;
}

export function DetailHeader({
  type,
  title,
  status,
  summary,
  facts,
  actions,
  extraBadges,
}: {
  type: ContentType;
  title: string;
  status?: string;
  summary?: string;
  facts: DetailFact[];
  actions?: React.ReactNode;
  extraBadges?: React.ReactNode;
}) {
  return (
    <header className="cb-detail-header">
      <div className="cb-detail-badges">
        <TypeBadge type={type} />
        {status && <StatusBadge status={status} />}
        {extraBadges}
      </div>
      <h1>{title}</h1>
      {summary && <p className="cb-detail-summary">{summary}</p>}
      <div className="cb-detail-facts">
        {facts
          .filter((f) => f.value !== undefined && f.value !== null && f.value !== "")
          .map((f) => (
            <span key={f.label}>
              {f.label}: <b>{f.value}</b>
            </span>
          ))}
      </div>
      {actions && <div className="cb-detail-actions">{actions}</div>}
    </header>
  );
}

export function DetailLayout({ children, aside }: { children: React.ReactNode; aside: React.ReactNode }) {
  return (
    <div className="cb-detail-layout">
      <div>{children}</div>
      <aside className="cb-detail-aside">{aside}</aside>
    </div>
  );
}

export function AsideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="cb-card cb-aside-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export function MetaList({ items }: { items: DetailFact[] }) {
  const visible = items.filter((i) => i.value !== undefined && i.value !== null && i.value !== "");
  if (!visible.length) return <p className="cb-muted cb-small">No metadata recorded.</p>;
  return (
    <dl className="cb-meta-list">
      {visible.map((i) => (
        <div key={i.label}>
          <dt>{i.label}</dt>
          <dd>{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const RELATED_ORDER: ContentType[] = ["sop", "documentation", "copilot", "automation", "project-reference", "rnd-project", "capability", "capability-cluster", "research", "evidence", "evaluation", "decision", "experiment", "rfp", "team", "idea", "policy"];

/** Related knowledge grouped by type, honouring the detail-page standard order. */
export function RelatedPanel({ groups, emptyLabel = "No related knowledge has been linked yet." }: { groups: RelatedGroup[]; emptyLabel?: string }) {
  const ordered = [...groups].sort((a, b) => RELATED_ORDER.indexOf(a.type) - RELATED_ORDER.indexOf(b.type));
  if (!ordered.length) {
    return (
      <AsideCard title="Related knowledge">
        <p className="cb-muted cb-small">{emptyLabel}</p>
      </AsideCard>
    );
  }
  return (
    <>
      {ordered.map((group) => (
        <AsideCard key={group.type} title={`Related ${pluralLabel(group.type)}`}>
          <ul className="cb-aside-list">
            {group.entries.map((e) => (
              <li key={`${e.ref.id}-${e.type}-${e.direction}`}>
                <Link href={e.url}>{e.title}</Link>
                <small>
                  {e.label}
                  {e.confidence === "proposed" && (
                    <>
                      {" · "}
                      <Badge tone="outline" title="Relationship implied by naming or suggested by AI; awaiting human confirmation.">
                        proposed
                      </Badge>
                    </>
                  )}
                </small>
              </li>
            ))}
          </ul>
        </AsideCard>
      ))}
    </>
  );
}

function pluralLabel(type: ContentType) {
  const label = CONTENT_TYPE_LABELS[type];
  if (type === "rnd-project") return "R&D";
  if (type === "research" || type === "evidence") return label;
  if (label.endsWith("y")) return label.slice(0, -1) + "ies";
  return label + "s";
}
