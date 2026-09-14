import Link from "next/link";
import { LogIn, ShieldAlert } from "lucide-react";
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
    <AppShell permissions={viewer.permissions} viewer={shellViewer} environmentLabel={viewer.environmentLabel} inboxCount={inboxCount} developerCredit={cfg.branding.developer} canSignOut={cfg.auth.mode === "email" || cfg.auth.mode === "code"}>
      {viewer.identity ? (
        children
      ) : (
        <div className="cb-empty" style={{ marginTop: 48 }}>
          <div className="cb-empty-icon">
            <ShieldAlert size={18} />
          </div>
          <h3>Sign-in required</h3>
          <p>
            {cfg.auth.mode === "email"
              ? "CloudBase serves people on the Cloudpoint register. Sign in with your work email address and we will send you a code."
              : cfg.auth.mode === "code"
              ? "This is an R&D preview of CloudBase. Enter the access code you were given to look around."
              : cfg.auth.mode === "none"
                ? "No sign-in method is configured for this deployment, so nobody can get in — including administrators. Set CLOUDBASE_AUTH_MODE to email, access or entra and redeploy."
                : "CloudBase AI only serves authenticated Cloudpoint employees. Your identity could not be established for this request."}
          </p>
          {(cfg.auth.mode === "email" || cfg.auth.mode === "code") && (
            <Link className="cb-btn cb-btn--primary" href="/signin" style={{ marginTop: 12 }}>
              <LogIn /> Sign in
            </Link>
          )}
        </div>
      )}
    </AppShell>
  );
}
