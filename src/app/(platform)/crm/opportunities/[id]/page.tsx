import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OPPORTUNITY_STAGE_LABELS } from "@/domain";
import { Badge } from "@/components/ui/Badge";
import { AsideCard, DetailHeader, DetailLayout, MetaList, RelatedPanel } from "@/components/ui/DetailPage";
import { BodySection, ItemList, ItemRow, NotRecorded } from "@/components/ui/primitives";
import { relatedFor, teamName } from "@/server/services/catalog";
import { crmAccounts, crmContacts, crmOpportunities } from "@/server/services/crm";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

const statusOf = (r: Record<string, unknown>) => (typeof r.stage === "string" ? OPPORTUNITY_STAGE_LABELS[r.stage as keyof typeof OPPORTUNITY_STAGE_LABELS] : typeof r.status === "string" ? r.status : undefined);
const decisionOf = (r: Record<string, unknown>) => (typeof r.rfpDecision === "string" ? r.rfpDecision : undefined);

export const metadata: Metadata = { title: "Opportunity" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  const TYPE = "opportunity" as string;
  const found = (await crmOpportunities(viewer.identity!)).items.find((r) => r.id === id);
  if (!found) notFound();
  const record = found as Record<string, unknown> & typeof found;
  const accounts = (await crmAccounts(viewer.identity!)).items;
  const contacts = (await crmContacts(viewer.identity!)).items;
  const opps = (await crmOpportunities(viewer.identity!)).items;
  const accountId = "accountId" in record ? record.accountId : record.id;
  const account = accounts.find((a) => a.id === accountId);
  const related = relatedFor(viewer.identity, { type: "opportunity", id: record.id });
  const entries = Object.entries(record as Record<string, unknown>).filter(([k, v]: [string, unknown]) => !["id", "uuid", "title", "summary", "owningTeam", "teams", "owner", "classification", "accessGrants", "tags", "createdAt", "updatedAt", "lastReviewedAt", "version", "repositories", "externalIds", "accountId"].includes(k) && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0));
  return (
    <>
      <DetailHeader type="opportunity" title={record.title} status={statusOf(record)} summary={record.summary} extraBadges={decisionOf(record) ? <Badge tone={decisionOf(record) === "GO" ? "success" : decisionOf(record) === "NO_GO" ? "danger" : "warning"}>{decisionOf(record)}</Badge> : null} facts={[{ label: "Owner", value: record.owner || "Unassigned" }, { label: "Team", value: <Link href={`/teams/${record.owningTeam}`}>{teamName(record.owningTeam)}</Link> }, { label: "Account", value: account && account.id !== record.id ? <Link href={urlFor({ type: "account", id: account.id })}>{account.title}</Link> : undefined }, { label: "Classification", value: record.classification }, { label: "Updated", value: record.updatedAt }]} />
      <DetailLayout aside={<><RelatedPanel groups={related} /><AsideCard title="External ids"><MetaList items={Object.entries(record.externalIds).map(([k, v]) => ({ label: k, value: <span className="cb-mono">{v}</span> }))} /></AsideCard></>}>
        {entries.map(([k, v]) => <BodySection key={k} title={k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}>{Array.isArray(v) ? <ul>{(v as unknown[]).map((x, i) => <li key={i}>{String(x)}</li>)}</ul> : <p>{String(v)}</p>}</BodySection>)}
        {TYPE === "account" && <BodySection title="Opportunities">{opps.filter((o) => o.accountId === record.id).length ? <ItemList>{opps.filter((o) => o.accountId === record.id).map((o) => <ItemRow key={o.id} href={urlFor({ type: "opportunity", id: o.id })} title={o.title} type="opportunity" status={OPPORTUNITY_STAGE_LABELS[o.stage]} />)}</ItemList> : <NotRecorded>No opportunities for this account.</NotRecorded>}</BodySection>}
        {TYPE === "account" && <BodySection title="Contacts">{contacts.filter((c) => c.accountId === record.id).length ? <ItemList>{contacts.filter((c) => c.accountId === record.id).map((c) => <ItemRow key={c.id} href={urlFor({ type: "contact", id: c.id })} title={c.title} type="contact" subtitle={c.role} />)}</ItemList> : <NotRecorded>No contacts recorded.</NotRecorded>}</BodySection>}
        {TYPE === "opportunity" && <BodySection title="Governing process"><ul><li><Link href="/sops/sop-216">SOP 216 — Inbound Lead Qualification</Link></li><li><Link href="/sops/sop-209">SOP 209 — Creating and Sending Proposals and Quotes</Link></li><li><Link href="/rfp">RFP Intelligence — GO / CONDITIONAL_GO / NO_GO</Link></li><li><Link href="/sops/sop-223">SOP 223 — Project Reference Creation (after award)</Link></li></ul></BodySection>}
      </DetailLayout>
    </>
  );
}
