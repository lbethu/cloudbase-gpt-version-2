import { NextRequest, NextResponse } from "next/server";
import { resolveIdentityFromRequest } from "@/server/auth/identity";
import { can } from "@/server/authz";
import { isDriveConfigured, searchDrive } from "@/lib/googleDrive";
import { recordAudit } from "@/server/services/audit";

// This route always runs on the server (never statically prerendered) since
// it reads a request-time query param and calls out to the Drive API with a
// server-only credential. Access requires an authenticated identity with
// knowledge.read — the Drive folder is an internal source.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const identity = await resolveIdentityFromRequest(request);
  if (!identity || !can(identity, "knowledge.read")) {
    recordAudit({ actor: identity?.subject ?? "anonymous", action: "drive.search", outcome: "denied", detail: {} });
    return NextResponse.json({ configured: isDriveConfigured(), error: "Not authorized.", results: [] }, { status: identity ? 403 : 401 });
  }
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (!isDriveConfigured()) {
    return NextResponse.json({
      configured: false,
      error:
        "Google Drive is not connected yet. Add GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, then share the target folder with that service account. See docs/google-drive-integration.md.",
      results: [],
    });
  }

  if (!query) {
    return NextResponse.json({ configured: true, results: [] });
  }

  try {
    const results = await searchDrive(query);
    recordAudit({ actor: identity.subject, action: "drive.search", outcome: "allowed", detail: { length: query.length, results: results.length } });
    return NextResponse.json({ configured: true, results });
  } catch (error) {
    console.error("[drive search]", error);
    return NextResponse.json(
      {
        configured: true,
        error:
          "Drive search failed. Confirm the service account key is valid and the target folder is shared with its email address.",
        results: [],
      },
      { status: 502 },
    );
  }
}
