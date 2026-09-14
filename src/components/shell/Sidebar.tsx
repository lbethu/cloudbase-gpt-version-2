"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Permission } from "@/domain";
import { Icon } from "./Icon";
import { NAVIGATION } from "./navigation";

interface Props {
  permissions: Permission[];
  viewer: { name: string; detail: string } | null;
  open: boolean;
  onClose: () => void;
  developerCredit?: string;
}

const STORAGE_KEY = "cloudbase.nav.collapsed";

export function Sidebar({ permissions, viewer, open, onClose, developerCredit }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCollapsed(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggle = (id: string) => {
    setCollapsed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const allowed = new Set(permissions);
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(href + "/"));

  return (
    <>
      <div className="cb-backdrop" data-open={open} onClick={onClose} aria-hidden="true" />
      <aside className="cb-sidebar" data-open={open} aria-label="Primary navigation">
        <div className="cb-brand">
          <div className="cb-brand-mark" aria-hidden="true">
            CB
          </div>
          <div>
            <strong>CloudBase AI</strong>
            <span>Cloudpoint Knowledge &amp; Intelligence Hub</span>
          </div>
          {open && (
            <button className="cb-btn cb-btn--ghost cb-btn--sm" style={{ marginLeft: "auto", color: "inherit" }} onClick={onClose} aria-label="Close navigation">
              <X size={16} />
            </button>
          )}
        </div>
        <nav className="cb-nav">
          {NAVIGATION.map((section) => {
            const items = section.items.filter((item) => !item.permission || allowed.has(item.permission));
            if (!items.length) return null;
            const isCollapsed = section.label ? collapsed[section.id] : false;
            return (
              <div key={section.id} className={section.label ? "cb-nav-section" : undefined}>
                {section.label && (
                  <button className="cb-nav-section-toggle" onClick={() => toggle(section.id)} aria-expanded={!isCollapsed} aria-controls={`nav-${section.id}`}>
                    {section.label}
                    <ChevronDown size={13} style={{ transform: isCollapsed ? "rotate(-90deg)" : undefined, transition: "transform .15s" }} />
                  </button>
                )}
                <div id={`nav-${section.id}`} className="cb-nav-sub" hidden={isCollapsed}>
                  {items.map((item) => (
                    <Link key={item.href} href={item.href} className="cb-nav-link" aria-current={isActive(item.href, item.exact) ? "page" : undefined} onClick={onClose}>
                      <Icon name={item.icon} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="cb-sidebar-footer">
          {viewer ? (
            <>
              <strong>{viewer.name}</strong>
              <span>{viewer.detail}</span>
            </>
          ) : (
            <>
              <strong>Not signed in</strong>
              <span>Identity provider not configured</span>
            </>
          )}
          <span className="cb-credit">Developed by {developerCredit ?? "Cloudpoint Geospatial"}</span>
        </div>
      </aside>
    </>
  );
}
