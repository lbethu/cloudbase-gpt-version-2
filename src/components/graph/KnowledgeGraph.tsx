"use client";

import Link from "next/link";
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type Simulation, type SimulationLinkDatum, type SimulationNodeDatum } from "d3-force";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ContentType } from "@/domain/common";
import { CONTENT_TYPE_LABELS } from "@/domain/common";

interface GNode extends SimulationNodeDatum {
  id: string;
  type: ContentType;
  label: string;
  url: string;
  team: string;
  status: string;
  degree: number;
}
interface GEdge extends SimulationLinkDatum<GNode> {
  type: string;
  confidence: "declared" | "proposed" | "implicit";
}

/** Fixed categorical hue order — never cycled; unknown types fold into neutral. */
const COLORS: Partial<Record<ContentType, string>> = {
  sop: "#2f5fd6",
  documentation: "#167d78",
  "rnd-project": "#6b4fd8",
  capability: "#2d6cb5",
  "capability-cluster": "#1f4f8f",
  copilot: "#1b7f5a",
  automation: "#3f9c6b",
  "project-reference": "#9a6b12",
  rfp: "#b3782f",
  research: "#8b5cf6",
  team: "#5b6577",
  opportunity: "#c2410c",
  account: "#a16207",
  contact: "#7c6f64",
  agent: "#0e7490",
};
const TYPE_OPTIONS: ContentType[] = ["sop", "documentation", "rnd-project", "capability", "capability-cluster", "copilot", "automation", "project-reference", "rfp", "research", "team", "opportunity", "account", "agent"];

