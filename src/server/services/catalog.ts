import "server-only";
import type { ContentRef } from "@/domain";
import type { Identity } from "@/server/auth/identity";
import { getRepositories } from "@/server/repositories";
import { relatedTo, type RelatedGroup } from "./relationships";
import { permittedItems } from "./search";

/** Small helpers shared by detail pages. */
export const teamName = (id: string) => getRepositories().teams.get(id)?.name ?? id;

export function relatedFor(identity: Identity | null, ref: ContentRef): RelatedGroup[] {
  return relatedTo(getRepositories(), ref, permittedItems(identity));
}

/** Items owned by or shared with a team, permission-scoped. */
export function teamItems(identity: Identity | null, teamId: string) {
  return permittedItems(identity).filter((i) => i.ref.type !== "team" && (i.owningTeam === teamId || i.teams.includes(teamId)));
}
