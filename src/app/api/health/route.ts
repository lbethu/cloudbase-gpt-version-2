import { NextResponse } from "next/server";
import { getConfig } from "@/server/config";

/**
 * Deployment self-check, readable without signing in.
 *
 * When a hosted deployment will not let anybody in, or answers 500, the
 * question is always the same: did the environment actually reach the running
 * instance, and can it read what it has been told to read? This answers that
 * and nothing more. It reports names, counts and booleans — never values — so
 * no code, secret, key or connection string passes through it.
 *
 * It is deliberately reachable while signed out. A deployment nobody can sign
 * in to is exactly when this is needed, and a page that required a session
 * could not report that sessions are impossible.
 */
export const dynamic = "force-dynamic";

interface StorageReport {
  mode: string;
  ok: boolean;
  detail: string;
}

/** Asks the database the same question the pages ask, and reports the answer rather than throwing. */
async function checkDatabase(): Promise<StorageReport> {
  const cfg = getConfig();
  if (cfg.storage.mode !== "postgres") {
    return { mode: "file", ok: true, detail: "Serving the git-versioned registry. Uploads and approvals are not possible." };
  }
  if (!cfg.database.url) {
    return { mode: "postgres", ok: false, detail: "CLOUDBASE_STORAGE=postgres but DATABASE_URL is not set." };
  }
  try {
    const { getDb, schema } = await import("@/server/db/client");
    const { count } = await import("drizzle-orm");
    const [records] = await getDb().select({ n: count() }).from(schema.governedRecords);
    if (!records || records.n === 0) {
      return { mode: "postgres", ok: false, detail: "Connected, but no records. The tables exist and are empty — run: npm run db:seed" };
    }
    let documents = -1;
    if (cfg.blob.mode === "postgres") {
      const [blobs] = await getDb().select({ n: count() }).from(schema.documentBlobs);
      documents = blobs?.n ?? 0;
    }
    return {
      mode: "postgres",
      ok: true,
      detail: `${records.n} records${documents >= 0 ? `, ${documents} document files` : ""}.${documents === 0 ? " No document files yet — run: npm run blob:upload" : ""}`,
    };
  } catch (error) {
    // The query layer wraps driver errors, so the sentence that says what is
    // actually wrong — and the SQL state that says it unambiguously — are
    // further down the cause chain than the top-level message.
    const chain: unknown[] = [];
    for (let e: unknown = error, depth = 0; e && depth < 5; depth++) chain.push(e), (e = (e as { cause?: unknown }).cause);
    const message = chain.map((e) => (e instanceof Error ? e.message : String(e))).join(" — ");
    const undefinedTable = chain.some((e) => (e as { code?: string })?.code === "42P01");

    // The two failures worth telling apart: tables that were never created,
    // and a database that cannot be reached at all.
    if (undefinedTable || /relation .* does not exist/i.test(message)) {
      return { mode: "postgres", ok: false, detail: "Connected, but the tables do not exist — run: npm run db:migrate, then npm run db:seed" };
    }
    return { mode: "postgres", ok: false, detail: `Could not reach the database: ${message}` };
  }
}

export async function GET() {
  const cfg = getConfig();
  // Which commit is actually running. Without this, "is my change deployed?"
  // can only be answered by hunting for some visible detail of the change and
  // hoping it is not cached — which is exactly how an afternoon disappears.
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? "";
  const storage = await checkDatabase();
  const authOk = cfg.auth.mode !== "none";

  return NextResponse.json({
    ok: authOk && storage.ok,
    env: cfg.env,
    build: {
      commit: sha ? sha.slice(0, 7) : "unknown",
      branch: process.env.VERCEL_GIT_COMMIT_REF || undefined,
      deployedAt: process.env.VERCEL_DEPLOYMENT_ID ? undefined : "local",
    },
    auth: {
      mode: cfg.auth.mode,
      ok: authOk,
      personalCodes: cfg.auth.personalCodes.map((p) => p.name),
      sharedCodeSet: cfg.auth.accessCode.length > 0,
      adminCodeSet: cfg.auth.adminCode.length > 0,
      adminCodeNames: cfg.auth.adminName || undefined,
      detail: cfg.auth.modeNote || undefined,
    },
    storage,
    blob: cfg.blob.mode,
    uploadsPossible: cfg.storage.mode === "postgres" && cfg.blob.mode !== "local" && storage.ok,
  });
}
