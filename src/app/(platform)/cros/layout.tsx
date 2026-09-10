import { Callout } from "@/components/ui/primitives";
import { CrosNav } from "@/components/cros/CrosNav";
import { getViewer } from "@/server/services/viewer";

export default async function CrosLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  if (!viewer.has("rnd.read")) return <Callout tone="warning" title="Not authorized">CROS requires rnd.read.</Callout>;
  return (
    <>
      <div style={{ marginBottom: 6 }}>
        <span className="cb-eyebrow">CROS — Cloudpoint Research Operating System</span>
      </div>
      <CrosNav />
      {children}
    </>
  );
}
