import type { Metadata } from "next";
import { Contact } from "lucide-react";
import { EmptyState, ItemList, ItemRow, PageHeader } from "@/components/ui/primitives";
import { crmAccounts, crmContacts } from "@/server/services/crm";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "Contacts" };

export default async function ContactsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const viewer = await getViewer();
  const { q = "" } = await searchParams;
  const { items } = await crmContacts(viewer.identity!);
  const accounts = new Map((await crmAccounts(viewer.identity!)).items.map((a) => [a.id, a.title]));
  const list = items.filter((c) => !q || `${c.title} ${c.role} ${accounts.get(c.accountId ?? "") ?? ""}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <PageHeader title="Contacts" description="People at client and partner organizations. Contacts are confidential by default — visible to the Sales workspace, leadership, and explicit grants." />
      <form className="cb-toolbar" method="get"><input className="cb-input cb-search-input" name="q" defaultValue={q} placeholder="Filter contacts…" aria-label="Filter contacts" /><button className="cb-btn" type="submit">Apply</button></form>
      {list.length === 0 ? <EmptyState icon={<Contact size={18} />} title={items.length ? "No contacts match" : "No contacts recorded"} description="Contacts come from governed records or the Pipedrive connector." /> : (
        <ItemList>{list.map((c) => <ItemRow key={c.id} href={urlFor({ type: "contact", id: c.id })} title={c.title} type="contact" subtitle={[c.role, accounts.get(c.accountId ?? "")].filter(Boolean).join(" · ")} meta={<span>{c.email ?? ""}</span>} />)}</ItemList>
      )}
    </>
  );
}
