import Link from "next/link";
import { DatabaseZap, LogIn, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { getConfig } from "@/server/config";
import { getRepositories, storageDegradedReason } from "@/server/repositories";
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
  // Serving the built-in registry because the database could not be read. Say
  // so on every page: content that may be out of date must never be mistaken
  // for the live library.
  const degraded = storageDegradedReason();
  return (
    <AppShell permissions={viewer.permissions} viewer={shellViewer} environmentLabel={viewer.environmentLabel} inboxCount={inboxCount} developerCredit={cfg.branding.developer} canSignOut={cfg.auth.mode === "email" || cfg.auth.mode === "code"}>
      {degraded && viewer.identity && (
        <div className="cb-banner cb-banner--warn" role="status">
          <DatabaseZap size={16} />
          <div>
            <strong>Showing the built-in library — the database is not reachable.</strong>
            <span>
              You can search and read every SOP that ships with CloudBase, but anything uploaded or approved since is not shown, and uploading and approving are paused until the
              connection is restored. Nothing has been lost.
            </span>
          </div>
        </div>
      )}
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
                ? cfg.auth.modeNote || "No sign-in method is configured for this deployment, so nobody can get in — including administrators. Set CLOUDBASE_AUTH_MODE to code (a shared code, for a demo) or email, and redeploy."
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
