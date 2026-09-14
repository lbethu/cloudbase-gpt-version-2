"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { accessCodeAction, type SignInState } from "@/server/actions/signin";

/**
 * Demo access. Asks for a name as well as the code — not as a security
 * measure, but so the access log says who was looking rather than recording a
 * row of identical anonymous entries.
 */
export function AccessCodeForm() {
  const [state, action, pending] = useActionState<SignInState, FormData>(accessCodeAction, { stage: "email" });
  return (
    <form action={action} className="cb-signin-form">
      <label className="cb-signin-label" htmlFor="name">
        Your name
      </label>
      <input id="name" className="cb-input" name="name" autoComplete="name" placeholder="Jane Smith" defaultValue={state.email} required autoFocus />

      <label className="cb-signin-label" htmlFor="code">
        Access code
      </label>
      <input id="code" className="cb-input" name="code" type="password" autoComplete="off" placeholder="Shared with you by the AI &amp; Automation team" required />

      <button className="cb-btn cb-btn--primary cb-signin-submit" disabled={pending}>
        <KeyRound /> {pending ? "Checking…" : "Open CloudBase"}
      </button>
      {state.message && <p className="cb-small cb-sev cb-sev--high">{state.message}</p>}
      <p className="cb-subtle cb-small cb-signin-note">
        This is an R&amp;D preview. The code gives read-only access: you can search and read SOPs, but not upload, approve or change anything. Please do not forward the link or the code outside Cloudpoint.
      </p>
    </form>
  );
}
