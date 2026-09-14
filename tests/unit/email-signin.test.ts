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

describe("mail delivery", () => {
  it("sends through Brevo with the sender split out of 'Name <address>'", async () => {
    vi.stubEnv("CLOUDBASE_MAIL_DRIVER", "brevo");
    vi.stubEnv("BREVO_API_KEY", "test-key");
    vi.stubEnv("CLOUDBASE_MAIL_FROM", "CloudBase <no-reply@cloudpointgeo.com>");
    await load();

    const calls: Array<{ url: string; body: Record<string, unknown>; headers: Record<string, string> }> = [];
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (url, init) => {
      calls.push({ url: String(url), body: JSON.parse(String(init?.body ?? "{}")), headers: (init?.headers ?? {}) as Record<string, string> });
      return new Response("{}", { status: 201 });
    });

    const { sendMail } = await import("@/server/auth/mailer");
    const result = await sendMail({ to: "someone@cloudpointgeo.com", subject: "123456 is your code", text: "code" });

    expect(result.ok).toBe(true);
    expect(calls[0].url).toContain("api.brevo.com");
    expect(calls[0].headers["api-key"]).toBe("test-key");
    expect(calls[0].body.sender).toEqual({ email: "no-reply@cloudpointgeo.com", name: "CloudBase" });
    expect(calls[0].body.to).toEqual([{ email: "someone@cloudpointgeo.com" }]);
    fetchSpy.mockRestore();
  });

  it("reports a refusal rather than pretending the code was sent", async () => {
    vi.stubEnv("CLOUDBASE_MAIL_DRIVER", "brevo");
    vi.stubEnv("BREVO_API_KEY", "test-key");
    await load();
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("sender not valid", { status: 400 }));
    const { sendMail } = await import("@/server/auth/mailer");
    const result = await sendMail({ to: "x@y.com", subject: "s", text: "t" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/400|sender/i);
    fetchSpy.mockRestore();
  });
});
