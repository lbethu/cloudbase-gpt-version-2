#!/usr/bin/env node
/**
 * Standalone Google Drive connection check — run this before trusting the
 * "Google Drive search" tab in the app. It talks to Google directly and
 * prints exactly which step failed, instead of a vague "search failed" in
 * the browser.
 *
 * Usage:
 *   npm run check:drive
 */

const fs = require("fs");
const path = require("path");

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error(`Could not find ${envPath}`);
    console.error("Make sure the file is named exactly \".env.local\" (with the leading dot) and sits next to package.json.");
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
const folderId = (process.env.GOOGLE_DRIVE_ROOT_FOLDER_IDS || "").split(",")[0]?.trim();

console.log("=== Google Drive connection check ===\n");

if (!email || !rawKey) {
  console.error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in .env.local.");
  process.exit(1);
}

if (!/^[^@]+@[^@]+\.iam\.gserviceaccount\.com$/.test(email)) {
  console.warn(`Warning: "${email}" doesn't look like a typical service-account email (should end in .iam.gserviceaccount.com). Double-check you copied "client_email", not something else.`);
}

if (!rawKey.includes("BEGIN PRIVATE KEY")) {
  console.error('The private key does not contain "BEGIN PRIVATE KEY" — this usually means the wrong JSON field was copied.');
  console.error('Open the downloaded service-account .json file and copy the value of "private_key" (a long block), not "private_key_id" (a short 40-character code).');
  process.exit(1);
}

let google;
try {
  ({ google } = require("googleapis"));
} catch {
  console.error('Could not load the "googleapis" package. Run "npm install" first.');
  process.exit(1);
}

const privateKey = rawKey.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;

async function main() {
  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  const drive = google.drive({ version: "v3", auth });

  process.stdout.write("Step 1/3 — authenticating with Google... ");
  try {
    await auth.authorize();
    console.log("OK");
  } catch (error) {
    console.log("FAILED");
    console.error("\n" + (error.message || error));
    console.error("\nThis usually means the private key is malformed (wrong field copied, or newlines got mangled when pasted).");
    process.exit(1);
  }

  if (!folderId) {
    console.log("\nNo GOOGLE_DRIVE_ROOT_FOLDER_IDS set — skipping folder check. Authentication alone succeeded, which confirms the credentials are valid.");
    return;
  }

  process.stdout.write(`Step 2/3 — checking access to folder ${folderId}... `);
  let folderName = null;
  try {
    const folder = await drive.files.get({ fileId: folderId, fields: "id, name, webViewLink", supportsAllDrives: true });
    folderName = folder.data.name;
    console.log(`OK ("${folderName}")`);
  } catch (error) {
    console.log("FAILED");
    console.error(`\n${error.message || error}`);
    console.error(
      `\nThis almost always means the folder has not been shared with the service account yet.\n` +
      `Open the folder in Google Drive → Share → paste in this exact email → give it Viewer access:\n\n  ${email}\n`,
    );
    process.exit(1);
  }

  process.stdout.write("Step 3/3 — listing files inside it... ");
  try {
    const list = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType)",
      pageSize: 25,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      corpora: "allDrives",
    });
    const files = list.data.files || [];
    console.log(`OK (${files.length} item${files.length === 1 ? "" : "s"} found)`);
    files.forEach((file) => console.log(`  - ${file.name}`));
    console.log(`\nConnection is fully working. Folder "${folderName}" is searchable from the app now.`);
  } catch (error) {
    console.log("FAILED");
    console.error("\n" + (error.message || error));
    process.exit(1);
  }
}

main();
