import { ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { getConfig } from "@/server/config";
import { getRepositories } from "@/server/repositories";
import { deriveReviewTasks } from "@/server/services/reviews";
import { getViewer, initialsOf } from "@/server/services/viewer";

export const dynamic = "force-dynamic";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  const cfg = getConfig();
  const shellViewer = viewer.identity
    ? { name: viewer.identity.name || viewer.identity.email, detail: viewer.teamNames.slice(0, 2).join(" · ") || viewer.identity.email, initials: initialsOf(viewer.identity.name || viewer.identity.email) }
    : null;

  const inboxCount = viewer.has("review.read") ? deriveReviewTasks(getRepositories()).filter((t) => viewer.has(t.requiredPermission)).length : 0;
  return (
    <AppShell permissions={viewer.permissions} viewer={shellViewer} environmentLabel={viewer.environmentLabel} inboxCount={inboxCount} developerCredit={cfg.branding.developer}>
      {viewer.identity ? (
        children
      ) : (
        <div className="cb-empty" style={{ marginTop: 48 }}>
          <div className="cb-empty-icon">
            <ShieldAlert size={18} />
          </div>
          <h3>Sign-in required</h3>
          <p>
            CloudBase AI only serves authenticated Cloudpoint employees. {cfg.auth.mode === "none" ? "No identity provider is configured for this deployment — configure Microsoft Entra ID (CLOUDBASE_AUTH_MODE=entra) behind the authenticating proxy." : "Your identity could not be established for this request."}
          </p>
        </div>
      )}
    </AppShell>
  );
}
