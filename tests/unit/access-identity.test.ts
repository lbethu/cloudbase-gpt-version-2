import { describe, expect, it, vi } from "vitest";

/**
 * The launch-time access rule.
 *
 * Cloudflare Access proves who someone is; the people register decides whether
 * they may be here at all. Two failures would be serious and are pinned here:
 * trusting the convenience email header without verifying the signature, and
 * letting an authenticated stranger in because they merely reached the URL.
 */
describe("Cloudflare Access identity", () => {
  it("never trusts the email header on its own", async () => {
    vi.resetModules();
    const cfg = await import("@/server/config");
    cfg.resetConfigForTests();
    vi.stubEnv("CLOUDBASE_AUTH_MODE", "access");
    vi.stubEnv("CLOUDBASE_ACCESS_TEAM_DOMAIN", "cloudpoint.cloudflareaccess.com");
    vi.stubEnv("CLOUDBASE_ACCESS_AUD", "test-aud");
    cfg.resetConfigForTests();

    const { getIdentityProvider } = await import("@/server/auth/identity");
    const provider = getIdentityProvider()!;
    expect(provider.name).toBe("access");

    // An attacker who can reach the origin directly sets the convenience headers.
    const forged = new Headers({
      "cf-access-authenticated-user-email": "bethu.lokendrasrisai@gmail.com",
      "x-forwarded-email": "bethu.lokendrasrisai@gmail.com",
    });
    expect(await provider.resolve(forged)).toBeNull();

    // A JWT that is not signed by the team's key set is equally worthless.
    const junk = new Headers({ "cf-access-jwt-assertion": "eyJhbGciOiJub25lIn0.eyJlbWFpbCI6ImJldGh1Lmxva2VuZHJhc3Jpc2FpQGdtYWlsLmNvbSJ9." });
    expect(await provider.resolve(junk)).toBeNull();
    vi.unstubAllEnvs();
    cfg.resetConfigForTests();
  });

  it("refuses an authenticated person who is not in the register", async () => {
    const { findPerson } = await import("@/server/auth/people");
    expect(findPerson("someone.else@example.com")).toBeUndefined();
  });

  it("holds a register where every listed person is usable", async () => {
    const { listPeople } = await import("@/server/auth/people");
    const { repos } = await import("../support/repos");
    const roleIds = new Set(repos.roles.list().map((r) => r.id));
    const teamIds = new Set(repos.teams.list().map((t) => t.id));
    const people = listPeople();
    expect(people.length).toBeGreaterThan(0);
    for (const p of people) {
      expect(p.email, "email is lower-cased for matching").toBe(p.email.toLowerCase());
      for (const r of p.roles) expect(roleIds.has(r), `${p.email} role ${r}`).toBe(true);
      for (const t of p.teams) expect(teamIds.has(t), `${p.email} team ${t}`).toBe(true);
    }
  });

  it("grants only what the register says, plus the implicit base", async () => {
    const { findPerson } = await import("@/server/auth/people");
    const owner = findPerson("bethu.lokendrasrisai@gmail.com")!;
    expect(owner.roles).toContain("admin");
    expect(owner.roles).not.toContain("employee"); // implicit, not written down
  });
});
