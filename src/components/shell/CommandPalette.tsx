"use client";

import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ContentType, Permission } from "@/domain";
import { CONTENT_TYPE_LABELS } from "@/domain/common";
import { PALETTE_COMMANDS } from "./navigation";

interface Hit {
  item: { ref: { type: ContentType; id: string }; title: string; url: string; status: string; owningTeam: string };
}

interface Props {
  open: boolean;
  onClose: () => void;
  permissions: Permission[];
}

export function CommandPalette({ open, onClose, permissions }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const allowed = useMemo(() => new Set(permissions), [permissions]);

  const commands = useMemo(
    () => PALETTE_COMMANDS.filter((c) => !c.permission || allowed.has(c.permission)).filter((c) => !query || c.label.toLowerCase().includes(query.toLowerCase())),
    [allowed, query],
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setHits([]);
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setHits([]);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`, { signal: controller.signal });
        if (res.ok) {
          const data = (await res.json()) as { hits: Hit[] };
          setHits(data.hits);
          setSelected(0);
        }
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 140);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query, open]);

  const entries = useMemo(
    () => [
      ...hits.map((h) => ({ key: `${h.item.ref.type}:${h.item.ref.id}`, label: h.item.title, hint: CONTENT_TYPE_LABELS[h.item.ref.type], href: h.item.url, group: "Knowledge" })),
      ...commands.map((c) => ({ key: c.id, label: c.label, hint: c.hint ?? "Command", href: c.href, group: "Commands" })),
    ],
    [hits, commands],
  );

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(entries.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(0, s - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = entries[selected];
      if (entry) go(entry.href);
      else if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;
  let lastGroup = "";
  return (
    <div className="cb-palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cb-palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="cb-palette-input">
          <Search size={16} aria-hidden="true" />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKey} placeholder="Search SOPs, projects, R&D, capabilities, copilots, docs — or run a command" aria-label="Search" role="combobox" aria-expanded aria-controls="cb-palette-list" />
        </div>
        <div className="cb-palette-list" id="cb-palette-list" role="listbox">
          {entries.length === 0 && (
            <div className="cb-palette-group" style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500, padding: "18px 12px" }}>
              {loading ? "Searching…" : query.trim().length >= 2 ? "No matching knowledge. Press Enter for full search." : "Type to search, or pick a command."}
            </div>
          )}
          {entries.map((entry, index) => {
            const header = entry.group !== lastGroup ? <div className="cb-palette-group">{entry.group}</div> : null;
            lastGroup = entry.group;
            return (
              <div key={entry.key}>
                {header}
                <button className="cb-palette-item" role="option" aria-selected={index === selected} onMouseEnter={() => setSelected(index)} onClick={() => go(entry.href)}>
                  <span>{entry.label}</span>
                  <small>{entry.hint}</small>
                </button>
              </div>
            );
          })}
        </div>
        <div className="cb-palette-foot">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>
              <CornerDownLeft size={10} />
            </kbd>{" "}
            open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
