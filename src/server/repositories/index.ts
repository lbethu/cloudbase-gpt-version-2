import "server-only";
import { getConfig } from "@/server/config";
import { createFileRepositories } from "./file-registry";
import type { Repositories } from "./interfaces";
import { createPostgresRepositories, ensureSnapshot } from "./postgres";

let repositories: Repositories | null = null;
let degraded: string | null = null;

/**
 * Storage selection: `CLOUDBASE_STORAGE=file` (git-versioned content/) or
 * `postgres` (DATABASE_URL). Both implement the same interfaces; services and
 * UI never know which is active.
 *
 * ## When the database cannot be read
 *
 * A misconfigured or unmigrated database used to take every page down with an
 * unreadable server exception. That is the wrong failure: the git-versioned
 * registry ships inside the deployment and is perfectly readable, so the
 * platform can keep answering questions about SOPs while the database is
 * sorted out.
 *
 * So CloudBase falls back to it — but never quietly, and never in a way that
 * could be mistaken for normal operation:
 *
 *  - Every page carries a banner saying the database is unreachable and that
 *    recent changes may not be shown.
 *  - Writing is refused for as long as it lasts. An upload or approval saved
 *    against the fallback would either vanish with the container or diverge
 *    from the database, and a governed record that disagrees with itself is
 *    worse than one that could not be written.
 *  - The reason is reported verbatim by /api/health, so the fix is a sentence
 *    rather than a guess.
 *
 * The database is retried on the next request, so recovery needs no redeploy.
 */
export function getRepositories(): Repositories {
  if (!repositories) {
    repositories = getConfig().storage.mode === "postgres" && !degraded ? createPostgresRepositories() : createFileRepositories(getConfig().contentDir);
  }
  return repositories;
}

/** Call once per request before reading governed data (no-op in file mode). */
export async function ensureRepositories(): Promise<Repositories> {
  if (getConfig().storage.mode !== "postgres") return getRepositories();
  try {
    await ensureSnapshot();
    if (degraded) {
      // Recovered. Drop the fallback and serve the database again.
      degraded = null;
      repositories = null;
    }
  } catch (error) {
    const next = error instanceof Error ? error.message : String(error);
    if (degraded !== next) {
      degraded = next;
      repositories = null;
      console.error(`[storage] Serving the built-in registry read-only — the database could not be read: ${next}`);
    }
  }
  return getRepositories();
}

/**
 * The reason the database is unavailable, or null when all is well. Read by the
 * page banner and by /api/health; it is the only thing that should be used to
 * decide whether governed writing is permitted.
 */
export function storageDegradedReason(): string | null {
  return getConfig().storage.mode === "postgres" ? degraded : null;
}

export function resetRepositoriesForTests() {
  repositories = null;
  degraded = null;
}

export type { Repositories } from "./interfaces";
