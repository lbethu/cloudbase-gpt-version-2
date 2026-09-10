import Link from "next/link";
import { Callout } from "@/components/ui/primitives";
import { getViewer } from "@/server/services/viewer";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  if (!viewer.has("crm.read")) return <Callout tone="warning" title="Not authorized">The CRM workspace requires the Sales role (crm.read).</Callout>;
  return (
    <>
      <div style={{ marginBottom: 6 }}><span className="cb-eyebrow">CRM · Client & Opportunity Intelligence</span></div>
      <nav className="cb-chip-row" aria-label="CRM sections" style={{ marginBottom: 22 }}>
        {[["Pipeline", "/crm"], ["Accounts", "/crm/accounts"], ["Contacts", "/crm/contacts"], ["Opportunities", "/crm/opportunities"], ["Sales dashboard", "/dashboards/sales"]].map(([l, h]) => <Link key={h} href={h} className="cb-chip">{l}</Link>)}
      </nav>
      {children}
    </>
  );
}
