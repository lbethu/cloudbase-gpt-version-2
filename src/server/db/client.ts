import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getConfig } from "@/server/config";
import * as schema from "./schema";

let sql: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

/** Single connection pool per process. `DATABASE_URL` is read only here. */
export function getDb() {
  if (db) return db;
  const url = getConfig().database.url;
  if (!url) throw new Error("DATABASE_URL is not set. Set CLOUDBASE_STORAGE=file or configure the database.");
  sql = postgres(url, { max: getConfig().env === "production" ? 10 : 4, prepare: false, ssl: url.includes("localhost") || url.includes("127.0.0.1") ? undefined : "require" });
  db = drizzle(sql, { schema });
  return db;
}

export async function closeDb() {
  await sql?.end({ timeout: 2 });
  sql = null;
  db = null;
}

export { schema };
