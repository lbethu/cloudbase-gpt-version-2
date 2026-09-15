import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

/**
 * PostgreSQL storage parity.
 *
 * Runs only when CLOUDBASE_TEST_DATABASE_URL points at a throwaway database
 * (start one locally, then `npm run db:migrate && npm run db:seed`). Without
 * it the suite is skipped so the default test run needs no infrastructure.
 *
 * What it proves: the same governed records come back through the Postgres
 * repositories as through the file registry, every row still validates against
 * its Zod schema, and search over database-loaded content finds the same SOPs.
 */
const url = process.env.CLOUDBASE_TEST_DATABASE_URL ?? "";

describe.skipIf(!url)("postgres storage", () => {
  beforeAll(() => {
    vi.stubEnv("DATABASE_URL", url);
    vi.stubEnv("CLOUDBASE_STORAGE", "postgres");
  });
  afterAll(async () => {
    const { closeDb } = await import("@/server/db/client");
    await closeDb();
    vi.unstubAllEnvs();
  });

  it("serves the same governed records as the file registry", async () => {
    vi.resetModules();
    const { resetConfigForTests } = await import("@/server/config");
    resetConfigForTests();
    const { ensureRepositories, getRepositories, resetRepositoriesForTests } = await import("@/server/repositories");
    resetRepositoriesForTests();
    await ensureRepositories();
    const pg = getRepositories();

    const { createFileRepositories } = await import("@/server/repositories/file-registry");
    const files = createFileRepositories((await import("@/server/config")).getConfig().contentDir);

    expect(pg.sops.list().length).toBe(files.sops.list().length);
    expect(pg.teams.list().map((t) => t.id)).toEqual(files.teams.list().map((t) => t.id));
    expect(pg.cros.rndProjects().map((p) => p.id).sort()).toEqual(files.cros.rndProjects().map((p) => p.id).sort());
    expect(pg.relationships.list().length).toBe(files.relationships.list().length);
    expect(pg.sops.allImportedContent().reduce((n, c) => n + c.chunks.length, 0)).toBe(files.sops.allImportedContent().reduce((n, c) => n + c.chunks.length, 0));
  });

  it("searches full text loaded from the database", async () => {
    const { getRepositories } = await import("@/server/repositories");
    const { buildKnowledgeIndex } = await import("@/server/services/knowledge-index");
    const { LexicalSearchProvider } = await import("@/server/search/lexical");
    const hits = await new LexicalSearchProvider([]).search({ q: "sql" }, buildKnowledgeIndex(getRepositories()));
    expect(hits.length).toBeGreaterThan(0);
  });

  it("writes an audit event and reads it back", async () => {
    const { getRegistryWriter, resetWriterForTests } = await import("@/server/repositories/writer");
    resetWriterForTests();
    const writer = getRegistryWriter();
    expect(writer.mode).toBe("postgres");
    const marker = `test-${Date.now()}`;
    await writer.appendAudit({ actor: marker, action: "test.audit", outcome: "allowed", detail: {} });
    const events = await writer.listAudit(50);
    expect(events.some((e) => e.actor === marker)).toBe(true);
  });
});

describe.skipIf(!url)("documents stored in the database", () => {
  beforeAll(() => {
    vi.stubEnv("DATABASE_URL", url);
    vi.stubEnv("CLOUDBASE_STORAGE", "postgres");
    vi.stubEnv("CLOUDBASE_BLOB_STORAGE", "postgres");
  });
  afterAll(async () => {
    const { closeDb } = await import("@/server/db/client");
    await closeDb();
    vi.unstubAllEnvs();
  });

  it("round-trips bytes, overwrites in place, and forgets on remove", async () => {
    vi.resetModules();
    const { resetConfigForTests } = await import("@/server/config");
    resetConfigForTests();
    const { getBlobStorage, resetBlobStorageForTests } = await import("@/server/storage/blob");
    resetBlobStorageForTests();
    const storage = getBlobStorage();
    expect(storage.name).toBe("postgres");

    const key = `uploads/test/${Date.now()}-round-trip.bin`;
    // Bytes that are not valid UTF-8, so a driver that quietly treated the
    // column as text would corrupt them rather than pass this.
    const bytes = Buffer.from([0x00, 0xff, 0xfe, 0x42, 0x0a, 0x80]);
    await storage.put(key, bytes, "application/octet-stream");

    expect(await storage.exists(key)).toBe(true);
    expect(await storage.stat(key)).toEqual({ size: 6, contentType: "application/octet-stream" });
    expect(Buffer.compare(await storage.read(key), bytes)).toBe(0);

    const chunks: Buffer[] = [];
    for await (const chunk of await storage.stream(key)) chunks.push(Buffer.from(chunk as Buffer));
    expect(Buffer.compare(Buffer.concat(chunks), bytes)).toBe(0);

    // A second put replaces rather than duplicating or failing on the key.
    const replaced = Buffer.from("replaced");
    await storage.put(key, replaced, "text/plain");
    expect((await storage.read(key)).toString()).toBe("replaced");
    expect((await storage.stat(key))?.contentType).toBe("text/plain");

    await storage.remove(key);
    expect(await storage.exists(key)).toBe(false);
    await storage.remove(key); // idempotent
    await expect(storage.read(key)).rejects.toThrow();
  });

  it("refuses keys that try to climb out of their prefix", async () => {
    vi.resetModules();
    const { resetConfigForTests } = await import("@/server/config");
    resetConfigForTests();
    const { getBlobStorage, resetBlobStorageForTests } = await import("@/server/storage/blob");
    resetBlobStorageForTests();
    const storage = getBlobStorage();
    for (const bad of ["../escape.docx", "uploads/../../etc/passwd", "uploads//double.docx"]) {
      await expect(storage.stat(bad)).rejects.toThrow(/Invalid storage key/);
    }
  });
});
