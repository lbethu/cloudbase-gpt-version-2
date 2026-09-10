import Link from "next/link";
import type { ContentType, GovernedBase } from "@/domain";
import { AsideCard, DetailHeader, DetailLayout, MetaList, RelatedPanel, type DetailFact } from "@/components/ui/DetailPage";
import { BodySection, NotRecorded } from "@/components/ui/primitives";
import type { RelatedGroup } from "@/server/services/relationships";
import { RepositoryCard } from "@/components/integrations/RepositoryCard";

interface Props {
  type: ContentType;
  record: GovernedBase;
  status?: string;
  teamName: string;
  facts?: DetailFact[];
  sections: Array<{ title: string; content: React.ReactNode }>;
  related: RelatedGroup[];
  extraBadges?: React.ReactNode;
}

/** Detail-page standard applied to CROS records. */
export function CrosRecord({ type, record, status, teamName, facts = [], sections, related, extraBadges }: Props) {
  return (
    <>
      <DetailHeader type={type} title={record.title} status={status} summary={record.summary} extraBadges={extraBadges} facts={[{ label: "Owner", value: record.owner || "Unassigned" }, { label: "Team", value: <Link href={`/teams/${record.owningTeam}`}>{teamName}</Link> }, { label: "Version", value: record.version }, { label: "Last reviewed", value: record.lastReviewedAt ?? "Not yet reviewed" }, ...facts]} />
      <DetailLayout
        aside={
          <>
            <RelatedPanel groups={related} />
            <RepositoryCard repositories={record.repositories} />
            <AsideCard title="Metadata"><MetaList items={[{ label: "Id", value: <span className="cb-mono">{record.id}</span> }, { label: "Classification", value: record.classification }, { label: "Updated", value: record.updatedAt }, { label: "Tags", value: record.tags.join(", ") || undefined }]} /></AsideCard>
            <AsideCard title="Source of truth"><p className="cb-small cb-muted">CROS registry (read-only in CloudBase). Changes are made through CROS workflows with human approval.</p></AsideCard>
          </>
        }
      >
        {sections.map((s) => (
          <BodySection key={s.title} title={s.title}>{s.content ?? <NotRecorded />}</BodySection>
        ))}
      </DetailLayout>
    </>
  );
}
