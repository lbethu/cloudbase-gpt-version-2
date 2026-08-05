import { NextRequest, NextResponse } from "next/server";
import { isDriveConfigured, searchDrive } from "@/lib/googleDrive";

// This route always runs on the server (never statically prerendered) since
// it reads a request-time query param and calls out to the Drive API with a
// server-only credential.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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
