import Link from "next/link";
import { notFound } from "next/navigation";
import { getConfig } from "@/server/config";
import "@/legacy/legacy.css";

export const dynamic = "force-dynamic";

/**
 * Legacy prototype (review build). Reachable only when
 * CLOUDBASE_ENABLE_LEGACY_PROTOTYPE=true (default: on outside production).
 * Contains the fictional review corpus — never part of the governed index.
 */
export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  if (!getConfig().features.legacyPrototype) notFound();
  return (
    <div className="legacy-root">
      <div style={{ background: "#fff3d9", color: "#6b4a10", padding: "8px 16px", fontSize: 12, display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <span>
          <strong>Legacy prototype view.</strong> Contains fictional review data. Not governed knowledge.
        </span>
        <Link href="/" style={{ fontWeight: 700, color: "#6b4a10" }}>
          Open CloudBase AI →
        </Link>
      </div>
      {children}
    </div>
  );
}
