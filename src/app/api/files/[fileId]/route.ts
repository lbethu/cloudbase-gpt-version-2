import { NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";
import { resolveIdentityFromRequest } from "@/server/auth/identity";
import { openSourceFile } from "@/server/services/files";

export const dynamic = "force-dynamic";

/**
 * Protected source-document delivery. Files are addressed by registry id,
 * authorized per request and audited. There is no public URL to a document.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await context.params;
  const identity = await resolveIdentityFromRequest(request);
  const access = openSourceFile(identity, fileId);
  if (!access.ok) return NextResponse.json({ error: access.status === 401 ? "Not authenticated." : access.status === 403 ? "Not authorized." : "Not found." }, { status: access.status });
  const filename = access.resolved.file.path.split("/").pop() ?? "document";
  const body = Readable.toWeb(access.stream) as ReadableStream;
  return new NextResponse(body, {
    headers: {
      "content-type": access.resolved.file.mediaType,
      "content-length": String(access.size),
      "content-disposition": `${request.nextUrl.searchParams.get("download") === "1" ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
