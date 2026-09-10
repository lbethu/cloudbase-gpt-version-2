import Link from "next/link";
import { Inbox, Info, ShieldAlert, TriangleAlert, CircleCheck } from "lucide-react";
import type { ContentType } from "@/domain/common";
import { StatusBadge, TypeBadge } from "./Badge";

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="cb-page-header">
      <div>
        {eyebrow && <span className="cb-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="cb-page-actions">{actions}</div>}
    </div>
  );
}

export function Section({ title, action, children, className = "" }: { title: string; action?: { label: string; href: string }; children: React.ReactNode; className?: string }) {
  return (
    <section className={`cb-section ${className}`}>
      <div className="cb-section-head">
        <h2>{title}</h2>
        {action && <Link href={action.href}>{action.label} →</Link>}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: { label: string; href: string }; icon?: React.ReactNode }) {
  return (
    <div className="cb-empty" role="status">
      <div className="cb-empty-icon">{icon ?? <Inbox size={18} />}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && (
        <Link className="cb-btn" href={action.href}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Callout({ tone = "info", title, children }: { tone?: "info" | "warning" | "success" | "neutral"; title?: string; children: React.ReactNode }) {
  const Icon = tone === "warning" ? TriangleAlert : tone === "success" ? CircleCheck : tone === "neutral" ? ShieldAlert : Info;
  return (
    <div className={`cb-callout ${tone === "neutral" ? "" : `cb-callout--${tone}`}`}>
      <Icon aria-hidden="true" />
      <div>
        {title && <strong>{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="cb-card cb-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export interface ItemRowProps {
  href: string;
  title: string;
  type?: ContentType;
  status?: string;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
}

export function ItemRow({ href, title, type, status, subtitle, meta }: ItemRowProps) {
  return (
    <Link href={href} className="cb-item-row">
      <div>
        <div className="cb-item-row-title">
          {type && <TypeBadge type={type} />}
          <span>{title}</span>
        </div>
        {subtitle && <div className="cb-item-row-sub">{subtitle}</div>}
      </div>
      <div className="cb-item-row-meta">
        {status && <StatusBadge status={status} />}
        {meta}
      </div>
    </Link>
  );
}

export function ItemList({ children }: { children: React.ReactNode }) {
  return <div className="cb-card cb-list">{children}</div>;
}

export function DomainCard({ href, title, description, icon, count, countLabel }: { href: string; title: string; description: string; icon: React.ReactNode; count?: number; countLabel?: string }) {
  return (
    <Link href={href} className="cb-card cb-card--link cb-domain-card">
      <div className="cb-domain-card-icon">{icon}</div>
      <strong>{title}</strong>
      <p>{description}</p>
      <div className="cb-domain-card-meta">
        <span>{count === undefined ? "" : `${count} ${countLabel ?? (count === 1 ? "item" : "items")}`}</span>
        <span>Open →</span>
      </div>
    </Link>
  );
}

export function BodySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cb-body-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function BulletList({ items, empty = "None recorded." }: { items: string[]; empty?: string }) {
  if (!items.length) return <p className="cb-muted cb-small">{empty}</p>;
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function NotRecorded({ children = "Not recorded yet." }: { children?: React.ReactNode }) {
  return <p className="cb-muted cb-small">{children}</p>;
}