export function KnowledgeGraph({ initialFocus, initialConfidence }: { initialFocus?: string; initialConfidence?: string }) {
  const [types, setTypes] = useState<ContentType[]>([]);
  const [showTeams, setShowTeams] = useState(true);
  const [focus, setFocus] = useState(initialFocus ?? "");
  const [raw, setRaw] = useState<{ nodes: GNode[]; edges: GEdge[] } | null>(null);
  const [live, setLive] = useState<{ nodes: GNode[]; edges: GEdge[] } | null>(null);
  const [selected, setSelected] = useState<GNode | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 900, h: 600 });
  const [, setTick] = useState(0);
  const simRef = useRef<Simulation<GNode, GEdge> | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ node?: GNode; panStart?: { x: number; y: number; tx: number; ty: number } }>({});

  useEffect(() => {
    const sp = new URLSearchParams();
    types.forEach((t) => sp.append("type", t));
    if (!showTeams) sp.set("teams", "0");
    if (focus) sp.set("focus", focus);
    fetch(`/api/graph?${sp}`)
      .then(async (r) => (r.ok ? ((await r.json()) as { nodes: GNode[]; edges: GEdge[] }) : Promise.reject(new Error(`Graph unavailable (${r.status})`))))
      .then((g) => {
        setRaw(g);
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  }, [types, showTeams, focus]);

  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!raw) return;
    simRef.current?.stop();
    const nodes: GNode[] = raw.nodes.map((n) => ({ ...n }));
    const byId = new Set(nodes.map((n) => n.id));
    const edges: GEdge[] = raw.edges.filter((e) => byId.has(e.source as string) && byId.has(e.target as string)).map((e) => ({ ...e }));
    const sim = forceSimulation<GNode>(nodes)
      .force("link", forceLink<GNode, GEdge>(edges).id((d) => d.id).distance((l) => (l.confidence === "implicit" ? 70 : 110)).strength(0.6))
      .force("charge", forceManyBody().strength(-160))
      .force("center", forceCenter(size.w / 2, size.h / 2))
      .force("x", forceX(size.w / 2).strength(0.06))
      .force("y", forceY(size.h / 2).strength(0.08))
      .force("collide", forceCollide<GNode>().radius((d) => 14 + Math.min(20, d.degree * 2)))
      .on("tick", () => setTick((t) => t + 1))
      .on("end", () => {
        // Fit the settled layout to the viewport.
        const xs = nodes.map((n) => n.x ?? 0);
        const ys = nodes.map((n) => n.y ?? 0);
        const minX = Math.min(...xs) - 60, maxX = Math.max(...xs) + 160, minY = Math.min(...ys) - 40, maxY = Math.max(...ys) + 40;
        const k = Math.min(1.4, Math.max(0.35, Math.min(size.w / (maxX - minX), size.h / (maxY - minY))));
        setTransform({ k, x: (size.w - (maxX + minX) * k) / 2, y: (size.h - (maxY + minY) * k) / 2 });
      });
    simRef.current = sim;
    setLive({ nodes, edges });
    return () => {
      sim.stop();
    };
  }, [raw, size.w, size.h]);

  const visibleQuery = query.trim().toLowerCase();
  const matchesQuery = (n: GNode) => !visibleQuery || n.label.toLowerCase().includes(visibleQuery) || n.id.toLowerCase().includes(visibleQuery);
  const legend = useMemo(() => TYPE_OPTIONS.filter((t) => live?.nodes.some((n) => n.type === t)), [live]);

  const onPointerDown = (e: React.PointerEvent, node?: GNode) => {
    e.stopPropagation();
    if (node) {
      drag.current = { node };
      node.fx = node.x;
      node.fy = node.y;
      simRef.current?.alphaTarget(0.3).restart();
    } else drag.current = { panStart: { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y } };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (drag.current.node) {
      drag.current.node.fx = (e.clientX - rect.left - transform.x) / transform.k;
      drag.current.node.fy = (e.clientY - rect.top - transform.y) / transform.k;
    } else if (drag.current.panStart) {
      const p = drag.current.panStart;
      setTransform((t) => ({ ...t, x: p.tx + (e.clientX - p.x), y: p.ty + (e.clientY - p.y) }));
    }
  };
  const onPointerUp = () => {
    if (drag.current.node) {
      drag.current.node.fx = null;
      drag.current.node.fy = null;
      simRef.current?.alphaTarget(0);
    }
    drag.current = {};
  };
  const onWheel = (e: React.WheelEvent) => {
    const k = Math.min(3, Math.max(0.3, transform.k * (e.deltaY < 0 ? 1.1 : 0.9)));
    setTransform((t) => ({ ...t, k }));
  };

  return (
    <>
      <div className="cb-toolbar">
        <input className="cb-input cb-search-input" placeholder="Highlight nodes…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Highlight nodes" />
        <select className="cb-select" value={focus} onChange={(e) => setFocus(e.target.value)} aria-label="Focus node">
          <option value="">Whole graph</option>
          {raw?.nodes
            .slice()
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((n) => (
              <option key={n.id} value={n.id}>
                {CONTENT_TYPE_LABELS[n.type]} · {n.label}
              </option>
            ))}
        </select>
        <label className="cb-chip" style={{ cursor: "pointer" }}>
          <input type="checkbox" checked={showTeams} onChange={(e) => setShowTeams(e.target.checked)} /> team ownership edges
        </label>
        <button
          className="cb-btn cb-btn--sm"
          onClick={() => {
            setTransform({ x: 0, y: 0, k: 1 });
            setFocus("");
            setTypes([]);
            setQuery("");
          }}
        >
          Reset
        </button>
      </div>
      <div className="cb-chip-row" style={{ marginBottom: 12 }}>
        {TYPE_OPTIONS.map((t) => (
          <button key={t} className="cb-chip" aria-pressed={types.includes(t)} onClick={() => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))}>
            <i style={{ width: 8, height: 8, borderRadius: 4, background: COLORS[t] ?? "#888", display: "inline-block" }} /> {CONTENT_TYPE_LABELS[t]}
          </button>
        ))}
      </div>
      <div className="cb-graph-wrap">
        {error && (
          <div className="cb-callout cb-callout--warning" style={{ margin: 12 }}>
            {error}
          </div>
        )}
        <svg ref={svgRef} onPointerDown={(e) => onPointerDown(e)} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onWheel={onWheel} role="img" aria-label="Knowledge graph">
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
            {live?.edges.map((e, i) => {
              const s = e.source as GNode;
              const t = e.target as GNode;
              if (typeof s !== "object" || typeof t !== "object") return null;
              return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={e.confidence === "proposed" ? "var(--warning)" : "var(--line-strong)"} strokeWidth={e.confidence === "implicit" ? 1 : 1.6} strokeDasharray={e.confidence === "proposed" ? "4 3" : undefined} opacity={0.8} />;
            })}
            {live?.nodes.map((n) => {
              const r = 6 + Math.min(12, n.degree * 1.5);
              const dim = visibleQuery && !matchesQuery(n);
              return (
                <g key={n.id} transform={`translate(${n.x ?? 0},${n.y ?? 0})`} opacity={dim ? 0.18 : 1} onPointerDown={(e) => onPointerDown(e, n)} onClick={() => setSelected(n)} style={{ cursor: "pointer" }}>
                  <circle r={r} fill={COLORS[n.type] ?? "#888"} stroke="var(--bg-elevated)" strokeWidth={2} />
                  {(r > 9 || !!visibleQuery || selected?.id === n.id) && (
                    <text x={r + 4} y={4} fontSize={11} fill="var(--fg-muted)" style={{ pointerEvents: "none" }}>
                      {n.label.length > 34 ? n.label.slice(0, 33) + "…" : n.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
        <div className="cb-graph-legend">
          {legend.map((t) => (
            <span key={t}>
              <i style={{ background: COLORS[t] }} />
              {CONTENT_TYPE_LABELS[t]}
            </span>
          ))}
          <span>
            <i style={{ background: "transparent", border: "1px dashed var(--warning)", borderRadius: 0, width: 12, height: 0 }} />
            proposed link
          </span>
        </div>
        {selected && (
          <div className="cb-graph-tip">
            <span className="cb-badge cb-badge--accent cb-type-badge">{CONTENT_TYPE_LABELS[selected.type]}</span>
            <div style={{ fontWeight: 650, marginTop: 6 }}>{selected.label}</div>
            <div className="cb-subtle cb-small">
              {selected.status} · {selected.degree} connection{selected.degree === 1 ? "" : "s"}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Link className="cb-btn cb-btn--sm cb-btn--primary" href={selected.url}>
                Open
              </Link>
              <button className="cb-btn cb-btn--sm" onClick={() => setFocus(selected.id)}>
                Focus
              </button>
              <button className="cb-btn cb-btn--sm cb-btn--ghost" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        )}
        {live && live.nodes.length === 0 && (
          <div className="cb-empty" style={{ margin: 24 }}>
            <h3>No nodes</h3>
            <p>Nothing you can read matches these filters.</p>
          </div>
        )}
      </div>
      {initialConfidence === "proposed" && (
        <p className="cb-subtle cb-small" style={{ marginTop: 8 }}>
          Dashed edges are proposed relationships awaiting human confirmation.
        </p>
      )}
    </>
  );
}
