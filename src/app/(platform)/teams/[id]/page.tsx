import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ContentType } from "@/domain";
import { CONTENT_TYPE_LABELS } from "@/domain";
import { Badge } from "@/components/ui/Badge";
import { AsideCard, DetailHeader, DetailLayout } from "@/components/ui/DetailPage";
import { BodySection, EmptyState, ItemList, ItemRow, NotRecorded } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { teamItems } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().teams.get(id)?.name ?? "Team" };
}

const SECTIONS: Array<{ title: string; types: ContentType[] }> = [
  { title: "SOPs", types: ["sop", "policy"] },
  { title: "Tools & Copilots", types: ["copilot"] },
  { title: "Automations", types: ["automation"] },
  { title: "Documentation", types: ["documentation"] },
  { title: "Project References", types: ["project-reference", "rfp"] },
  { title: "Research & R&D", types: ["research", "rnd-project", "capability", "capability-cluster", "evidence", "evaluation", "decision", "experiment", "idea"] },
];

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  if (!viewer.has("knowledge.read")) notFound();
  const team = getRepositories().teams.get(id);
  if (!team) notFound();
  const items = teamItems(viewer.identity, team.id);
  const recent = [...items].filter((i) => i.updatedAt).sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")).slice(0, 6);
  const byTypes = (types: ContentType[]) => items.filter((i) => types.includes(i.ref.type)).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <DetailHeader
        type="team"
        title={team.name}
        summary={team.description}
        facts={[
          { label: "Workspace", value: team.scope === "company-wide" ? "Company-wide" : "Team" },
          { label: "Knowledge items", value: items.length },
          { label: "Owners", value: team.owners.length ? team.owners.join(", ") : "Not assigned" },
        ]}
        extraBadges={viewer.identity?.teams.includes(team.id) ? <Badge tone="accent">Your team</Badge> : null}
      />
      <DetailLayout
        aside={
          <>
            <AsideCard title="Owners / experts">
              {team.experts.length || team.owners.length ? (
                <ul className="cb-aside-list">
                  {team.owners.map((o) => (
                    <li key={o}>
                      <span>{o}</span>
                      <small>Owner</small>
                    </li>
                  ))}
                  {team.experts.map((e) => (
                    <li key={e.name}>
                      <span>{e.name}</span>
                      <small>{e.area}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <NotRecorded>No owners or experts recorded for this team yet.</NotRecorded>
              )}
            </AsideCard>
            <AsideCard title="Common questions">
              {team.commonQuestions.length ? (
                <ul className="cb-aside-list">
                  {team.commonQuestions.map((q) => (
                    <li key={q}>
                      <a href={`/ask?q=${encodeURIComponent(q)}`}>{q}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <NotRecorded>No common questions curated yet.</NotRecorded>
              )}
            </AsideCard>
            <AsideCard title="Recent updates">
              {recent.length ? (
                <ul className="cb-aside-list">
                  {recent.map((i) => (
                    <li key={`${i.ref.type}:${i.ref.id}`}>
                      <a href={i.url}>{i.title}</a>
                      <small>
                        {CONTENT_TYPE_LABELS[i.ref.type]} · {i.updatedAt}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <NotRecorded />
              )}
            </AsideCard>
          </>
        }
      >
        {items.length === 0 && <EmptyState title={`No governed knowledge is linked to ${team.name} yet`} description="Knowledge appears here when a record names this team as owner or as a sharing team." />}
        {SECTIONS.map((section) => {
          const list = byTypes(section.types);
          return (
            <BodySection key={section.title} title={section.title}>
              {list.length ? (
                <ItemList>
                  {list.map((i) => (
                    <ItemRow key={`${i.ref.type}:${i.ref.id}`} href={i.url} title={i.title} type={i.ref.type} status={i.status} subtitle={i.summary} meta={i.owningTeam !== team.id ? <span>shared from {getRepositories().teams.get(i.owningTeam)?.name ?? i.owningTeam}</span> : undefined} />
                  ))}
                </ItemList>
              ) : (
                <NotRecorded>No {section.title.toLowerCase()} registered for this team.</NotRecorded>
              )}
            </BodySection>
          );
        })}
      </DetailLayout>
    </>
  );
}
