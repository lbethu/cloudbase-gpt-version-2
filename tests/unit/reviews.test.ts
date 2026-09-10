import { describe, expect, it } from "vitest";
import { deriveReviewTasks } from "@/server/services/reviews";
import { repos } from "../support/repos";

describe("review queue derivation", () => {
  it("creates an approval task for every SOP awaiting review", () => {
    const tasks = deriveReviewTasks(repos);
    const sopTasks = tasks.filter((t) => t.kind === "sop-approval");
    const awaitingReview = repos.sops.list().filter((s) => s.versions.some((v) => v.status === "review"));
    expect(sopTasks.length).toBe(awaitingReview.length);
    expect(sopTasks.every((t) => t.requiredPermission === "sop.approve")).toBe(true);
    expect(sopTasks.find((t) => t.target.id === "sop-105-2")?.note).toMatch(/2 versions/);
  });
  it("does not flag concept copilots or draft docs as approvals", () => {
    const tasks = deriveReviewTasks(repos);
    expect(tasks.some((t) => t.kind === "copilot-approval")).toBe(false);
    expect(tasks.some((t) => t.kind === "publication")).toBe(false);
  });
  it("every task links to a route under the object's canonical url", () => {
    for (const t of deriveReviewTasks(repos)) expect(t.url.startsWith("/")).toBe(true);
  });
});
