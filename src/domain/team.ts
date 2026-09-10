import { z } from "zod";
import { BusinessId } from "./common";

/**
 * Team workspaces. Teams are registry data, not code — administrators add a
 * team by adding a record to `content/registry/teams.yaml`.
 */
export const Team = z.object({
  id: BusinessId,
  name: z.string().min(1),
  shortName: z.string().min(1).max(6),
  description: z.string().default(""),
  /** Team leads / knowledge owners. Identity subjects (emails or Entra object ids). */
  owners: z.array(z.string()).default([]),
  experts: z.array(z.object({ name: z.string(), area: z.string().default("") })).default([]),
  commonQuestions: z.array(z.string()).default([]),
  /** `company-wide` workspaces are visible to everyone and own shared knowledge. */
  scope: z.enum(["team", "company-wide"]).default("team"),
  sortOrder: z.number().int().default(100),
});
export type Team = z.infer<typeof Team>;

export const TeamMembership = z.object({
  subject: z.string().min(1),
  teamId: BusinessId,
  role: z.enum(["member", "lead", "owner"]).default("member"),
});
export type TeamMembership = z.infer<typeof TeamMembership>;
