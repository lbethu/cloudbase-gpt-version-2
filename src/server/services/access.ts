import "server-only";
import { notFound } from "next/navigation";
import type { ContentType, GovernedBase } from "@/domain";
import type { Identity } from "@/server/auth/identity";
import { canRead } from "@/server/authz";

/** Guard for detail pages: unauthorized objects are indistinguishable from missing ones. */
export function visible<T extends Pick<GovernedBase, "classification" | "owningTeam" | "teams" | "accessGrants">>(identity: Identity | null, type: ContentType, entity: T | undefined): entity is T {
  if (!entity) return false;
  return canRead(identity, { type, classification: entity.classification, owningTeam: entity.owningTeam, teams: entity.teams, accessGrants: entity.accessGrants });
}

export function requireVisible<T extends Pick<GovernedBase, "classification" | "owningTeam" | "teams" | "accessGrants">>(identity: Identity | null, type: ContentType, entity: T | undefined): T {
  if (!visible(identity, type, entity)) notFound();
  return entity;
}

export function filterVisible<T extends Pick<GovernedBase, "classification" | "owningTeam" | "teams" | "accessGrants">>(identity: Identity | null, type: ContentType, entities: T[]): T[] {
  return entities.filter((e) => visible(identity, type, e));
}
