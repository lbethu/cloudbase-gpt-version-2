"use client";

import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Permission } from "@/domain";
import { CommandPalette } from "./CommandPalette";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

export interface ShellViewer {
  name: string;
  detail: string;
  initials: string;
}

interface Props {
  permissions: Permission[];
  viewer: ShellViewer | null;
  environmentLabel?: string;
  /** Items awaiting the viewer's review (server-computed). */
  inboxCount?: number;
  developerCredit?: string;
  canSignOut?: boolean;
  children: React.ReactNode;
}

/** Client shell: sidebar state, ⌘K palette. Everything it renders is permission-filtered server-side data. */
export function AppShell({ permissions, viewer, environmentLabel, inboxCount = 0, developerCredit, canSignOut, children }: Props) {
  const [navOpen, setNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const closeNav = useCallback(() => setNavOpen(false), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="cb-shell">
      <Sidebar permissions={permissions} viewer={viewer ? { name: viewer.name, detail: viewer.detail } : null} open={navOpen} onClose={closeNav} developerCredit={developerCredit} canSignOut={canSignOut} />
      <div className="cb-main">
        <header className="cb-topbar">
          <button className="cb-menu-button" onClick={() => setNavOpen(true)} aria-label="Open navigation">
            <Menu size={18} />
          </button>
          <button className="cb-topbar-search" onClick={() => setPaletteOpen(true)} aria-label="Open search (Command or Control + K)">
            <Search size={15} aria-hidden="true" />
            <span>Search Cloudpoint knowledge…</span>
            <kbd>⌘K</kbd>
          </button>
          <div className="cb-topbar-actions">
            {environmentLabel && <span className="cb-badge cb-badge--outline cb-hide-sm">{environmentLabel}</span>}
            {permissions.includes("review.read") && (
              <Link href="/governance/reviews" className="cb-icon-btn" aria-label={`${inboxCount} items awaiting review`} title="Review inbox">
                <Bell size={16} />
                {inboxCount > 0 && <span className="cb-icon-badge">{inboxCount > 99 ? "99+" : inboxCount}</span>}
              </Link>
            )}
            <ThemeToggle />
            <div className="cb-identity">
              <span className="cb-avatar" aria-hidden="true">
                {viewer?.initials ?? "–"}
              </span>
            </div>
          </div>
        </header>
        <main className="cb-content" id="main">
          {children}
        </main>
        <footer className="cb-footer">
          <span>CloudBase AI · Cloudpoint Knowledge &amp; Intelligence Hub</span>
          <span>Developed by <b>{developerCredit ?? "Cloudpoint Geospatial"}</b></span>
        </footer>
      </div>
      <CommandPalette open={paletteOpen} onClose={closePalette} permissions={permissions} />
    </div>
  );
}
