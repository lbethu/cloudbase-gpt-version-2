import type { ContentType, GovernedBase } from "@/domain";
import { EmptyState, ItemList, ItemRow, PageHeader } from "@/components/ui/primitives";
import { urlFor } from "@/lib/urls";

interface Props<T extends GovernedBase> {
  type: ContentType;
  title: string;
  description: string;
  items: T[];
  status: (item: T) => string | undefined;
  meta?: (item: T) => React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  actions?: React.ReactNode;
}

/** Shared list view for CROS collections (ideas, evaluations, evidence, experiments, decisions). */
export function CrosCollection<T extends GovernedBase>({ type, title, description, items, status, meta, emptyTitle, emptyDescription, actions }: Props<T>) {
  return (
    <>
      <PageHeader title={title} description={description} actions={actions} />
      {items.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <ItemList>
          {items.map((item) => (
            <ItemRow key={item.id} href={urlFor({ type, id: item.id })} title={item.title} subtitle={item.summary} status={status(item)} meta={meta?.(item)} />
          ))}
        </ItemList>
      )}
    </>
  );
}
