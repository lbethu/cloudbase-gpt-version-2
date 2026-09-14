import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AlertTriangle, Lock } from "lucide-react";
import { getConfig } from "@/server/config";
import { getCurrentIdentity } from "@/server/auth/identity";
import { SignInForm } from "./SignInForm";
import { AccessCodeForm } from "./AccessCodeForm";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const cfg = getConfig();
  if (await getCurrentIdentity()) redirect("/");

  const misconfigured = cfg.auth.mode === "email" && !cfg.auth.sessionSecret;

  return (
    <main className="cb-signin">
      <div className="cb-signin-card">
        <div className="cb-signin-brand">
          <span className="cb-signin-mark">CB</span>
          <div>
            <strong>CloudBase AI</strong>
            <span>Cloudpoint Knowledge &amp; Intelligence Hub</span>
          </div>
        </div>

        <h1>Sign in</h1>

        {cfg.auth.mode === "email" && !misconfigured && <SignInForm />}

        {cfg.auth.mode === "code" && <AccessCodeForm />}

        {misconfigured && (
          <p className="cb-signin-problem">
            <AlertTriangle size={15} /> Email sign-in is selected but <code>CLOUDBASE_SESSION_SECRET</code> is not set, so sessions cannot be signed. Set it in the deployment configuration and redeploy.
          </p>
        )}

        {cfg.auth.mode === "none" && (
          <p className="cb-signin-problem">
            <AlertTriangle size={15} /> No sign-in method is configured for this deployment, so nobody can get in — including administrators. Set <code>CLOUDBASE_AUTH_MODE</code> to <code>code</code> (a shared code, for a demo) or <code>email</code>, and redeploy.
          </p>
        )}

        {(cfg.auth.mode === "access" || cfg.auth.mode === "entra") && (
          <p className="cb-signin-problem">
            <Lock size={15} /> This deployment signs you in through {cfg.auth.mode === "access" ? "Cloudflare Access" : "your Microsoft account"} before you reach CloudBase. If you are seeing this page, that step did not complete — reload, or tell the AI &amp; Automation team.
          </p>
        )}

        <p className="cb-signin-foot">
          Internal platform — Cloudpoint Geospatial. Access is limited to people on the Cloudpoint register, and every sign-in is recorded.
        </p>
      </div>
    </main>
  );
}
