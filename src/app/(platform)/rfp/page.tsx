import type { Metadata } from "next";
import Link from "next/link";
import { Scale } from "lucide-react";
import { Callout, EmptyState, ItemList, ItemRow, PageHeader, Section } from "@/components/ui/primitives";
import { getRepositories } from "@/server/repositories";
import { filterVisible } from "@/server/services/access";
import { teamName } from "@/server/services/catalog";
import { getViewer } from "@/server/services/viewer";
import { urlFor } from "@/lib/urls";

export const metadata: Metadata = { title: "RFP Intelligence" };

const KINDS: Record<string, string> = { "opportunity-evaluation": "Opportunity evaluations", "proposal-guide": "Proposal guides", "compliance-guidance": "Compliance guidance", "submission-guide": "Submission instructions", "lessons-learned": "Lessons learned", "approved-prompt": "Approved prompts / instructions" };

export default async function RfpPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const viewer = await getViewer();
  if (!viewer.has("knowledge.read")) return <Callout tone="warning" title="Not authorized">RFP Intelligence requires knowledge.read.</Callout>;
  const { kind } = await searchParams;
  const repos = getRepositories();
  const all = filterVisible(viewer.identity, "rfp", repos.rfp.list());
  const list = all.filter((r) => !kind || r.kind === kind);
  const sops = ["sop-209", "sop-209-1-checklist-sl-proposal-requirements", "sop-209-2-checklist-steps-for-closing-a-won-deal", "sop-107", "sop-223"].map((id) => repos.sops.get(id)).filter((s): s is NonNullable<typeof s> => !!s);
  const rnd = repos.cros.rndProject("CP-RND-006");
  const cap = repos.cros.capability("CAP-006");
  return (
    <>
      <PageHeader eyebrow="Intelligence" title="RFP & Proposal Intelligence" description="Opportunity evaluation, proposal guidance, compliance, reusable project references, partner considerations, award criteria and lessons learned. Confidential proposal content is restricted to authorized users." actions={<><Link className="cb-btn cb-btn--primary" href="/rfp/standard">How we build an RFP Evaluation Assistant</Link>{rnd && <Link className="cb-btn" href={urlFor({ type: "rnd-project", id: rnd.id })}>RFP Appraisal Engine (R&D)</Link>}</>} />
      <div className="cb-chip-row" style={{ marginBottom: 18 }}>
        <Link className="cb-chip" aria-pressed={!kind} href="/rfp">All ({all.length})</Link>
        {Object.entries(KINDS).map(([k, label]) => <Link key={k} className="cb-chip" aria-pressed={kind === k} href={`/rfp?kind=${k}`}>{label}</Link>)}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={<Scale size={18} />} title={all.length ? "No records of this kind" : "No governed RFP intelligence records yet"} description="Opportunity evaluations, guides and lessons learned are added as governed records. Actual RFP documents are never published here; they remain access-controlled." />
      ) : (
        <ItemList>{list.map((r) => <ItemRow key={r.id} href={urlFor({ type: "rfp", id: r.id })} title={r.title} type="rfp" status={r.status} subtitle={r.summary} meta={<><span>{KINDS[r.kind]}</span>{r.decision && <span className="cb-badge cb-badge--outline">{r.decision}</span>}<span>{teamName(r.owningTeam)}</span></>} />)}</ItemList>
      )}
      <div className="cb-grid cb-grid--2" style={{ marginTop: 36, gap: 32 }}>
        <Section title="Related SOPs">
          {sops.length ? <ItemList>{sops.map((s) => <ItemRow key={s.id} href={urlFor({ type: "sop", id: s.id })} title={s.title} type="sop" meta={s.sopNumber ? <span className="cb-mono">SOP {s.sopNumber}</span> : undefined} />)}</ItemList> : <EmptyState title="No related SOPs" />}
        </Section>
        <Section title="Decision vocabulary">
          <div className="cb-card cb-card--pad">
            <p><b>GO</b> — pursue; no blocking gaps.</p>
            <p style={{ marginTop: 8 }}><b>CONDITIONAL_GO</b> — pursue only if named conditions are met.</p>
            <p style={{ marginTop: 8 }}><b>NO_GO</b> — do not pursue; reasons recorded for learning.</p>
            <p className="cb-muted cb-small" style={{ marginTop: 12 }}>The assistant recommends; an authorized human records the pursuit decision. {cap && <Link href={urlFor({ type: "capability", id: cap.id })} style={{ fontWeight: 600 }}>{cap.code} {cap.title}</Link>}</p>
          </div>
        </Section>
      </div>
    </>
  );
}
