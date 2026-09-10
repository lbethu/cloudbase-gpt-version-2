/**
 * Applies the forward-only SQL migrations in /drizzle to DATABASE_URL.
 *
 *   npm run db:migrate
 *
 * Drizzle records what it has applied in __drizzle_migrations, so this is safe
 * to re-run and safe to run on every deploy.
 */
import { config as loadEnv } from "dotenv";

// Match Next.js: .env.local wins over .env, and neither is committed.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });
import path from "node:path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { getDb, closeDb } from "../src/server/db/client";
import { getConfig } from "../src/server/config";

async function main() {
  if (!getConfig().database.url) throw new Error("DATABASE_URL is not set.");
  await migrate(getDb(), { migrationsFolder: path.resolve(process.cwd(), "drizzle") });
  console.log("Migrations applied.");
  await closeDb();
}

main().catch(async (error) => {
  console.error(error);
  await closeDb().catch(() => {});
  process.exit(1);
});
