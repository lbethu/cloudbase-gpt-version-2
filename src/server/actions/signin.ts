"use server";

import { redirect } from "next/navigation";
import { getConfig } from "@/server/config";
import { requestSignInCode, verifySignInCode } from "@/server/auth/signin";
import { checkAccessCode, hasPersonalCodes } from "@/server/auth/accesscode";
import { clearSession, createSession } from "@/server/auth/session";
import { recordAudit } from "@/server/services/audit";

export interface SignInState {
  stage: "email" | "code";
  email?: string;
  message?: string;
  ok?: boolean;
}

/** Step one: ask for a code. Answers identically whether or not the address is known. */
export async function requestCodeAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (getConfig().auth.mode !== "email") return { stage: "email", message: "Email sign-in is not enabled for this deployment." };
  const email = String(formData.get("email") ?? "").trim();
  const result = await requestSignInCode(email);
  await recordAudit({ actor: email.toLowerCase() || "anonymous", action: "auth.code-requested", outcome: result.ok ? "allowed" : "error", detail: { ok: result.ok } });
  if (!result.ok) return { stage: "email", email, message: result.error };
  return { stage: "code", email, ok: true, message: `If ${email} may use CloudBase, a six-digit code is on its way. It expires in 10 minutes.` };
}

/** Step two: check the code and start a session. */
export async function verifyCodeAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (getConfig().auth.mode !== "email") return { stage: "email", message: "Email sign-in is not enabled for this deployment." };
  const email = String(formData.get("email") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const result = await verifySignInCode(email, code);
  await recordAudit({ actor: email.toLowerCase() || "anonymous", action: "auth.sign-in", outcome: result.ok ? "allowed" : "denied", detail: {} });
  if (!result.ok) return { stage: "code", email, message: result.error };
  await createSession(result.email);
  redirect("/");
}

/** Shared-code sign-in for a demo deployment. */
export async function accessCodeAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (getConfig().auth.mode !== "code") return { stage: "email", message: "Code access is not enabled for this deployment." };
  const typedName = String(formData.get("name") ?? "").trim().slice(0, 80);
  const code = String(formData.get("code") ?? "");
  const personal = hasPersonalCodes();
  // With a code per person the code says who they are, so no name is asked
  // for. Only the shared-code form needs one, and then only for the log.
  if (!personal && !typedName) return { stage: "email", message: "Enter your name so the access log means something." };

  const check = checkAccessCode(code);
  // The name a personal code belongs to is known, not claimed; a typed one is
  // whatever the visitor felt like writing. The log distinguishes the two.
  const name = (check.ok && check.name) || typedName;
  await recordAudit({
    actor: name || "anonymous",
    action: "auth.code-access",
    outcome: check.ok ? "allowed" : "denied",
    detail: { level: check.ok ? check.level : undefined, selfDeclared: !(check.ok && check.name) },
  });
  if (!check.ok) return { stage: "email", email: typedName, message: "That access code is not correct." };

  // A guest session grants reading only. The member path still requires the
  // address to be in the people register.
  const asEmail = /@/.test(name) ? name.toLowerCase() : `${name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}@guest.cloudbase`;
  await createSession(check.level === "member" ? { email: asEmail } : { email: asEmail, guest: true, name });
  redirect("/");
}

export async function signOutAction(): Promise<void> {
  await clearSession();
  redirect("/signin");
}
