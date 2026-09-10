import "server-only";
import type { Permission } from "@/domain";
import type { Identity } from "@/server/auth/identity";
import { getCurrentIdentity } from "@/server/auth/identity";
import { getRepositories } from "@/server/repositories";
import { recordAudit } from "@/server/services/audit";
import { decide, decideResource, effectivePermissions, type AuthzDecision, type ProtectedResource } from "./core";

export type { ProtectedResource } from "./core";

export class ForbiddenError extends Error {
  constructor(
    public readonly permission: Permission | string,
    public readonly decision: AuthzDecision,
  ) {
    super(`Forbidden: ${permission} (${decision.reason})`);
  }
}

export function can(identity: Identity | null, permission: Permission): boolean {
  return decide(identity, getRepositories().roles.list(), permission).allowed;
}

export function canRead(identity: Identity | null, resource: ProtectedResource): boolean {
  return decideResource(identity, getRepositories().roles.list(), resource).allowed;
}

export function permissionsOf(identity: Identity | null): Permission[] {
  const { grants, denies } = effectivePermissions(identity, getRepositories().roles.list());
  return [...grants].filter((p) => !denies.has(p)).sort();
}

/** Throws when the current request lacks `permission`; privileged checks are audited. */
export async function requirePermission(permission: Permission, options: { audit?: boolean } = {}): Promise<Identity> {
  const identity = await getCurrentIdentity();
  const decision = decide(identity, getRepositories().roles.list(), permission);
  if (options.audit || !decision.allowed) {
    recordAudit({ actor: identity?.subject ?? "anonymous", action: `authz.${permission}`, outcome: decision.allowed ? "allowed" : "denied", detail: { reason: decision.reason } });
  }
  if (!decision.allowed || !identity) throw new ForbiddenError(permission, decision);
  return identity;
}

/** Non-throwing variant for pages that render a permission-aware empty state. */
export async function checkPermission(permission: Permission): Promise<{ identity: Identity | null; allowed: boolean; decision: AuthzDecision }> {
  const identity = await getCurrentIdentity();
  const decision = decide(identity, getRepositories().roles.list(), permission);
  return { identity, allowed: decision.allowed, decision };
}
