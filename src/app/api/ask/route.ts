import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveIdentityFromRequest } from "@/server/auth/identity";
import { ensureRepositories } from "@/server/repositories";
import { can } from "@/server/authz";
import { askCloudBase } from "@/server/services/ask";

export const dynamic = "force-dynamic";

const Body = z.object({ question: z.string().trim().min(3).max(500) });

export async function POST(request: NextRequest) {
  await ensureRepositories();
  const identity = await resolveIdentityFromRequest(request);
  if (!identity) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (!can(identity, "ask.use")) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Ask a question between 3 and 500 characters." }, { status: 400 });
  const answer = await askCloudBase(identity, parsed.data.question);
  return NextResponse.json(answer);
}
