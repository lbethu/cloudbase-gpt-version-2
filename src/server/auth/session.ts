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

export interface SessionClaims {
  email: string;
  /** Guest sessions come from the shared demo code: read-only, and the name is self-declared. */
  guest?: boolean;
  name?: string;
}

export async function createSession(claims: string | SessionClaims): Promise<void> {
  const payload: SessionClaims = typeof claims === "string" ? { email: claims } : claims;
  const hours = getConfig().auth.sessionHours;
  const token = await new SignJWT({ ...payload })
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
  return (await readSession())?.email ?? null;
}

export async function readSession(): Promise<SessionClaims | null> {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    return token ? await verify(token) : null;
  } catch {
    // Expired, tampered with, or signed by a different secret — all the same answer.
    return null;
  }
}

async function verify(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, key(), { issuer: ISSUER });
    if (typeof payload.email !== "string") return null;
    return { email: payload.email.toLowerCase(), guest: payload.guest === true, name: typeof payload.name === "string" ? payload.name : undefined };
  } catch {
    return null;
  }
}

/** Reads a session from a bare Request (route handlers, which have no cookies() scope). */
export async function readSessionFrom(headers: Headers): Promise<SessionClaims | null> {
  const raw = headers.get("cookie") ?? "";
  const match = raw.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  return match ? verify(decodeURIComponent(match.slice(COOKIE.length + 1))) : null;
}

export async function readSessionEmailFrom(headers: Headers): Promise<string | null> {
  return (await readSessionFrom(headers))?.email ?? null;
}

export async function clearSession(): Promise<void> {
  (await cookies()).set(COOKIE, "", { httpOnly: true, sameSite: "lax", secure: getConfig().env === "production", path: "/", maxAge: 0 });
}
