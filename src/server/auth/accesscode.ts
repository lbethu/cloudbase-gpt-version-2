import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { getConfig } from "@/server/config";

/**
 * Shared-code access, for showing the platform to people before it has a real
 * identity provider.
 *
 * Be clear-eyed about what this is. A shared code is not authentication: it
 * proves someone was told the code, not who they are. Anyone it is forwarded
 * to can get in, and the name recorded against their session is whatever they
 * typed. It is therefore deliberately limited:
 *
 *  - CLOUDBASE_ACCESS_CODES gives each person their own code, which is the
 *    better shape: access can be withdrawn from one person without disturbing
 *    the others, and the access log carries the name the code belongs to
 *    rather than one the visitor typed about themselves.
 *  - Everyone who enters a preview code is a **read-only guest**. They can
 *    find and read SOPs; they cannot upload, approve, retire, delete, or open
 *    the governance centre.
 *  - A second, separate code (CLOUDBASE_ADMIN_CODE) grants the roles the
 *    people register gives that address — so the ability to change governed
 *    records never rides on the code that gets shared around.
 *  - Sessions are marked as guest so the audit trail can say that the actor is
 *    self-declared rather than proven.
 *
 * It is the right tool for an R&D demo with a fixed audience, and the wrong
 * one for day-to-day use by a growing team. Move to email sign-in
 * (CLOUDBASE_AUTH_MODE=email) once the platform is something people rely on.
 */

const constantTimeEqual = (a: string, b: string): boolean => {
  // Hash first so the comparison is over fixed-length buffers: comparing raw
  // strings of different lengths leaks the length.
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
};

export type CodeCheck = { ok: true; level: "guest" | "member"; name?: string } | { ok: false };

export function checkAccessCode(submitted: string): CodeCheck {
  const { accessCode, adminCode, personalCodes } = getConfig().auth;
  const value = submitted.trim();
  if (!value) return { ok: false };

  if (adminCode && constantTimeEqual(value, adminCode)) return { ok: true, level: "member" };

  // Every personal code is compared, and the match is remembered rather than
  // returned early, so the time taken does not reveal how far down the list a
  // code sits — or whether it matched at all.
  let matched: string | undefined;
  for (const person of personalCodes) if (constantTimeEqual(value, person.code)) matched = person.name;
  if (matched) return { ok: true, level: "guest", name: matched };

  if (accessCode && constantTimeEqual(value, accessCode)) return { ok: true, level: "guest" };
  return { ok: false };
}

/** Whether this deployment issues a code per person, rather than one shared code. */
export function hasPersonalCodes(): boolean {
  return getConfig().auth.personalCodes.length > 0;
}
