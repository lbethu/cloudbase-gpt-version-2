import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/server/auth/identity";
import { clearSession } from "@/server/auth/session";
import { recordAudit } from "@/server/services/audit";

export const dynamic = "force-dynamic";

/** Ends the session. POST only, so a link in an email cannot sign someone out. */
export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  await clearSession();
  await recordAudit({ actor: identity?.subject ?? "anonymous", action: "auth.sign-out", outcome: "allowed", detail: {} });
  return NextResponse.redirect(new URL("/signin", request.url), { status: 303 });
}
