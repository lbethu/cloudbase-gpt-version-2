import { NextRequest, NextResponse } from "next/server";
import { resolveIdentityFromRequest } from "@/server/auth/identity";
import { executeAgent } from "@/server/services/agents";

export const dynamic = "force-dynamic";

/** Explicit, audited agent run. Requires agent.run; never mutates governed records. */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const identity = await resolveIdentityFromRequest(request);
  if (!identity) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const { id } = await context.params;
  const result = await executeAgent(identity, id);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
