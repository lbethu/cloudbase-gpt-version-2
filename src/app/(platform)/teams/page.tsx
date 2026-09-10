import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Callout, EmptyState, PageHeader } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { teamItems } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Team Workspaces" };

export default async function TeamsPage() {
  const viewer = await getViewer();
  if (!viewer.has("knowledge.read")) return <Callout tone="warning" title="Not authorized">Your role does not include knowledge.read.</Callout>;
  const teams = getRepositories().teams.list();
  const mine = new Set(viewer.identity?.teams ?? []);
  return (
    <>
      <PageHeader eyebrow="Knowledge" title="Team Workspaces" description="Each team owns a knowledge domain: its SOPs, tools and copilots, automations, documentation, project references, research and experts. A single knowledge object can belong to several teams through relationships — nothing is duplicated." />
      {teams.length === 0 ? (
        <EmptyState icon={<Users size={18} />} title="No teams configured" description="Administrators add teams in the registry (content/registry/teams.yaml) — no code change required." />
      ) : (
        <div className="cb-grid cb-grid--3">
          {teams.map((team) => {
            const items = teamItems(viewer.identity, team.id);
            const counts = items.reduce<Record<string, number>>((acc, i) => ((acc[i.ref.type] = (acc[i.ref.type] ?? 0) + 1), acc), {});
            return (
              <Link key={team.id} href={`/teams/${team.id}`} className="cb-card cb-card--link cb-domain-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="cb-domain-card-icon" style={{ fontWeight: 700, fontSize: 11 }}>{team.shortName}</div>
                  {mine.has(team.id) && <Badge tone="accent">Your team</Badge>}
                  {team.scope === "company-wide" && <Badge tone="outline">Company-wide</Badge>}
                </div>
                <strong>{team.name}</strong>
                <p>{team.description}</p>
                <div className="cb-domain-card-meta">
                  <span>
                    {items.length} item{items.length === 1 ? "" : "s"}
                    {counts.sop ? ` · ${counts.sop} SOP${counts.sop === 1 ? "" : "s"}` : ""}
                  </span>
                  <span>Open →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
