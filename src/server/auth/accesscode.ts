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
 *  - Everyone who enters the shared code is a **read-only guest**. They can
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

export type CodeCheck = { ok: true; level: "guest" | "member" } | { ok: false };

export function checkAccessCode(submitted: string): CodeCheck {
  const { accessCode, adminCode } = getConfig().auth;
  const value = submitted.trim();
  if (!value || !accessCode) return { ok: false };
  if (adminCode && constantTimeEqual(value, adminCode)) return { ok: true, level: "member" };
  if (constantTimeEqual(value, accessCode)) return { ok: true, level: "guest" };
  return { ok: false };
}
