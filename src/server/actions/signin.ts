"use server";

import { redirect } from "next/navigation";
import { getConfig } from "@/server/config";
import { requestSignInCode, verifySignInCode } from "@/server/auth/signin";
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

export async function signOutAction(): Promise<void> {
  await clearSession();
  redirect("/signin");
}
