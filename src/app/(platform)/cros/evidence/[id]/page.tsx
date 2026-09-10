import { CrosRecord } from "@/components/cros/CrosRecord";
import { getRepositories } from "@/server/repositories";
import { requireVisible } from "@/server/services/access";
import { relatedFor, teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  const record = requireVisible(viewer.identity, "evidence", getRepositories().cros.evidence().find((r) => r.id === id));
  const related = relatedFor(viewer.identity, { type: "evidence", id: record.id });
  const entries = Object.entries(record).filter(([k, v]) => !["id", "uuid", "title", "summary", "owningTeam", "teams", "owner", "classification", "accessGrants", "tags", "createdAt", "updatedAt", "lastReviewedAt", "version"].includes(k) && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0));
  return (
    <CrosRecord
      type="evidence"
      record={record}
      status={String(record.status)}
      teamName={teamName(record.owningTeam)}
      related={related}
      sections={entries.map(([k, v]) => ({ title: k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()), content: Array.isArray(v) ? <ul>{v.map((x, i) => <li key={i}>{typeof x === "object" ? JSON.stringify(x) : String(x)}</li>)}</ul> : typeof v === "object" ? <pre className="cb-mono">{JSON.stringify(v, null, 2)}</pre> : <p>{String(v)}</p> }))}
    />
  );
}
