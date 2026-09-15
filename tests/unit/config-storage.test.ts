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

describe("an unreadable database must not take the platform down", () => {
  afterEach(async () => {
    vi.unstubAllEnvs();
    const { resetConfigForTests } = await import("@/server/config");
    resetConfigForTests();
    const { resetRepositoriesForTests } = await import("@/server/repositories");
    resetRepositoriesForTests();
  });

  it("serves the built-in registry, says why, and refuses governed writes", async () => {
    vi.resetModules();
    // A host that cannot be resolved: the same shape of failure as a database
    // that is unreachable, wrongly addressed, or asleep.
    vi.stubEnv("CLOUDBASE_STORAGE", "postgres");
    vi.stubEnv("DATABASE_URL", "postgres://nobody@no-such-host.invalid:5432/nothing");
    const { resetConfigForTests } = await import("@/server/config");
    resetConfigForTests();
    const { ensureRepositories, storageDegradedReason, resetRepositoriesForTests } = await import("@/server/repositories");
    resetRepositoriesForTests();

    // Reading keeps working rather than throwing.
    const repos = await ensureRepositories();
    expect(repos.sops.list().length).toBeGreaterThan(0);
    expect(repos.teams.list().length).toBeGreaterThan(0);

    // And the reason is available to say so on the page.
    const reason = storageDegradedReason();
    expect(reason).toBeTruthy();
    expect(reason).toMatch(/database/i);

    // Writing is refused for as long as it lasts: a governed record written
    // against the fallback would diverge from the database it belongs to.
    // Writing is refused for as long as it lasts: a governed record written
    // against the fallback would diverge from the database it belongs to.
    const { uploadSopDocument } = await import("@/server/services/sop-workflow");
    // Deliberately over-privileged, so what stops the write is the storage
    // state and nothing else.
    const identity = {
      subject: "test",
      email: "bethu.lokendrasrisai@gmail.com",
      name: "T",
      roles: ["contributor", "reviewer", "approver", "admin"],
      teams: ["company-wide"],
      tenantId: "cloudpoint",
    };
    const attempt = await uploadSopDocument(identity as never, {
      fileName: "anything.docx",
      bytes: Buffer.from("not a real document, and it never gets that far"),
      title: "Anything",
      owningTeam: "operations-admin",
    } as never);
    expect(attempt.ok).toBe(false);
    if (!attempt.ok) {
      expect(attempt.status).toBe(503);
      expect(attempt.error).toMatch(/cannot reach its database/i);
    }
  }, 30000);
});
