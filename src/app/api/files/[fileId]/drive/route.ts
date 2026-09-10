import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { resolveIdentityFromRequest } from "@/server/auth/identity";
import { isDriveConfigured, searchDrive } from "@/lib/googleDrive";
import { recordAudit } from "@/server/services/audit";
import { authorizeSourceFile } from "@/server/services/files";

export const dynamic = "force-dynamic";

/**
 * Open the governed document in Google Drive (no download).
 * Uses the registry `driveUrl` when set; otherwise resolves the file by name
 * through the read-only Drive integration and redirects to its webViewLink.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await context.params;
  const identity = await resolveIdentityFromRequest(request);
  const access = authorizeSourceFile(identity, fileId, "files.open-drive");
  if (!access.ok) return NextResponse.json({ error: access.status === 401 ? "Not authenticated." : access.status === 403 ? "Not authorized." : "Not found." }, { status: access.status });
  const { file, owner } = access.resolved;
  let url = file.driveUrl;
  let via = "registry";
  if (!url) {
    if (!isDriveConfigured()) {
      return NextResponse.json({ error: "Google Drive is not connected. Configure the Drive integration (Governance → Integrations) or set `driveUrl` on this source file in the registry." }, { status: 503 });
    }
    const name = path.basename(file.path);
    const stem = name.replace(/\.[^.]+$/, "");
    try {
      const results = await searchDrive(stem);
      const exact = results.find((r) => r.name === name) ?? results.find((r) => r.matchType === "title-exact") ?? results.find((r) => r.name.replace(/\.[^.]+$/, "") === stem);
      if (exact) {
        url = exact.webViewLink;
        via = "drive-search";
      }
    } catch (error) {
      recordAudit({ actor: identity!.subject, action: "files.open-drive", target: { type: "sop", id: owner.id }, outcome: "error", detail: { fileId, message: error instanceof Error ? error.message : "drive error" } });
      return NextResponse.json({ error: "Drive lookup failed. Confirm the service account can see the folder containing this file." }, { status: 502 });
    }
  }
  if (!url) {
    recordAudit({ actor: identity!.subject, action: "files.open-drive", target: { type: "sop", id: owner.id }, outcome: "error", detail: { fileId, reason: "not-in-drive" } });
    return NextResponse.json({ error: `“${path.basename(file.path)}” was not found in the Drive folders shared with CloudBase. Share its folder with the service account, or set driveUrl on the source file.` }, { status: 404 });
  }
  recordAudit({ actor: identity!.subject, action: "files.open-drive", target: { type: "sop", id: owner.id }, outcome: "allowed", detail: { fileId, via } });
  return NextResponse.redirect(url, 302);
}
