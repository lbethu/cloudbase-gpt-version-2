# Google Drive Live Search Integration

## What this adds

A new "Google Drive search" tab, separate from the existing "Ask CloudBase AI"
experience. It does not touch the mock data or the imported-SOP navigator —
those stay exactly as they were, so the reviewer/demo experience is
unaffected. This is a new, additional capability that searches your real
Google Drive live, keyword in → matching document out, with a link to the
file and a link to the folder it lives in.

Nothing from Drive is copied, downloaded, or stored by this app. Every
search is a live API call; the file itself always stays in Drive, and the
result only ever contains metadata (name, link, folder, last-modified date)
plus an embedded Drive preview pane.

## Why a service account, and how "limited access" is enforced

The app authenticates as one Google **service account** — a robot account
that lives in your Google Cloud project, not a real person's login. It has
no access to anything by default. Access is granted purely by *sharing a
specific Drive folder* with that service account's email address, exactly
like sharing a folder with a coworker. Whatever is shared with it is
searchable through this app; whatever isn't, is invisible to it — including
the rest of your organization's Drive. That is what enforces "the drive to
access is limited," and it's enforced on Google's side, not by anything in
this codebase.

## Setup steps

1. **Create or pick a Google Cloud project.** Go to
   [console.cloud.google.com](https://console.cloud.google.com), and either
   select an existing project or create a new one (e.g. "cloudbase-ai-search").
2. **Enable the Google Drive API.** In the project, go to
   *APIs & Services → Library*, search "Google Drive API", and click Enable.
3. **Create a service account.** Go to *APIs & Services → Credentials →
   Create Credentials → Service account*. Give it a name (e.g.
   "cloudbase-drive-search"). You don't need to grant it any project-level
   role — Drive access comes from folder sharing, not IAM roles.
4. **Create a key for it.** Open the new service account → *Keys* tab →
   *Add key → Create new key → JSON*. This downloads a `.json` file — treat
   it like a password. It contains a `client_email` and a `private_key`.
5. **Share the target Drive folder with that service account.** In Google
   Drive, right-click the folder you want searchable → *Share* → paste in
   the `client_email` from the JSON file → give it **Viewer** access → Send
   (uncheck the "notify" email if you don't want a notification sent, the
   account has no inbox anyway).
6. **Copy the folder ID (optional but recommended).** Open the folder in
   Drive; the URL looks like
   `https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrSt`. The part
   after `/folders/` is the folder ID.
7. **Set the environment variables.** Copy `.env.example` to `.env.local` in
   the project root and fill in:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` — the `client_email` value from the JSON key.
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` — the `private_key` value from the
     JSON key, on one line with real newlines replaced by `\n` (the JSON file
     already stores it this way, so you can usually copy it as-is).
   - `GOOGLE_DRIVE_ROOT_FOLDER_IDS` — the folder ID from step 6 (comma-separate
     multiple folder IDs if you share more than one). Leave blank to search
     everything shared with the service account.
8. **Restart the dev server** (`npm run dev`) so the new environment
   variables are picked up.
9. Open the app → **Google Drive search** tab → search a keyword. If it's
   not configured yet, the tab tells you exactly that instead of failing
   silently.

## How the search works

- Every search matches on file **name** and, where Drive has indexed it, on
  **file content** (`fullText contains`), so a keyword found only inside a
  document's text still surfaces it.
- If `GOOGLE_DRIVE_ROOT_FOLDER_IDS` is set, the app first walks that folder's
  full subtree (all nested subfolders) and restricts results to files inside
  it — this is enforced in addition to, not instead of, Drive's own sharing
  permissions.
- Each result shows the file itself in an embedded Drive preview, plus an
  "Open document" link (opens the file directly in Drive) and an "Open
  containing folder" link (opens the parent folder in Drive) — matching both
  "show me the document" and "show me where it lives."

## Ranking: best match first, honestly labeled

The Drive API doesn't return a relevance score or a highlighted snippet —
it can only tell you *that* a file matched, not *how well* or *where*. So
rather than inventing a fake confidence percentage, `src/lib/googleDrive.ts`
classifies each result using the one signal we can actually verify — the
file name — and sorts on that:

- **Best match — file name matches** (green): the search phrase appears in
  the file name itself. Shown first.
- **Likely match — partial file name match** (amber): some of the search
  words appear in the name.
- **Found inside document text** (blue): the file only matched Drive's
  internal content index; the name has no overlap with the query at all.
  It's a real match, we just can't verify where inside the file, so it's
  labeled as unverified rather than dressed up as a precise score.

This lives in one function, `classifyMatch()`, specifically so it's an easy
seam to replace later — see the next section.

## Where this goes next: content-aware answers (Gemini)

Right now the app finds *documents* — it does not read them and answer *from*
them the way the local mock/SOP "Ask CloudBase AI" experience does. Getting
from "here's the matching file" to "here's the answer, drawn from that file"
is a deliberate next phase, not a small tweak, because it needs:

1. **Fetching real content**, not just metadata — downloading/exporting each
   candidate file (Google Docs export as text/HTML easily; `.docx`/`.pdf`
   need a parser) so there's actual text to reason over.
2. **An answer model grounded in that text** — this is where Gemini (or a
   Gemini Gem configured for this knowledge base) fits: it would take the
   fetched document text plus the question and produce a direct answer with
   a citation back to the section it came from, instead of a list of files
   to open manually.
3. **Keeping the same governance posture** the rest of this app already has:
   only search/send documents the signed-in identity is authorized to see,
   and keep the source visibly linked so an answer is always checkable
   against the real file — matching the "sources stay visible and
   reviewable" principle in `docs/project-overview.md`.

The ranking heuristic above is intentionally isolated in one function so
step 1–2 can slot in without reworking the API route or the UI contract:
`classifyMatch()` and the `DriveSearchResult.matchType` field are the exact
places a content-aware (or Gemini-backed) scorer would plug in later.

## Known limitations

- **No text snippets.** The Drive API can tell you *that* a file matched,
  but not *which line* matched or return a highlighted excerpt the way
  Google's own Drive search UI does. The embedded preview lets a person
  confirm the match visually instead.
- **Content indexing varies by file type.** Google Docs, Sheets, and Slides
  are always fully indexed. PDFs are indexed well in most cases. Native
  Microsoft Office files (`.docx`, `.pptx`, `.xlsx`) that were uploaded but
  never opened/converted in Drive sometimes have partial content indexing —
  the file name will always still match regardless.
- **Rate limits.** The Drive API has generous but real per-minute quotas.
  This integration is built for internal, occasional search use, not
  high-volume traffic.

## Where the code lives

- `src/lib/googleDrive.ts` — service-account auth, folder-tree expansion, and
  the actual Drive search call.
- `src/app/api/drive/search/route.ts` — the API route the frontend calls
  (`GET /api/drive/search?q=...`). Credentials never reach the browser; this
  route is the only place they're read.
- `src/components/DriveSearchView.tsx` — the "Google Drive search" tab UI.

## Security notes

- `.env.local` is already covered by `.gitignore` (`.env*`) — never commit
  real credentials.
- In production, put the service-account values in your hosting provider's
  secret manager rather than a plain `.env` file on a shared machine.
- If the service account key is ever exposed, revoke it immediately from
  *APIs & Services → Credentials* in Google Cloud Console and issue a new
  one — this immediately cuts off access without needing to re-share the
  folder.
