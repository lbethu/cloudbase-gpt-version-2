import { NextRequest, NextResponse } from "next/server";
import { isContentType, type ContentType } from "@/domain";
import { resolveIdentityFromRequest } from "@/server/auth/identity";
import { getRepositories } from "@/server/repositories";
import { buildGraph } from "@/server/services/graph";
import { permittedItems } from "@/server/services/search";

export const dynamic = "force-dynamic";

/** Permission-scoped knowledge graph projection. */
export async function GET(request: NextRequest) {
  const identity = await resolveIdentityFromRequest(request);
  if (!identity) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const p = request.nextUrl.searchParams;
  const types = p.getAll("type").filter(isContentType) as ContentType[];
  const focus = p.get("focus")?.slice(0, 200) ?? undefined;
  const depth = Math.min(4, Math.max(1, Number(p.get("depth") ?? 2)));
  const graph = buildGraph(getRepositories(), permittedItems(identity), { types: types.length ? types : undefined, includeTeams: p.get("teams") !== "0", focus, depth });
  return NextResponse.json(graph);
}
