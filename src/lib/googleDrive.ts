import { google, drive_v3 } from "googleapis";

/**
 * Live Google Drive search, added alongside (not replacing) the local mock +
 * imported-SOP retrieval in `src/lib/retrieval.ts`.
 *
 * Auth model: a single Google service account. Access is limited by Drive
 * sharing, not by this file — the service account can only ever see files
 * and folders that were explicitly shared with its email address, so
 * "limited access" is enforced on the Google side, not in application code.
 *
 * See docs/google-drive-integration.md for the full setup walkthrough.
 */

/**
 * How confident we can be that a result actually answers the search, given
 * only Drive's metadata (no snippet, no relevance score from the API):
 *  - "title-exact"   the whole query appears in the file name — verified, strong
 *  - "title-partial" some query words appear in the file name — verified, weaker
 *  - "content"       the file only matched Drive's fullText index — a real
 *                     match, but we can't see *where* inside the file, so it's
 *                     reported honestly as unverified rather than a fake score.
 * This is a metadata-only heuristic, not real document understanding — it's
 * the seam where a future content-aware ranker (or Gemini-grounded answer
 * synthesis) can slot in without changing the API route or the UI contract.
 */
export type DriveMatchType = "title-exact" | "title-partial" | "content";

export interface DriveSearchResult {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  iconLink?: string;
  modifiedTime?: string;
  size?: string;
  parentFolderId?: string;
  parentFolderLink?: string;
  parentFolderName?: string;
  matchType: DriveMatchType;
}

const FOLDER_MIME = "application/vnd.google-apps.folder";
const DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

let cachedClient: drive_v3.Drive | null = null;

function readCredentials() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) return null;
  // .env files cannot hold a literal multi-line PEM key cleanly, so the key
  // is stored with escaped "\n" sequences and unescaped here at runtime.
  const privateKey = rawKey.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;
  return { email, privateKey };
}

/** Whether Drive credentials are present. Used by the API route to return a
 * clear "not configured yet" response instead of a stack trace. */
export function isDriveConfigured(): boolean {
  return Boolean(readCredentials());
}

function getDriveClient(): drive_v3.Drive {
  if (cachedClient) return cachedClient;
  const credentials = readCredentials();
  if (!credentials) {
    throw new Error(
      "Google Drive credentials are not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.",
    );
  }
  const auth = new google.auth.JWT({
    email: credentials.email,
    key: credentials.privateKey,
    scopes: DRIVE_SCOPES,
  });
  cachedClient = google.drive({ version: "v3", auth });
  return cachedClient;
}

