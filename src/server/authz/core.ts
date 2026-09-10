import type { Classification, ContentType, Permission, Role } from "@/domain";

/**
 * Pure authorization core — no I/O, fully unit-testable.
 *
 * Rules:
 *  1. No identity → deny everything.
 *  2. Explicit `denies` from any role win over grants from any role.
 *  3. A permission must be granted by at least one role; otherwise deny.
 *  4. Resource visibility adds classification checks on top of the permission.
 */

export interface Principal {
  subject: string;
  roles: string[];
  teams: string[];
  tenantId: string;
}

export interface AuthzDecision {
  allowed: boolean;
  reason: "no-identity" | "explicit-deny" | "not-granted" | "classification" | "tenant" | "granted";
}

export interface ProtectedResource {
  type: ContentType;
  classification: Classification;
  owningTeam: string;
  teams: string[];
  accessGrants: string[];
  tenantId?: string;
}

export const READ_PERMISSION_BY_TYPE: Record<ContentType, Permission> = {
  sop: "sop.read",
  documentation: "knowledge.read",
  research: "knowledge.read",
  "rnd-project": "rnd.read",
  capability: "capability.read",
  "capability-cluster": "capability.read",
  evaluation: "rnd.read",
  evidence: "rnd.read",
  experiment: "rnd.read",
  decision: "rnd.read",
  idea: "rnd.read",
  copilot: "copilot.read",
  automation: "automation.read",
  "project-reference": "knowledge.read",
  rfp: "knowledge.read",
  team: "knowledge.read",
  policy: "knowledge.read",
  account: "crm.read",
  contact: "crm.read",
  opportunity: "crm.read",
  agent: "agent.read",
};

export function effectivePermissions(principal: Principal | null, roles: Role[]): { grants: Set<Permission>; denies: Set<Permission> } {
  const grants = new Set<Permission>();
  const denies = new Set<Permission>();
  if (!principal) return { grants, denies };
  const byId = new Map(roles.map((r) => [r.id, r]));
  for (const roleId of principal.roles) {
    const role = byId.get(roleId);
    if (!role) continue; // unknown roles grant nothing
    role.grants.forEach((p) => grants.add(p));
    role.denies.forEach((p) => denies.add(p));
  }
  return { grants, denies };
}

export function decide(principal: Principal | null, roles: Role[], permission: Permission): AuthzDecision {
  if (!principal) return { allowed: false, reason: "no-identity" };
  const { grants, denies } = effectivePermissions(principal, roles);
  if (denies.has(permission)) return { allowed: false, reason: "explicit-deny" };
  if (!grants.has(permission)) return { allowed: false, reason: "not-granted" };
  return { allowed: true, reason: "granted" };
}

export function decideResource(principal: Principal | null, roles: Role[], resource: ProtectedResource): AuthzDecision {
  const base = decide(principal, roles, READ_PERMISSION_BY_TYPE[resource.type]);
  if (!base.allowed || !principal) return base;
  if (resource.tenantId && resource.tenantId !== principal.tenantId) return { allowed: false, reason: "tenant" };
  if (resource.classification === "internal") return base;
  const explicitly = resource.accessGrants.includes(principal.subject);
  if (resource.classification === "restricted") return explicitly ? base : { allowed: false, reason: "classification" };
  // confidential: owning/sharing team membership or explicit grant
  const teamMatch = [resource.owningTeam, ...resource.teams].some((t) => principal.teams.includes(t));
  return teamMatch || explicitly ? base : { allowed: false, reason: "classification" };
}
