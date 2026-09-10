import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { getConfig } from "@/server/config";

/**
 * Identity seam.
 *
 * The application never trusts client-supplied identity. In production the
 * only supported provider is Microsoft Entra ID via a trusted reverse proxy
 * (Azure App Service "Easy Auth" / Static Web Apps / Front Door) that
 * authenticates the user and injects `x-ms-client-principal`. The proxy MUST
 * strip that header from inbound requests. A direct token-validating provider
 * can be added here without touching business logic.
 */
export interface Identity {
  subject: string;
  name: string;
  email: string;
  roles: string[];
  teams: string[];
  tenantId: string;
  provider: "dev" | "entra";
}

export interface IdentityProvider {
  readonly name: string;
  resolve(requestHeaders: Headers): Promise<Identity | null>;
}

class DevIdentityProvider implements IdentityProvider {
  readonly name = "dev";
  async resolve(): Promise<Identity | null> {
    const cfg = getConfig();
    if (cfg.env === "production") return null; // hard stop — never in production
    const d = cfg.auth.dev;
    return { subject: d.subject, name: d.name, email: d.email, roles: d.roles, teams: d.teams, tenantId: cfg.auth.tenantId, provider: "dev" };
  }
}

interface ClientPrincipalClaim {
  typ: string;
  val: string;
}
interface ClientPrincipal {
  auth_typ?: string;
  name_typ?: string;
  role_typ?: string;
  claims?: ClientPrincipalClaim[];
}

class EntraEasyAuthIdentityProvider implements IdentityProvider {
  readonly name = "entra";
  async resolve(requestHeaders: Headers): Promise<Identity | null> {
    const raw = requestHeaders.get("x-ms-client-principal");
    if (!raw) return null;
    let principal: ClientPrincipal;
    try {
      principal = JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as ClientPrincipal;
    } catch {
      return null;
    }
    const claims = principal.claims ?? [];
    const claim = (types: string[]) => claims.find((c) => types.includes(c.typ))?.val ?? "";
    const subject = claim(["http://schemas.microsoft.com/identity/claims/objectidentifier", "oid", "sub"]);
    if (!subject) return null;
    const cfg = getConfig();
    const groups = claims.filter((c) => c.typ === "groups").map((c) => c.val);
    const roles = new Set<string>(["employee"]);
    const teams = new Set<string>(["company-wide"]);
    for (const g of groups) {
      const role = cfg.auth.entraGroupRoleMap[g];
      if (role) roles.add(role);
      const team = cfg.auth.entraGroupTeamMap[g];
      if (team) teams.add(team);
    }
    // App roles assigned in Entra arrive as `roles` claims and map 1:1 to CloudBase role ids.
    for (const r of claims.filter((c) => c.typ === "roles").map((c) => c.val)) roles.add(r);
    return {
      subject,
      name: claim(["name", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]) || claim(["preferred_username"]),
      email: claim(["preferred_username", "email", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]),
      roles: [...roles],
      teams: [...teams],
      tenantId: claim(["tid", "http://schemas.microsoft.com/identity/claims/tenantid"]) || cfg.auth.tenantId,
      provider: "entra",
    };
  }
}

export function getIdentityProvider(): IdentityProvider | null {
  const mode = getConfig().auth.mode;
  if (mode === "dev") return new DevIdentityProvider();
  if (mode === "entra") return new EntraEasyAuthIdentityProvider();
  return null;
}

/** Resolves the current request's identity once per request (React cache). */
export const getCurrentIdentity = cache(async (): Promise<Identity | null> => {
  const provider = getIdentityProvider();
  if (!provider) return null;
  try {
    const h = await headers();
    return provider.resolve(h);
  } catch {
    // Called outside a request scope (e.g. build-time prerender) — no identity.
    return null;
  }
});

/** Identity resolution for route handlers that already hold a Request. */
export async function resolveIdentityFromRequest(request: Request): Promise<Identity | null> {
  const provider = getIdentityProvider();
  return provider ? provider.resolve(request.headers) : null;
}