function configuredRootFolderIds(): string[] {
  const raw = process.env.GOOGLE_DRIVE_ROOT_FOLDER_IDS || "";
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

// Expanding a folder tree costs a handful of API calls, so the result is
// cached briefly — a burst of searches in the same few minutes reuses it
// instead of re-walking the tree on every keystroke.
let folderTreeCache: { ids: string[]; expiresAt: number } | null = null;
const FOLDER_TREE_TTL_MS = 5 * 60 * 1000;

async function expandFolderIds(drive: drive_v3.Drive, roots: string[]): Promise<string[]> {
  if (!roots.length) return [];
  if (folderTreeCache && folderTreeCache.expiresAt > Date.now()) return folderTreeCache.ids;

  const seen = new Set<string>(roots);
  let frontier = [...roots];

  // Breadth-first walk: Drive's API has no "is a descendant of" query, so
  // recursive scoping means repeatedly asking "which folders live directly
  // inside these folders" until nothing new turns up.
  while (frontier.length) {
    const orClause = frontier.map((id) => `'${id}' in parents`).join(" or ");
    const response = await drive.files.list({
      q: `mimeType = '${FOLDER_MIME}' and (${orClause}) and trashed = false`,
      fields: "files(id)",
      pageSize: 200,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      corpora: "allDrives",
    });
    const found = (response.data.files || [])
      .map((file) => file.id)
      .filter((id): id is string => Boolean(id) && !seen.has(id!));
    found.forEach((id) => seen.add(id));
    frontier = found;
  }

  const ids = [...seen];
  folderTreeCache = { ids, expiresAt: Date.now() + FOLDER_TREE_TTL_MS };
  return ids;
}

function escapeForDriveQuery(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/** Classify + score a result using only what we can verify: the file name.
 * Higher score = surfaced first. Ties fall back to Drive's own ordering
 * (most-recently-modified first), because Array.prototype.sort is stable. */
function classifyMatch(query: string, name: string): { type: DriveMatchType; score: number } {
  const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, " ");
  const normalizedName = name.toLowerCase();
  const queryTokens = normalizedQuery.split(" ").filter((token) => token.length > 1);

  if (normalizedQuery.length > 2 && normalizedName.includes(normalizedQuery)) {
    return { type: "title-exact", score: 100 };
  }

  const matchedTokens = queryTokens.filter((token) => normalizedName.includes(token));
  if (matchedTokens.length > 0) {
    const coverage = matchedTokens.length / queryTokens.length;
    return { type: "title-partial", score: 50 + coverage * 40 };
  }

  // Not in the name at all — it only surfaced because Drive's fullText index
  // found the term somewhere inside the file. Real match, unverified location.
  return { type: "content", score: 10 };
}

export async function searchDrive(query: string): Promise<DriveSearchResult[]> {
  const drive = getDriveClient();
  const roots = configuredRootFolderIds();
  const allowedFolderIds = roots.length ? await expandFolderIds(drive, roots) : [];

  const escaped = escapeForDriveQuery(query);
  // Match on file name always, and on indexed content when Drive has it
  // (reliable for Google Docs/Sheets/Slides and most PDFs; partial for raw
  // Office files that were never opened/converted in Drive).
  const textClause = `(name contains '${escaped}' or fullText contains '${escaped}')`;
  const scopeClause = allowedFolderIds.length
    ? ` and (${allowedFolderIds.map((id) => `'${id}' in parents`).join(" or ")})`
    : "";

  const response = await drive.files.list({
    q: `${textClause} and trashed = false${scopeClause}`,
    fields: "files(id, name, mimeType, webViewLink, iconLink, modifiedTime, size, parents)",
    pageSize: 15,
    orderBy: "modifiedTime desc",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    corpora: "allDrives",
  });

  const files = response.data.files || [];

  // Resolve each result's immediate parent folder so the UI can link back to
  // "where this actually lives" in Drive, not just the file itself.
  const parentIds = [...new Set(files.map((file) => file.parents?.[0]).filter((id): id is string => Boolean(id)))];
  const parentMeta = new Map<string, { name: string; webViewLink: string }>();
  await Promise.all(
    parentIds.map(async (id) => {
      try {
        const folder = await drive.files.get({
          fileId: id,
          fields: "id, name, webViewLink",
          supportsAllDrives: true,
        });
        parentMeta.set(id, {
          name: folder.data.name || "Drive folder",
          webViewLink: folder.data.webViewLink || `https://drive.google.com/drive/folders/${id}`,
        });
      } catch {
        parentMeta.set(id, { name: "Drive folder", webViewLink: `https://drive.google.com/drive/folders/${id}` });
      }
    }),
  );

  const results = files
    .filter((file): file is drive_v3.Schema$File & { id: string } => Boolean(file.id))
    .map((file) => {
      const parentId = file.parents?.[0];
      const parent = parentId ? parentMeta.get(parentId) : undefined;
      const { type, score } = classifyMatch(query, file.name || "");
      return {
        id: file.id,
        name: file.name || "Untitled",
        mimeType: file.mimeType || "",
        webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
        iconLink: file.iconLink ?? undefined,
        modifiedTime: file.modifiedTime ?? undefined,
        size: file.size ?? undefined,
        parentFolderId: parentId,
        parentFolderLink: parent?.webViewLink,
        parentFolderName: parent?.name,
        matchType: type,
        _score: score,
      };
    });

  // Best-verified match first. Array.prototype.sort is stable (guaranteed
  // since ES2019), so files tied on score keep Drive's modifiedTime-desc order.
  results.sort((a, b) => b._score - a._score);

  return results.map(({ _score, ...result }) => result);
}
