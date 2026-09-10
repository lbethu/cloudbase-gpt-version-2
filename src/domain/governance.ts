import { z } from "zod";
import { ContentRef } from "./common";

/**
 * Permission catalog. Authorization is resource.action based, default-deny,
 * with explicit deny precedence (see src/server/authz).
 */
export const PERMISSIONS = [
  "knowledge.read",
  "knowledge.create",
  "knowledge.edit",
  "knowledge.publish",
  "sop.read",
  "sop.author",
  "sop.review",
  "sop.approve",
  "rnd.read",
  "rnd.submit",
  "rnd.review",
  "rnd.approve",
  "capability.read",
  "capability.manage",
  "copilot.read",
  "copilot.manage",
  "automation.read",
  "automation.manage",
  "files.read",
  "ask.use",
  "crm.read",
  "crm.manage",
  "agent.read",
  "agent.run",
  "integration.read",
  "review.read",
  "admin.access",
  "audit.read",
] as const;

export const Permission = z.enum(PERMISSIONS);
export type Permission = z.infer<typeof Permission>;

/** Roles map to permission sets in the registry (content/registry/roles.yaml). */
export const Role = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  grants: z.array(Permission).default([]),
  /** Explicit denies always win over grants from any other role. */
  denies: z.array(Permission).default([]),
});
export type Role = z.infer<typeof Role>;

export const AuditEvent = z.object({
  id: z.string(),
  at: z.string(),
  actor: z.string(),
  action: z.string(),
  target: ContentRef.optional(),
  outcome: z.enum(["allowed", "denied", "error"]),
  detail: z.record(z.string(), z.unknown()).default({}),
});
export type AuditEvent = z.infer<typeof AuditEvent>;

export const ReviewTask = z.object({
  id: z.string(),
  target: ContentRef,
  title: z.string(),
  kind: z.enum(["sop-approval", "copilot-approval", "automation-approval", "stale-content", "publication", "evidence-approval"]),
  requiredPermission: Permission,
  owningTeam: z.string().default(""),
  openedAt: z.string().optional(),
  note: z.string().default(""),
  url: z.string(),
});
export type ReviewTask = z.infer<typeof ReviewTask>;
