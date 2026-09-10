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
  return { title: getRepositories().cros.capability(id)?.title ?? "Capability" };
}

export default async function CapabilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  const cap = requireVisible(viewer.identity, "capability", getRepositories().cros.capability(id));
  const related = relatedFor(viewer.identity, { type: "capability", id: cap.id });
  const sources = related.find((g) => g.type === "rnd-project")?.entries ?? [];
  const projects = related.find((g) => g.type === "project-reference")?.entries ?? [];
  const evidence = related.find((g) => g.type === "evidence")?.entries ?? [];
  const link = (e: { url: string; title: string; confidence: string }) => <li key={e.url}><a href={e.url}>{e.title}</a>{e.confidence === "proposed" ? " (proposed link — pending confirmation)" : ""}</li>;
  return (
    <CrosRecord
      type="capability"
      record={cap}
      status={cap.maturity ? `${cap.maturity} ${MATURITY_MODEL[cap.maturity].label}` : "Maturity not assessed"}
      teamName={teamName(cap.owningTeam)}
      extraBadges={<Badge tone="outline">{cap.code}</Badge>}
      related={related}
      sections={[
        { title: "Description", content: cap.description ? <p>{cap.description}</p> : <NotRecorded>Description not recorded in CROS yet.</NotRecorded> },
        { title: "Maturity", content: <><MaturityLadder active={cap.maturity} />{!cap.maturity && <p className="cb-muted cb-small" style={{ marginTop: 10 }}>Maturity is assigned by a CROS decision after evaluation. Until then this capability is listed without a level.</p>}</> },
        { title: "Source R&D", content: sources.length ? <ul>{sources.map(link)}</ul> : <NotRecorded>No R&D project linked.</NotRecorded> },
        { title: "Projects that produced evidence", content: projects.length ? <ul>{projects.map(link)}</ul> : <NotRecorded>No project reference has been linked as evidence for this capability yet.</NotRecorded> },
        { title: "Evidence", content: evidence.length ? <ul>{evidence.map(link)}</ul> : <NotRecorded>No governed evidence recorded.</NotRecorded> },
        { title: "Supported use cases", content: <BulletList items={cap.useCases} /> },
        { title: "Inputs", content: <BulletList items={cap.inputs} /> },
        { title: "Outputs", content: <BulletList items={cap.outputs} /> },
        { title: "Technical approach", content: cap.technicalApproach ? <p>{cap.technicalApproach}</p> : <NotRecorded /> },
        { title: "Known limitations", content: <BulletList items={cap.limitations} empty="No limitations recorded — treat as unknown, not as none." /> },
        { title: "Dependencies", content: <BulletList items={cap.dependencies} /> },
        { title: "Reusable assets", content: <BulletList items={cap.reusableAssets} /> },
      ]}
    />
  );
}
