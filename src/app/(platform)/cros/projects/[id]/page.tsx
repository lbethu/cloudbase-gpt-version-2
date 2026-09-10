import type { Metadata } from "next";
import { MATURITY_MODEL } from "@/domain";
import { CrosRecord } from "@/components/cros/CrosRecord";
import { MaturityLadder } from "@/components/cros/MaturityLadder";
import { Badge } from "@/components/ui/Badge";
import { BulletList, NotRecorded } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { relatedFor, teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getRepositories().cros.rndProject(id)?.title ?? "R&D project" };
}

export default async function RndProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  const project = requireVisible(viewer.identity, "rnd-project", getRepositories().cros.rndProject(id));
  const related = relatedFor(viewer.identity, { type: "rnd-project", id: project.id });
  const caps = related.find((g) => g.type === "capability")?.entries ?? [];
  return (
    <CrosRecord
      type="rnd-project"
      record={project}
      status={project.status}
      teamName={teamName(project.owningTeam)}
      extraBadges={<><Badge tone="outline">{project.code}</Badge>{project.maturity && <Badge tone="violet">{project.maturity} {MATURITY_MODEL[project.maturity].label}</Badge>}</>}
      facts={[{ label: "Started", value: project.startedAt }, { label: "Leads", value: project.leads.join(", ") || undefined }]}
      related={related}
      sections={[
        { title: "Maturity", content: <><MaturityLadder active={project.maturity} />{!project.maturity && <p className="cb-muted cb-small" style={{ marginTop: 10 }}>No governed maturity has been assigned. A CROS evaluation and decision are required; CloudBase never infers maturity.</p>}</> },
        { title: "Problem", content: project.problem ? <p>{project.problem}</p> : <NotRecorded>Problem statement not recorded in the registry yet.</NotRecorded> },
        { title: "Hypothesis", content: project.hypothesis ? <p>{project.hypothesis}</p> : <NotRecorded /> },
        { title: "Capabilities created or strengthened", content: caps.length ? <ul>{caps.map((c) => <li key={c.ref.id}><a href={c.url}>{c.title}</a>{c.confidence === "proposed" ? " (proposed link — pending confirmation)" : ""}</li>)}</ul> : <NotRecorded>No capability linked yet.</NotRecorded> },
        { title: "Technologies", content: <BulletList items={project.technologies} /> },
        { title: "Service lines", content: <BulletList items={project.serviceLines} empty="No service lines recorded." /> },
      ]}
    />
  );
}
