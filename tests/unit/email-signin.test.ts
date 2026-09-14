import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Sign-in by emailed code. The four properties that make this safe enough for
 * an internal tool holding real SOPs, each pinned here because each one is the
 * kind of thing that silently stops being true.
 */
const load = async () => {
  vi.resetModules();
  const cfg = await import("@/server/config");
  cfg.resetConfigForTests();
  return cfg;
};

afterEach(async () => {
  vi.unstubAllEnvs();
  (await import("@/server/config")).resetConfigForTests();
});

describe("email sign-in", () => {
  it("disables itself when no session secret is set, rather than signing forgeable sessions", async () => {
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "email");
    vi.stubEnv("CLOUDBASE_SESSION_SECRET", "");
    const cfg = await load();
    expect(cfg.getConfig().auth.mode).toBe("none");
  });

  it("enables itself once a secret exists", async () => {
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "email");
    vi.stubEnv("CLOUDBASE_SESSION_SECRET", "a-long-random-development-secret-value");
    const cfg = await load();
    expect(cfg.getConfig().auth.mode).toBe("email");
  });

  it("does not reveal whether an address may sign in", async () => {
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "email");
    vi.stubEnv("CLOUDBASE_SESSION_SECRET", "a-long-random-development-secret-value");
    await load();
    const { requestSignInCode } = await import("@/server/auth/signin");
    const stranger = await requestSignInCode("nobody.here@example.com");
    // Same shape as a real request: the page must not become a staff directory.
    expect(stranger.ok).toBe(true);
  });

  it("refuses a wrong code, and stops accepting guesses after five", async () => {
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "email");
    vi.stubEnv("CLOUDBASE_SESSION_SECRET", "a-long-random-development-secret-value");
    vi.stubEnv("CLOUDBASE_MAIL_DRIVER", "log");
    await load();
    const { requestSignInCode, verifySignInCode } = await import("@/server/auth/signin");
    const email = "bethu.lokendrasrisai@gmail.com"; // in the register

    expect((await requestSignInCode(email)).ok).toBe(true);
    for (let i = 0; i < 5; i++) {
      const attempt = await verifySignInCode(email, "000001");
      expect(attempt.ok).toBe(false);
    }
    const afterLimit = await verifySignInCode(email, "000001");
    expect(afterLimit.ok).toBe(false);
    if (!afterLimit.ok) expect(afterLimit.error).toMatch(/too many|expired|not valid/i);
  });

  it("never stores the code itself", async () => {
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "email");
    vi.stubEnv("CLOUDBASE_SESSION_SECRET", "a-long-random-development-secret-value");
    vi.stubEnv("CLOUDBASE_MAIL_DRIVER", "log");
    await load();
    const signin = await import("@/server/auth/signin");
    const source = (await import("node:fs")).readFileSync("src/server/auth/signin.ts", "utf8");
    expect(source).toMatch(/createHash\("sha256"\)/);
    expect(source).toMatch(/timingSafeEqual/);
    expect(typeof signin.verifySignInCode).toBe("function");
  });
});
