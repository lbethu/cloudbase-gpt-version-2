/**
 * Pre-launch check.
 *
 *   npm run preflight
 *
 * Answers one question: if this configuration were deployed right now, would
 * the admin team be able to use it, and would anyone else be locked out?
 *
 * It checks the things that fail quietly — a database with no tables, a bucket
 * the app cannot reach, documents missing from storage, an auth mode that lets
 * everyone in or nobody — rather than the things that fail loudly and get
 * noticed anyway. Run it with the same environment the deployment will have.
 *
 * Exit code 1 means do not launch yet.
 */
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });
import { getConfig } from "../src/server/config";
import { createFileRepositories } from "../src/server/repositories/file-registry";

type Level = "pass" | "warn" | "fail";
const results: Array<{ level: Level; title: string; detail: string }> = [];
const add = (level: Level, title: string, detail = "") => results.push({ level, title, detail });

async function main() {
  const cfg = getConfig();
  const hosted = process.env.VERCEL === "1" || process.env.CLOUDBASE_ASSUME_HOSTED === "1" || cfg.env === "production";

  // ── Identity ───────────────────────────────────────────────────────────────
  if (cfg.auth.mode === "dev") {
    add(hosted ? "fail" : "warn", "Identity: development", "Every visitor is the same fictitious admin. Refused automatically in a production build, but never expose this to anyone.");
  } else if (cfg.auth.mode === "none") {
    add("fail", "Identity: none configured", "Everyone sees the sign-in wall and no content. Set CLOUDBASE_AUTH_MODE=access (Cloudflare Access) or entra.");
  } else if (cfg.auth.mode === "access") {
    if (!cfg.auth.accessTeamDomain || !cfg.auth.accessAud) add("fail", "Identity: Cloudflare Access incomplete", "CLOUDBASE_ACCESS_TEAM_DOMAIN and CLOUDBASE_ACCESS_AUD are both required. Without them nobody can sign in.");
    else add("pass", "Identity: Cloudflare Access", `${cfg.auth.accessTeamDomain} · assertions are signature-verified`);
    add("warn", "Check the origin cannot be reached directly", "Access only protects traffic that goes through it. On Vercel that means Deployment Protection on, and the *.vercel.app URL must refuse you in a private window.");
  } else {
    add("pass", "Identity: Microsoft Entra", "Via authenticating proxy. The proxy must strip inbound x-ms-client-principal.");
  }

  // ── Who may be in ──────────────────────────────────────────────────────────
  try {
    const { listPeople } = await import("../src/server/auth/people");
    const people = listPeople();
    const active = people.filter((p) => p.active);
    const approvers = active.filter((p) => p.roles.includes("approver") || p.roles.includes("admin"));
    if (active.length === 0) add("fail", "People register is empty", "Nobody can use it. Add the team to content/registry/people.yaml.");
    else if (active.length === 1 && cfg.auth.mode !== "dev") add("warn", `People register: ${active.length} person`, "Only one account. The admin team cannot sign in until they are listed.");
    else add("pass", `People register: ${active.length} active`, `${approvers.length} can approve SOPs`);
  } catch (error) {
    add("fail", "People register unreadable", error instanceof Error ? error.message : String(error));
  }

  // ── Governed records ───────────────────────────────────────────────────────
  if (cfg.storage.mode === "postgres") {
    if (!cfg.database.url) add("fail", "Database: no DATABASE_URL", "CLOUDBASE_STORAGE=postgres but nothing to connect to.");
    else {
      try {
        const { getDb, schema, closeDb } = await import("../src/server/db/client");
        const rows = await getDb().select({ type: schema.governedRecords.type }).from(schema.governedRecords);
        const sops = rows.filter((r) => r.type === "sop").length;
        const imported = await getDb().select({ id: schema.importedContent.id }).from(schema.importedContent);
        if (rows.length === 0) add("fail", "Database is empty", "Migrated but not seeded. Run npm run db:seed.");
        else add("pass", `Database: ${rows.length} records`, `${sops} SOPs · ${imported.length} documents indexed`);
        await closeDb();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        add("fail", "Database unreachable or unmigrated", /relation .* does not exist/.test(message) ? "Tables are missing — run npm run db:migrate, then npm run db:seed." : message);
      }
    }
  } else if (hosted) {
    add("fail", "Storage: file registry on a hosted deployment", "Approvals and uploads would be written to a read-only, disposable filesystem. Set CLOUDBASE_STORAGE=postgres.");
  } else {
    add("warn", "Storage: file registry", "Fine locally. A hosted deployment needs CLOUDBASE_STORAGE=postgres.");
  }

  // ── Documents ──────────────────────────────────────────────────────────────
  const repos = createFileRepositories(cfg.contentDir);
  const referenced = new Set<string>();
  for (const sop of repos.sops.list()) for (const v of sop.versions) if (v.sourceFile) referenced.add(v.sourceFile.path);

  if (cfg.blob.mode === "s3") {
    try {
      const { getBlobStorage } = await import("../src/server/storage/blob");
      const storage = getBlobStorage();
      const missing: string[] = [];
      for (const key of referenced) if (!(await storage.stat(key))) missing.push(key);
      if (missing.length) add("fail", `Documents: ${missing.length} of ${referenced.size} missing from the bucket`, `Run npm run blob:upload. First missing: ${missing[0]}`);
      else add("pass", `Documents: all ${referenced.size} present in ${cfg.blob.bucket}`);
    } catch (error) {
      add("fail", "Document bucket unreachable", error instanceof Error ? error.message : String(error));
    }
  } else if (hosted) {
    add("fail", "Documents: local filesystem on a hosted deployment", "Uploads would vanish on the next deploy. Set CLOUDBASE_BLOB_STORAGE=s3 with S3_BUCKET and keys.");
  } else {
    add("warn", "Documents: local filesystem", "Fine locally. A hosted deployment needs CLOUDBASE_BLOB_STORAGE=s3.");
  }

  // ── Upload limit ───────────────────────────────────────────────────────────
  if (process.env.VERCEL === "1" && cfg.maxUploadMb > 4) add("warn", `Upload limit: ${cfg.maxUploadMb} MB`, "Vercel rejects bodies over 4.5 MB before the app sees them. Set CLOUDBASE_MAX_UPLOAD_MB=4 so the page states the real limit.");
  else add("pass", `Upload limit: ${cfg.maxUploadMb} MB`);

  // ── Content readiness (not a blocker, but people will notice) ──────────────
  const sops = repos.sops.list();
  const approved = sops.filter((s) => s.effectiveVersion).length;
  if (approved === 0) add("warn", `No SOP is approved (${sops.length} in the library)`, "Everything will show 'not yet approved'. Approve the ones that are current, or say so in the announcement — otherwise the warning teaches people to ignore warnings.");
  else if (approved < sops.length / 2) add("warn", `${approved} of ${sops.length} SOPs approved`, "Most of the library still reads as draft.");
  else add("pass", `${approved} of ${sops.length} SOPs approved`);

  // ── Report ─────────────────────────────────────────────────────────────────
  const icon = { pass: "  ok  ", warn: " warn ", fail: " FAIL " } as const;
  console.log(`\nCloudBase pre-flight — ${cfg.env}${hosted ? " (hosted)" : ""}\n`);
  for (const r of results) {
    console.log(`[${icon[r.level]}] ${r.title}`);
    if (r.detail) console.log(`          ${r.detail}`);
  }
  const failures = results.filter((r) => r.level === "fail").length;
  const warnings = results.filter((r) => r.level === "warn").length;
  console.log(
    failures
      ? `\n${failures} blocking issue${failures === 1 ? "" : "s"}. Do not share the link yet.\n`
      : `\nNo blocking issues${warnings ? `, ${warnings} thing${warnings === 1 ? "" : "s"} to be aware of` : ""}. Test the URL in a private window as someone who is not in the register before sharing it.\n`,
  );
  process.exit(failures ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
