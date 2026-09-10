import { EmptyState } from "@/components/ui/primitives";

export default function NotFound() {
  return <EmptyState title="Not found" description="This knowledge object does not exist or you are not authorized to view it." action={{ label: "Search Cloudpoint knowledge", href: "/search" }} />;
}
