import type { ContentType } from "@/domain/common";
import { CONTENT_TYPE_LABELS } from "@/domain/common";

export type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info" | "violet" | "teal" | "outline";

export function Badge({ children, tone = "neutral", className = "", title }: { children: React.ReactNode; tone?: Tone; className?: string; title?: string }) {
  return (
    <span className={`cb-badge ${tone === "neutral" ? "" : `cb-badge--${tone}`} ${className}`} title={title}>
      {children}
    </span>
  );
}

const TYPE_TONES: Partial<Record<ContentType, Tone>> = {
  sop: "accent",
  documentation: "teal",
  research: "violet",
  "rnd-project": "violet",
  capability: "info",
  "capability-cluster": "info",
  copilot: "success",
  automation: "success",
  "project-reference": "warning",
  rfp: "warning",
  team: "neutral",
  evidence: "violet",
  evaluation: "violet",
  decision: "violet",
  experiment: "violet",
  idea: "violet",
};

export function TypeBadge({ type }: { type: ContentType }) {
  return (
    <Badge tone={TYPE_TONES[type] ?? "neutral"} className="cb-type-badge">
      {CONTENT_TYPE_LABELS[type]}
    </Badge>
  );
}

const STATUS_TONES: Record<string, Tone> = {
  approved: "success",
  published: "success",
  operational: "success",
  active: "success",
  completed: "success",
  proceed: "success",
  review: "warning",
  "in review": "warning",
  pilot: "warning",
  candidate: "warning",
  pending: "warning",
  draft: "neutral",
  concept: "neutral",
  proposed: "neutral",
  prototype: "info",
  "in-development": "info",
  superseded: "outline",
  historical: "outline",
  archived: "outline",
  deprecated: "outline",
  retired: "outline",
  stopped: "danger",
  rejected: "danger",
  paused: "warning",
};

export function StatusBadge({ status }: { status: string }) {
  if (!status) return null;
  const tone = STATUS_TONES[status.toLowerCase()] ?? "neutral";
  const label = status.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  return <Badge tone={tone}>{label}</Badge>;
}
