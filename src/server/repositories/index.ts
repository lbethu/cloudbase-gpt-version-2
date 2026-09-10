import "server-only";
import { getConfig } from "@/server/config";
import { createFileRepositories } from "./file-registry";
import type { Repositories } from "./interfaces";

let repositories: Repositories | null = null;

/**
 * Storage selection. Today: file registry. Future: `CLOUDBASE_STORAGE=postgres`
 * returns a Drizzle-backed implementation of the same interfaces.
 */
export function getRepositories(): Repositories {
  if (!repositories) repositories = createFileRepositories(getConfig().contentDir);
  return repositories;
}

export type { Repositories } from "./interfaces";
