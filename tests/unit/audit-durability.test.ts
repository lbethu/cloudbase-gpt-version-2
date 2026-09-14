import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Identity } from "@/server/auth/identity";

/**
 * Audit writes must complete before the action reports success.
 *
 * They used to be fire-and-forget. A floating promise is only as reliable as
 * the process outliving it, and a serverless instance may freeze the moment a
 * response is sent — so approvals really were being recorded only when the
 * process happened to stay alive long enough. An approval that happened but
 * was never written is the one failure this log exists to prevent.
 */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cloudbase-audit-"));
const contentDir = path.join(tmp, "content");
const auditDir = path.join(tmp, "audit");
const identity = (roles: string[]): Identity => ({ subject: "u-audit", name: "Audit Test", email: "audit@cloudpoint.local", roles, teams: ["company-wide"], tenantId: "cloudpoint", provider: "dev" });

beforeAll(() => {
  fs.cpSync(path.resolve(__dirname, "../../content"), contentDir, { recursive: true });
  vi.stubEnv("CLOUDBASE_CONTENT_DIR", contentDir);
  vi.stubEnv("CLOUDBASE_SOURCE_DOCUMENTS_DIR", path.join(tmp, "source-documents"));
  vi.stubEnv("CLOUDBASE_AUDIT_DIR", auditDir);
});
afterAll(() => {
  vi.unstubAllEnvs();
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe("audit durability", () => {
  it("has written the event by the time a governed action returns", async () => {
    const { approveSopVersion } = await import("@/server/services/sop-workflow");
    const { listAuditEvents } = await import("@/server/services/audit");

    // Denied attempt: the refusal itself must be on record immediately.
    const denied = await approveSopVersion(identity(["employee"]), "sop-101-1", "imported.1", "no permission");
    expect(denied.ok).toBe(false);
    expect((await listAuditEvents(50)).some((e) => e.action === "sop.approve" && e.outcome === "denied")).toBe(true);

    // Allowed approval: same requirement, no polling, no waiting.
    const ok = await approveSopVersion(identity(["employee", "approver"]), "sop-101-1", "imported.1", "Recorded immediately.");
    expect(ok.ok).toBe(true);
    const events = await listAuditEvents(50);
    const approval = events.find((e) => e.action === "sop.approve" && e.outcome === "allowed");
    expect(approval, "the approval is on record the instant the call returns").toBeTruthy();
    expect(approval?.target?.id).toBe("sop-101-1");
  });

  it("never lets a failing audit sink break the action", async () => {
    const { recordAudit } = await import("@/server/services/audit");
    const writer = await import("@/server/repositories/writer");
    const spy = vi.spyOn(writer, "getRegistryWriter").mockReturnValue({
      mode: "file",
      appendAudit: () => Promise.reject(new Error("sink down")),
    } as unknown as ReturnType<typeof writer.getRegistryWriter>);
    await expect(recordAudit({ actor: "x", action: "test", outcome: "allowed", detail: {} })).resolves.toBeUndefined();
    spy.mockRestore();
  });
});
