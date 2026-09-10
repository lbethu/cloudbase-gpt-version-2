import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ContentType } from "@/domain";
import { resolveIdentityFromRequest } from "@/server/auth/identity";
import { ensureRepositories } from "@/server/repositories";
import { searchKnowledge } from "@/server/services/search";

export const dynamic = "force-dynamic";

const Query = z.object({
  q: z.string().max(300).default(""),
  type: z.array(ContentType).default([]),
  team: z.string().max(80).optional(),
  status: z.string().max(40).optional(),
  category: z.string().max(80).optional(),
  maturity: z.string().max(10).optional(),
  tag: z.array(z.string().max(60)).default([]),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

/** Permission-scoped search. Items the caller cannot read are never scored. */
export async function GET(request: NextRequest) {
  await ensureRepositories();
  const identity = await resolveIdentityFromRequest(request);
  if (!identity) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const params = request.nextUrl.searchParams;
  const parsed = Query.safeParse({
    q: params.get("q") ?? "",
    type: params.getAll("type"),
    team: params.get("team") ?? undefined,
    status: params.get("status") ?? undefined,
    category: params.get("category") ?? undefined,
    maturity: params.get("maturity") ?? undefined,
    tag: params.getAll("tag"),
    limit: params.get("limit") ?? undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query.", issues: parsed.error.issues }, { status: 400 });
  const { q, type, team, status, category, maturity, tag, limit } = parsed.data;
  try {
    const result = await searchKnowledge(identity, { q, limit, filters: { types: type.length ? type : undefined, team, status, category, maturity, tags: tag.length ? tag : undefined } });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Search failed." }, { status: 503 });
  }
}
