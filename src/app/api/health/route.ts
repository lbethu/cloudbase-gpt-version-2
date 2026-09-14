import { NextResponse } from "next/server";
import { getConfig } from "@/server/config";

/**
 * Deployment self-check, readable without signing in.
 *
 * When a hosted deployment will not let anybody in, the question is always the
 * same: did the environment variables actually reach the running instance? This
 * answers exactly that and nothing more — which mode is active and whether the
 * values it depends on are present. It reports booleans, never values, so no
 * code, secret, key or connection string passes through it.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const cfg = getConfig();
  return NextResponse.json({
    ok: cfg.auth.mode !== "none",
    env: cfg.env,
    auth: {
      mode: cfg.auth.mode,
      accessCodeSet: cfg.auth.accessCode.length > 0,
      adminCodeSet: cfg.auth.adminCode.length > 0,
      sessionSecretSet: cfg.auth.sessionSecret.length > 0,
    },
    storage: cfg.storage.mode,
    blob: cfg.blob.mode,
    hint:
      cfg.auth.mode === "none"
        ? "No sign-in method is active. Set CLOUDBASE_AUTH_MODE=code and CLOUDBASE_ACCESS_CODE in the deployment environment (Production scope), then redeploy."
        : undefined,
  });
}
