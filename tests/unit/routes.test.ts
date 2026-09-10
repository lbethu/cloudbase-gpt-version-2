import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Route-handler tests: unauthenticated and unauthorized access, path safety,
 * and the audit trail for protected files.
 */

const fixtures = path.resolve(__dirname, "../fixtures");

/** Modules are reset per test, so the config cache must be reset on the *current* module instance. */
const resetConfigForTests = async () => (await import("@/server/config")).resetConfigForTests();

beforeEach(async () => {
  vi.stubEnv("CLOUDBASE_SOURCE_DOCUMENTS_DIR", path.join(fixtures, "source-documents"));
  vi.stubEnv("CLOUDBASE_AUDIT_DIR", path.join(fixtures, "audit-tmp"));
  vi.stubEnv("CLOUDBASE_CONTENT_DIR", path.resolve(__dirname, "../../content"));
  await resetConfigForTests();
});
afterEach(async () => {
  vi.unstubAllEnvs();
  await resetConfigForTests();
  vi.resetModules();
});

const req = (url: string, init?: { method?: string; body?: string }) => new NextRequest(new URL(url, "http://localhost"), init);

describe("/api/files/[fileId]", () => {
  it("returns 401 without an identity", async () => {
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "none");
    await resetConfigForTests();
    const { GET } = await import("@/app/api/files/[fileId]/route");
    const res = await GET(req("/api/files/file-101-1-invoicing-1"), { params: Promise.resolve({ fileId: "file-101-1-invoicing-1" }) });
    expect(res.status).toBe(401);
  });
  it("returns 403 when the role is explicitly denied files.read", async () => {
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "dev");
    vi.stubEnv("CLOUDBASE_DEV_USER_ROLES", "employee,restricted-readonly");
    await resetConfigForTests();
    const { GET } = await import("@/app/api/files/[fileId]/route");
    const res = await GET(req("/api/files/file-101-1-invoicing-1"), { params: Promise.resolve({ fileId: "file-101-1-invoicing-1" }) });
    expect(res.status).toBe(403);
  });
  it("returns 404 for unknown ids and never accepts paths", async () => {
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "dev");
    await resetConfigForTests();
    const { GET } = await import("@/app/api/files/[fileId]/route");
    for (const id of ["../../package.json", "sop/101.1 - Invoicing.docx", "nope"]) {
      const res = await GET(req(`/api/files/${encodeURIComponent(id)}`), { params: Promise.resolve({ fileId: id }) });
      expect(res.status).toBe(404);
    }
  });
  it("streams a registered file to an authorized employee with no-store headers", async () => {
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "dev");
    vi.stubEnv("CLOUDBASE_DEV_USER_ROLES", "employee");
    await resetConfigForTests();
    const { GET } = await import("@/app/api/files/[fileId]/route");
    const res = await GET(req("/api/files/file-101-1-invoicing-1"), { params: Promise.resolve({ fileId: "file-101-1-invoicing-1" }) });
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect(res.headers.get("content-type")).toContain("wordprocessingml");
    expect(await res.text()).toContain("fixture");
  });
});

describe("/api/search and /api/ask", () => {
  it("search requires authentication and validates input", async () => {
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "none");
    await resetConfigForTests();
    const { GET } = await import("@/app/api/search/route");
    expect((await GET(req("/api/search?q=sop"))).status).toBe(401);
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "dev");
    await resetConfigForTests();
    expect((await GET(req("/api/search?q=sop&type=not-a-type"))).status).toBe(400);
    const ok = await GET(req("/api/search?q=invoicing&type=sop"));
    expect(ok.status).toBe(200);
    const data = (await ok.json()) as { hits: Array<{ item: { ref: { type: string }; body?: string } }> };
    expect(data.hits.length).toBeGreaterThan(0);
    expect(data.hits.every((h) => h.item.ref.type === "sop")).toBe(true);
    expect(data.hits.every((h) => h.item.body === undefined)).toBe(true);
  });
  it("ask requires ask.use and abstains when nothing matches", async () => {
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "dev");
    vi.stubEnv("CLOUDBASE_DEV_USER_ROLES", "restricted-readonly");
    await resetConfigForTests();
    const { POST } = await import("@/app/api/ask/route");
    expect((await POST(req("/api/ask", { method: "POST", body: JSON.stringify({ question: "How do we invoice?" }) }))).status).toBe(403);
    vi.stubEnv("CLOUDBASE_DEV_USER_ROLES", "employee");
    await resetConfigForTests();
    const res = await POST(req("/api/ask", { method: "POST", body: JSON.stringify({ question: "zzqx plorvian xqzvw" }) }));
    expect(res.status).toBe(200);
    const data = (await res.json()) as { statements: Array<{ kind: string }>; mode: string };
    expect(data.mode).toBe("governed-retrieval");
    expect(data.statements[0].kind).toBe("UNKNOWN");
  });
});
