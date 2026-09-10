import type { Metadata } from "next";
import Link from "next/link";
import { PERMISSIONS } from "@/domain";
import { Badge } from "@/components/ui/Badge";
import { Callout, PageHeader, Section, Stat } from "@/components/ui/primitives";
import { getAiProvider } from "@/server/ai/adapters";
import { getConfig } from "@/server/config";
import { getRepositories } from "@/server/repositories";
import { danglingRelationships } from "@/server/services/relationships";
import { knowledgeIndex } from "@/server/services/search";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Admin & Governance" };

export default async function AdminPage() {
  const viewer = await getViewer();
  if (!viewer.has("admin.access")) return <Callout tone="warning" title="Not authorized">The governance center requires admin.access. This check is enforced server-side; hiding the link is not the control.</Callout>;
  const repos = getRepositories();
  const cfg = getConfig();
  const roles = repos.roles.list();
  const teams = repos.teams.list();
  const index = knowledgeIndex();
  const dangling = danglingRelationships(repos, index);
  let ai = "disabled";
  try { ai = getAiProvider().enabled ? getAiProvider().name : "disabled"; } catch (e) { ai = `misconfigured: ${e instanceof Error ? e.message : "unknown"}`; }
  const byType = index.reduce<Record<string, number>>((acc, i) => ((acc[i.ref.type] = (acc[i.ref.type] ?? 0) + 1), acc), {});
  return (
    <>
      <PageHeader eyebrow="Governance" title="Admin & Governance Center" description="Identity, roles and permissions, teams, knowledge domains, integrations and registry integrity. Configuration lives in the registry and server environment; this page shows the effective state and never exposes secrets." />
      <div className="cb-stats">
        <Stat value={teams.length} label="teams" />
        <Stat value={roles.length} label="roles" />
        <Stat value={PERMISSIONS.length} label="permissions" />
        <Stat value={index.length} label="indexed knowledge objects" />
        <Stat value={repos.relationships.list().length} label="relationships" />
        <Stat value={dangling.length} label="dangling relationships" />
      </div>
      <Section title="Identity & integrations">
        <div className="cb-table-wrap cb-card">
          <table className="cb-table">
            <tbody>
              <tr><td>Identity provider</td><td><Badge tone={cfg.auth.mode === "entra" ? "success" : cfg.auth.mode === "dev" ? "warning" : "danger"}>{cfg.auth.mode}</Badge></td><td className="cb-muted">{cfg.auth.mode === "dev" ? "Development identity — never available in production builds." : cfg.auth.mode === "entra" ? "Microsoft Entra ID via authenticating proxy (x-ms-client-principal). Groups/app roles map to CloudBase roles and teams." : "No provider configured. Set CLOUDBASE_AUTH_MODE=entra behind the authenticating proxy."}</td></tr>
              <tr><td>Tenant</td><td className="cb-mono">{cfg.auth.tenantId}</td><td className="cb-muted">Permissions are scoped to this tenant.</td></tr>
              <tr><td>AI provider</td><td><Badge tone={ai === "disabled" ? "neutral" : ai.startsWith("misconfigured") ? "danger" : "success"}>{ai}</Badge></td><td className="cb-muted">Provider-neutral adapter layer (OpenAI, Azure OpenAI, Anthropic, Gemini). Ask CloudBase runs in governed retrieval mode when disabled.</td></tr>
              <tr><td>Search provider</td><td><Badge tone="accent">{cfg.search.provider}</Badge></td><td className="cb-muted">Lexical ranking with synonym registry; hybrid/vector seam available.</td></tr>
              <tr><td>Google Drive search</td><td><Badge tone={cfg.drive.configured ? "success" : "neutral"}>{cfg.drive.configured ? "configured" : "not configured"}</Badge></td><td className="cb-muted">Server-side service account; requires knowledge.read. {cfg.features.legacyPrototype && <Link href="/legacy">Legacy prototype UI</Link>}</td></tr>
              <tr><td>Storage</td><td><Badge tone="accent">file registry</Badge></td><td className="cb-muted">Git-versioned content/ — PostgreSQL implementation selectable behind the same repository interfaces.</td></tr>
              <tr><td>Audit sink</td><td><Badge tone="accent">jsonl</Badge></td><td className="cb-muted">{cfg.auditDir}</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="Roles → permissions (default deny, explicit deny wins)">
        <div className="cb-table-wrap cb-card">
          <table className="cb-table">
            <thead><tr><th>Role</th><th>Grants</th><th>Denies</th></tr></thead>
            <tbody>{roles.map((r) => <tr key={r.id}><td><b>{r.name}</b><div className="cb-muted cb-small">{r.description}</div></td><td className="cb-mono cb-small">{r.grants.join(", ") || "—"}</td><td className="cb-mono cb-small">{r.denies.join(", ") || "—"}</td></tr>)}</tbody>
          </table>
        </div>
      </Section>
      <Section title="Teams & knowledge domains">
        <div className="cb-table-wrap cb-card">
          <table className="cb-table">
            <thead><tr><th>Team</th><th>Scope</th><th>Owners</th><th>Owned objects</th></tr></thead>
            <tbody>{teams.map((t) => <tr key={t.id}><td><Link href={`/teams/${t.id}`} style={{ fontWeight: 600 }}>{t.name}</Link> <span className="cb-mono cb-subtle">{t.id}</span></td><td>{t.scope}</td><td>{t.owners.join(", ") || <span className="cb-subtle">unassigned</span>}</td><td>{index.filter((i) => i.owningTeam === t.id && i.ref.type !== "team").length}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="cb-subtle cb-small" style={{ marginTop: 8 }}>Add or change teams in content/registry/teams.yaml. Indexed objects by type: {Object.entries(byType).map(([k, v]) => `${k} ${v}`).join(" · ")}.</p>
      </Section>
      <Section title="Registry integrity">
        {dangling.length === 0 ? <Callout tone="success" title="All relationship endpoints resolve">No broken deep links in the relationship model.</Callout> : <Callout tone="warning" title={`${dangling.length} relationship(s) point to missing objects`}><ul style={{ margin: "6px 0 0 18px" }}>{dangling.map((r, i) => <li key={i} className="cb-mono cb-small">{r.from.type}:{r.from.id} → {r.to.type}:{r.to.id}</li>)}</ul></Callout>}
      </Section>
    </>
  );
}
