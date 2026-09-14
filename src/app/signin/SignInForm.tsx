"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { requestCodeAction, verifyCodeAction, type SignInState } from "@/server/actions/signin";

/**
 * Two steps, one at a time: the address, then the code sent to it.
 *
 * The first step's reply is the same whether or not the address may sign in —
 * a sign-in page that says "no such user" is a way to find out who works here.
 */
export function SignInForm() {
  const [requestState, requestAction, requesting] = useActionState<SignInState, FormData>(requestCodeAction, { stage: "email" });
  const [verifyState, verifyAction, verifying] = useActionState<SignInState, FormData>(verifyCodeAction, { stage: "code" });
  const [restart, setRestart] = useState(false);

  const onCodeStep = requestState.stage === "code" && !restart;
  const email = verifyState.email || requestState.email || "";

  if (!onCodeStep) {
    return (
      <form action={requestAction} className="cb-signin-form">
        <label className="cb-signin-label" htmlFor="email">
          Work email address
        </label>
        <input id="email" className="cb-input" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@cloudpointgeo.com" defaultValue={requestState.email} required autoFocus />
        <button className="cb-btn cb-btn--primary cb-signin-submit" disabled={requesting}>
          <Mail /> {requesting ? "Sending…" : "Email me a sign-in code"}
        </button>
        {requestState.message && <p className={`cb-small ${requestState.ok ? "cb-muted" : "cb-sev cb-sev--high"}`}>{requestState.message}</p>}
        <p className="cb-subtle cb-small cb-signin-note">CloudBase has no password. We email a six-digit code to confirm it is you; access itself is decided by the Cloudpoint people register.</p>
      </form>
    );
  }

  return (
    <form action={verifyAction} className="cb-signin-form">
      <p className="cb-small cb-muted" style={{ margin: 0 }}>{requestState.message}</p>
      <input type="hidden" name="email" value={email} />
      <label className="cb-signin-label" htmlFor="code">
        Six-digit code
      </label>
      <input id="code" className="cb-input cb-signin-code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" maxLength={6} placeholder="000000" required autoFocus />
      <button className="cb-btn cb-btn--primary cb-signin-submit" disabled={verifying}>
        <ShieldCheck /> {verifying ? "Checking…" : "Sign in"}
      </button>
      {verifyState.message && <p className="cb-small cb-sev cb-sev--high">{verifyState.message}</p>}
      <button type="button" className="cb-btn cb-signin-back" onClick={() => setRestart(true)}>
        <ArrowLeft /> Use a different address
      </button>
    </form>
  );
}
