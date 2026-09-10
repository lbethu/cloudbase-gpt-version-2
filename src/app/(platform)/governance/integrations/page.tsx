import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Callout, PageHeader } from "@/components/ui/primitives";
import { getAiProvider } from "@/server/ai/adapters";
import { getConfig } from "@/server/config";
import { getCrmConnector } from "@/server/integrations/crm-connector";
import { getRepository, githubStatus } from "@/server/integrations/github";
import { getRepositories } from "@/server/repositories";
import { getViewer } from "@/server/services/viewer";

export const metadata: Metadata = { title: "Integrations" };

export default async function IntegrationsPage() {
  const viewer = await getViewer();
  if (!viewer.has("integration.read")) return <Callout tone="warning" title="Not authorized">Requires integration.read.</Callout>;
  const cfg = getConfig();
  const gh = githubStatus();
  const crm = getCrmConnector();
  const crmSnap = crm.configured ? await crm.snapshot() : null;
  let ai = "disabled";
  try { ai = getAiProvider().enabled ? getAiProvider().name : "disabled"; } catch { ai = "misconfigured"; }
  const repos = getRepositories();
  const linked = [...repos.cros.rndProjects(), ...repos.cros.capabilities(), ...repos.copilots.list(), ...repos.automations.list()].flatMap((r) => r.repositories.map((x) => ({ ...x, owner_title: r.title })));
  const uniqueRepos = [...new Map(linked.map((l) => [`${l.owner}/${l.repo}`, l])).values()];
  const probes = await Promise.all(uniqueRepos.slice(0, 6).map((r) => getRepository(r.owner, r.repo)));
  const rows: Array<{ name: string; status: "connected" | "configured" | "not configured" | "error" | "disabled"; detail: string; how: string }> = [
    { name: "Microsoft Entra ID (identity)", status: cfg.auth.mode === "entra" ? "connected" : cfg.auth.mode === "dev" ? "configured" : "not configured", detail: cfg.auth.mode === "dev" ? "Development identity in use (never in production)." : cfg.auth.mode === "entra" ? "Principal read from the authenticating proxy header." : "No identity provider.", how: "CLOUDBASE_AUTH_MODE=entra behind App Service Easy Auth; map groups with CLOUDBASE_ENTRA_GROUP_ROLE_MAP / TEAM_MAP." },
    { name: "GitHub", status: !gh.enabled ? "disabled" : probes.some((p) => p.ok) ? "connected" : gh.authenticated ? "configured" : "configured", detail: `${uniqueRepos.length} linked repositor${uniqueRepos.length === 1 ? "y" : "ies"} · ${probes.filter((p) => p.ok).length} reachable · ${gh.authenticated ? "token set" : "unauthenticated (public repos only, rate-limited)"}`, how: "Set GITHUB_TOKEN (read-only, fine-grained) for private repos. Link repos on any record with `repositories: [{ owner, repo }]`." },
    { name: "Pipedrive (CRM)", status: !crm.configured ? "not configured" : crmSnap?.ok ? "connected" : "error", detail: !crm.configured ? "Pipeline shows governed registry records only." : crmSnap?.ok ? `${crmSnap.data.opportunities.length} deals · ${crmSnap.data.accounts.length} organizations · ${crmSnap.data.contacts.length} people (read-only)` : `Error: ${crmSnap && !crmSnap.ok ? crmSnap.reason : "unknown"}`, how: "PIPEDRIVE_API_TOKEN + PIPEDRIVE_COMPANY_DOMAIN. Stage names containing iql/mql/sql/proposal/negotiation map to CloudBase stages." },
    { name: "AI provider", status: ai === "disabled" ? "not configured" : ai === "misconfigured" ? "error" : "connected", detail: ai === "disabled" ? "Ask CloudBase runs in governed retrieval mode." : ai, how: "CLOUDBASE_AI_PROVIDER = openai | azure-openai | anthropic | gemini, plus model/key. Provider-neutral adapter; retrieval stays permission-scoped." },
    { name: "Google Drive search", status: cfg.drive.configured ? "connected" : "not configured", detail: cfg.drive.configured ? "Service account configured." : "Not connected.", how: "GOOGLE_SERVICE_ACCOUNT_EMAIL / PRIVATE_KEY; share the folder with the service account." },
    { name: "Search provider", status: "connected", detail: `${cfg.search.provider} · full-text over ${repos.sops.allImportedContent().reduce((n, c) => n + c.chunks.length, 0)} extracted chunks from ${repos.sops.allImportedContent().length} source files`, how: "npm run extract:sources after adding or changing files in source-documents/. CLOUDBASE_SEARCH_PROVIDER=hybrid once a vector store is connected." },
    { name: "Audit sink", status: "connected", detail: `JSON lines in ${cfg.auditDir}`, how: "Replace src/server/services/audit.ts writer with a database sink." },
  ];
  const tone = (s: (typeof rows)[number]["status"]) => (s === "connected" ? "success" : s === "configured" ? "info" : s === "error" ? "danger" : "neutral");
  return (
    <>
      <PageHeader eyebrow="Governance" title="Integrations" description="Every external system CloudBase reads from. All connectors are read-only in this release and fail safely; secrets live only in server configuration." />
      <div className="cb-table-wrap cb-card">
        <table className="cb-table">
          <thead><tr><th>Integration</th><th>Status</th><th>Detail</th><th>How to configure</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.name}><td><b>{r.name}</b></td><td><Badge tone={tone(r.status)}>{r.status}</Badge></td><td className="cb-muted">{r.detail}</td><td className="cb-muted cb-small">{r.how}</td></tr>)}</tbody>
        </table>
      </div>
      {uniqueRepos.length > 0 && (
        <div className="cb-card" style={{ marginTop: 20 }}>
          {uniqueRepos.map((r, i) => {
            const p = probes[i];
            return (
              <div key={`${r.owner}/${r.repo}`} className="cb-item-row">
                <div><div className="cb-item-row-title"><a href={`https://github.com/${r.owner}/${r.repo}`} target="_blank" rel="noopener noreferrer">{r.owner}/{r.repo}</a></div><div className="cb-item-row-sub">linked from {r.owner_title}{p?.ok && p.summary.description ? ` · ${p.summary.description}` : ""}</div></div>
                <div className="cb-item-row-meta">{p ? p.ok ? <><Badge tone="success">reachable</Badge><span>{p.summary.language}</span><span>{p.summary.openIssues} issues</span>{p.commits[0] && <span className="cb-mono">{p.commits[0].sha}</span>}</> : <Badge tone="warning">{p.reason}</Badge> : <Badge tone="outline">not probed</Badge>}</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
