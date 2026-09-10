import "server-only";
import type { Permission } from "@/domain";
import { getCurrentIdentity, type Identity } from "@/server/auth/identity";
import { permissionsOf } from "@/server/authz";
import { getConfig } from "@/server/config";
import { ensureRepositories, getRepositories } from "@/server/repositories";

/** Everything a page needs to know about the viewer, resolved once per request. */
export interface Viewer {
  identity: Identity | null;
  permissions: Permission[];
  has: (permission: Permission) => boolean;
  teamNames: string[];
  environmentLabel?: string;
}

export async function getViewer(): Promise<Viewer> {
  await ensureRepositories(); // loads the database snapshot in postgres mode; no-op for the file registry
  const identity = await getCurrentIdentity();
  const permissions = permissionsOf(identity);
  const set = new Set(permissions);
  const teams = getRepositories().teams;
  const cfg = getConfig();
  return {
    identity,
    permissions,
    has: (p) => set.has(p),
    teamNames: (identity?.teams ?? []).map((t) => teams.get(t)?.name ?? t),
    environmentLabel: cfg.auth.mode === "dev" ? "Development identity" : undefined,
  };
}

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";
