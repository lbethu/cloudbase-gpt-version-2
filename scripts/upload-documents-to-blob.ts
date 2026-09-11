/**
 * Copies the governed source documents from source-documents/ into the
 * configured S3-compatible bucket, so a hosted deployment (whose filesystem is
 * read-only or disposable) can serve and accept documents.
 *
 *   CLOUDBASE_BLOB_STORAGE=s3 npm run blob:upload          # upload what is missing
 *   CLOUDBASE_BLOB_STORAGE=s3 npm run blob:upload -- --force   # re-upload everything
 *   CLOUDBASE_BLOB_STORAGE=s3 npm run blob:upload -- --check   # verify only, write nothing
 *
 * Keys mirror the paths recorded in the registry exactly (e.g.
 * "sop/223- Project Reference Creation and Updates.docx"), so the SOP records
 * need no rewriting: the same `sourceFile.path` resolves in either mode.
 *
 * Safe to re-run. Existing objects are skipped unless --force is passed, and
 * nothing is ever deleted from the bucket.
 */
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });
import fs from "node:fs";
import path from "node:path";
import { getConfig } from "../src/server/config";
import { createFileRepositories } from "../src/server/repositories/file-registry";
import { getBlobStorage } from "../src/server/storage/blob";

const MEDIA: Record<string, string> = {
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pdf": "application/pdf",
};

async function main() {
  const force = process.argv.includes("--force");
  const checkOnly = process.argv.includes("--check");
  const cfg = getConfig();
  const storage = getBlobStorage();
  if (storage.name !== "s3") {
    throw new Error("Blob storage is set to local. Run with CLOUDBASE_BLOB_STORAGE=s3 and S3_BUCKET/S3_ACCESS_KEY_ID/S3_SECRET_ACCESS_KEY configured.");
  }

  // Every document the registry actually references — not whatever happens to
  // be lying in the folder — so the upload matches what the app will ask for.
  const repos = createFileRepositories(cfg.contentDir);
  const wanted = new Map<string, string>(); // storage key -> absolute local path
  for (const sop of repos.sops.list()) {
    for (const version of sop.versions) {
      const key = version.sourceFile?.path;
      if (key) wanted.set(key, path.resolve(cfg.sourceDocumentsDir, key));
    }
  }

  let uploaded = 0;
  let skipped = 0;
  const missingLocally: string[] = [];
  const missingRemotely: string[] = [];

  for (const [key, absolute] of [...wanted].sort()) {
    if (!fs.existsSync(absolute)) {
      missingLocally.push(key);
      continue;
    }
    const already = await storage.stat(key);
    if (checkOnly) {
      if (!already) missingRemotely.push(key);
      continue;
    }
    if (already && !force) {
      skipped++;
      continue;
    }
    const bytes = fs.readFileSync(absolute);
    await storage.put(key, bytes, MEDIA[path.extname(key).toLowerCase()] ?? "application/octet-stream");
    console.log(`  uploaded  ${key} (${(bytes.length / 1024).toFixed(0)} KB)`);
    uploaded++;
  }

  if (checkOnly) {
    console.log(`\n${wanted.size} document(s) referenced by the registry.`);
    if (missingRemotely.length) console.log(`Missing from the bucket (${missingRemotely.length}):\n  ${missingRemotely.join("\n  ")}`);
    else console.log("Every referenced document is present in the bucket.");
  } else {
    console.log(`\n${uploaded} uploaded, ${skipped} already present, ${wanted.size} referenced in total.`);
  }
  if (missingLocally.length) {
    console.log(`\nReferenced but not found on disk (${missingLocally.length}) — these SOPs would show a broken document link:\n  ${missingLocally.join("\n  ")}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
