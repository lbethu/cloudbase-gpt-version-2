import "server-only";
import { getConfig } from "@/server/config";
import { createFileRepositories } from "./file-registry";
import type { Repositories } from "./interfaces";
import { createPostgresRepositories, ensureSnapshot } from "./postgres";

let repositories: Repositories | null = null;

/**
 * Storage selection: `CLOUDBASE_STORAGE=file` (git-versioned content/) or
 * `postgres` (DATABASE_URL). Both implement the same interfaces; services and
 * UI never know which is active.
 */
export function getRepositories(): Repositories {
  if (!repositories) repositories = getConfig().storage.mode === "postgres" ? createPostgresRepositories() : createFileRepositories(getConfig().contentDir);
  return repositories;
}

/** Call once per request before reading governed data (no-op in file mode). */
export async function ensureRepositories(): Promise<Repositories> {
  if (getConfig().storage.mode === "postgres") await ensureSnapshot();
  return getRepositories();
}

export function resetRepositoriesForTests() {
  repositories = null;
}

export type { Repositories } from "./interfaces";
