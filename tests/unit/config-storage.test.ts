import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Storage selection must be an explicit decision.
 *
 * A DATABASE_URL sitting in the environment — put there to run db:migrate, or
 * left over from another project — must never switch a working deployment onto
 * a database that has not been migrated or seeded. Serving from PostgreSQL
 * requires CLOUDBASE_STORAGE=postgres and nothing else does it.
 */
const config = async () => {
  vi.resetModules();
  const mod = await import("@/server/config");
  mod.resetConfigForTests();
  return mod.getConfig();
};

afterEach(async () => {
  vi.unstubAllEnvs();
  const mod = await import("@/server/config");
  mod.resetConfigForTests();
});

describe("storage selection", () => {
  it("defaults to the file registry", async () => {
    vi.stubEnv("CLOUDBASE_STORAGE", "");
    vi.stubEnv("DATABASE_URL", "");
    expect((await config()).storage.mode).toBe("file");
  });

  it("stays on the file registry when only DATABASE_URL is set", async () => {
    vi.stubEnv("CLOUDBASE_STORAGE", "");
    vi.stubEnv("DATABASE_URL", "postgres://user:pw@example.invalid/db");
    const cfg = await config();
    expect(cfg.storage.mode).toBe("file");
    expect(cfg.database.url).toBe("postgres://user:pw@example.invalid/db"); // still available to the db scripts
  });

  it("uses postgres only when asked for it explicitly", async () => {
    vi.stubEnv("CLOUDBASE_STORAGE", "postgres");
    vi.stubEnv("DATABASE_URL", "postgres://user:pw@example.invalid/db");
    expect((await config()).storage.mode).toBe("postgres");
  });

  it("treats any other value as the file registry", async () => {
    for (const value of ["file", "FILE", "pg", "true", " "]) {
      vi.stubEnv("CLOUDBASE_STORAGE", value);
      expect((await config()).storage.mode).toBe("file");
    }
  });

  it("applies the same rule to document storage", async () => {
    vi.stubEnv("S3_BUCKET", "cloudbase-documents");
    vi.stubEnv("CLOUDBASE_BLOB_STORAGE", "");
    expect((await config()).blob.mode).toBe("local");
    vi.stubEnv("CLOUDBASE_BLOB_STORAGE", "s3");
    expect((await config()).blob.mode).toBe("s3");
  });
});
