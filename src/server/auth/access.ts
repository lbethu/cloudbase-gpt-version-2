import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { getConfig } from "@/server/config";

/**
 * Cloudflare Access identity.
 *
 * Access sits in front of the application and authenticates the visitor before
 * a request ever reaches it, then forwards a signed assertion. This gives
 * Cloudpoint real sign-in with no directory administration: people receive a
 * one-time code at their work address, or sign in with Microsoft or Google if
 * that is configured later.
 *
 * The security of this rests on one thing: the assertion is a JWT signed by
 * the team's own key set, and it is **verified** here — issuer, audience and
 * signature. The convenience header Access also sends
 * (`cf-access-authenticated-user-email`) is never trusted on its own, because
 * anything that can reach the origin can set a header. If the origin is
 * reachable without going through Access, an unverified header would be a
 * complete bypass; a verified signature is not.
 *
 * Configuration: CLOUDBASE_ACCESS_TEAM_DOMAIN (e.g. cloudpoint.cloudflareaccess.com)
 * and CLOUDBASE_ACCESS_AUD (the Application Audience tag from the Access app).
 */

export interface AccessPrincipal {
  email: string;
  subject: string;
  identityNonce?: string;
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
let jwksKey = "";

function keySet(teamDomain: string) {
  const url = `https://${teamDomain}/cdn-cgi/access/certs`;
  if (!jwks || jwksKey !== url) {
    jwks = createRemoteJWKSet(new URL(url));
    jwksKey = url;
  }
  return jwks;
}

/** Verifies the Access assertion and returns the authenticated principal, or null. */
export async function verifyAccessJwt(token: string): Promise<AccessPrincipal | null> {
  const { accessTeamDomain, accessAud } = getConfig().auth;
  if (!token || !accessTeamDomain || !accessAud) return null;
  try {
    const { payload } = await jwtVerify(token, keySet(accessTeamDomain), {
      issuer: `https://${accessTeamDomain}`,
      audience: accessAud,
    });
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : "";
    if (!email) return null;
    return { email, subject: typeof payload.sub === "string" && payload.sub ? payload.sub : email, identityNonce: typeof payload.identity_nonce === "string" ? payload.identity_nonce : undefined };
  } catch {
    // Expired, wrong audience, wrong issuer, bad signature — all the same answer.
    return null;
  }
}

export const ACCESS_JWT_HEADER = "cf-access-jwt-assertion";
