import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getConfig } from "@/server/config";

/**
 * The session cookie.
 *
 * A signed JWT holding nothing but the email address and an expiry. Roles are
 * never carried in the cookie: they are looked up from the people register on
 * every request, so revoking someone takes effect immediately rather than when
 * their session happens to expire.
 *
 * httpOnly so script cannot read it, sameSite=lax so it does not ride along
 * with cross-site requests, secure in production.
 */

const COOKIE = "cb_session";
const ISSUER = "cloudbase";

const key = () => new TextEncoder().encode(getConfig().auth.sessionSecret);

export async function createSession(email: string): Promise<void> {
  const hours = getConfig().auth.sessionHours;
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${hours}h`)
    .sign(key());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: getConfig().env === "production",
    path: "/",
    maxAge: hours * 3600,
  });
}

export async function readSessionEmail(): Promise<string | null> {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, key(), { issuer: ISSUER });
    return typeof payload.email === "string" ? payload.email.toLowerCase() : null;
  } catch {
    // Expired, tampered with, or signed by a different secret — all the same answer.
    return null;
  }
}

/** Reads a session from a bare Request (route handlers, which have no cookies() scope). */
export async function readSessionEmailFrom(headers: Headers): Promise<string | null> {
  const raw = headers.get("cookie") ?? "";
  const match = raw.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!match) return null;
  try {
    const { payload } = await jwtVerify(decodeURIComponent(match.slice(COOKIE.length + 1)), key(), { issuer: ISSUER });
    return typeof payload.email === "string" ? payload.email.toLowerCase() : null;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  (await cookies()).set(COOKIE, "", { httpOnly: true, sameSite: "lax", secure: getConfig().env === "production", path: "/", maxAge: 0 });
}
