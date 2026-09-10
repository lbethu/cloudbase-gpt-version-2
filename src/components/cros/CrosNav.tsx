"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  ["Overview", "/cros"],
  ["Ideas", "/cros/ideas"],
  ["Evaluations", "/cros/evaluations"],
  ["R&D Projects", "/cros/projects"],
  ["Capabilities", "/capabilities"],
  ["Capability Clusters", "/capabilities/clusters"],
  ["Research", "/cros/research"],
  ["Evidence", "/cros/evidence"],
  ["Experiments", "/cros/experiments"],
  ["Decisions", "/cros/decisions"],
  ["Portfolio", "/cros/portfolio"],
] as const;

export function CrosNav() {
  const pathname = usePathname();
  return (
    <nav className="cb-chip-row" aria-label="CROS sections" style={{ marginBottom: 22 }}>
      {ITEMS.map(([label, href]) => {
        const active = href === "/cros" ? pathname === "/cros" : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={href} href={href} className="cb-chip" aria-pressed={active}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
