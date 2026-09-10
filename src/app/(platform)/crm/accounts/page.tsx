import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, ItemList, ItemRow, PageHeader } from "@/components/ui/primitives";
import { crmAccounts, crmOpportunities } from "@/server/services/crm";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "Accounts" };

export default async function AccountsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const viewer = await getViewer();
  const { q = "" } = await searchParams;
  const { items, source } = await crmAccounts(viewer.identity!);
  const opps = (await crmOpportunities(viewer.identity!)).items;
  const list = items.filter((a) => !q || `${a.title} ${a.region} ${a.kind}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <PageHeader title="Accounts" description="Client and partner organizations — municipalities, counties, utilities, campuses and partners — linked to opportunities, project references and RFP intelligence." />
      <form className="cb-toolbar" method="get"><input className="cb-input cb-search-input" name="q" defaultValue={q} placeholder="Filter accounts…" aria-label="Filter accounts" /><button className="cb-btn" type="submit">Apply</button><span className="cb-subtle cb-small">{source.live ? `live from ${source.connector}` : "governed registry"}</span></form>
      {list.length === 0 ? <EmptyState icon={<Building2 size={18} />} title={items.length ? "No accounts match" : "No accounts recorded"} description="Accounts come from governed registry records (content/registry/crm/accounts.yaml) or the Pipedrive connector. None are fabricated." /> : (
        <ItemList>{list.map((a) => <ItemRow key={a.id} href={urlFor({ type: "account", id: a.id })} title={a.title} type="account" status={a.status} subtitle={[a.kind, a.region].filter(Boolean).join(" · ")} meta={<><Badge tone="outline">{opps.filter((o) => o.accountId === a.id).length} opportunities</Badge>{a.externalIds.pipedrive && <span className="cb-mono">pd:{a.externalIds.pipedrive}</span>}</>} />)}</ItemList>
      )}
    </>
  );
}
