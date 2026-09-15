"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { accessCodeAction, type SignInState } from "@/server/actions/signin";

/**
 * Preview access.
 *
 * When each person has their own code, the code says who they are and the form
 * asks for nothing else. With a single shared code it cannot, so it asks for a
 * name — not as a security measure, but so the access log says who was looking
 * rather than recording a row of identical anonymous entries.
 */
export function AccessCodeForm({ personal }: { personal: boolean }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(accessCodeAction, { stage: "email" });
  return (
    <form action={action} className="cb-signin-form">
      {!personal && (
        <>
          <label className="cb-signin-label" htmlFor="name">
            Your name
          </label>
          <input id="name" className="cb-input" name="name" autoComplete="name" placeholder="Jane Smith" defaultValue={state.email} required autoFocus />
        </>
      )}

      <label className="cb-signin-label" htmlFor="code">
        Your access code
      </label>
      <input
        id="code"
        className="cb-input"
        name="code"
        type="password"
        autoComplete="off"
        placeholder={personal ? "The code sent to you" : "Shared with you by the AI & Automation team"}
        required
        autoFocus={personal}
      />

      <button className="cb-btn cb-btn--primary cb-signin-submit" disabled={pending}>
        <KeyRound /> {pending ? "Checking…" : "Open CloudBase"}
      </button>
      {state.message && <p className="cb-small cb-sev cb-sev--high">{state.message}</p>}
      <p className="cb-subtle cb-small cb-signin-note">
        This is an R&amp;D preview. Your code gives read-only access: you can search and read SOPs, but not upload, approve or change anything. It is yours alone — please do not pass it or the link on.
      </p>
    </form>
  );
}
