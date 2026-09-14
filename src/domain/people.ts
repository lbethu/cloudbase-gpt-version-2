import { z } from "zod";

/**
 * The people register — who may use CloudBase, and as what.
 *
 * With Microsoft Entra, group membership answers this and CloudBase reads it
 * from the sign-in token. Cloudpoint has no directory administration in place
 * yet, so this file answers it instead: a reviewable list of email addresses
 * with the roles and teams each person holds.
 *
 * Two deliberate properties:
 *
 *  - **Listing is required.** A person who authenticates successfully but is
 *    not in this file gets no access at all. The launch is scoped by adding
 *    names, not by trusting whoever can reach the URL.
 *  - **It is a git-tracked registry file**, so every change to who can approve
 *    an SOP is a reviewable diff with an author and a date — which is the
 *    property a directory would otherwise give you.
 *
 * This is the interim mechanism. When Entra group mapping is configured, the
 * register becomes redundant and can be emptied without touching any code.
 */
export const Person = z.object({
  /** Sign-in address, lower-cased. This is the join key with the identity provider. */
  email: z.string().email().transform((e) => e.toLowerCase()),
  name: z.string().min(1),
  /** Role ids from content/registry/roles.yaml. Everyone listed implicitly holds `employee`. */
  roles: z.array(z.string()).default([]),
  /** Team ids from content/registry/teams.yaml. Everyone implicitly belongs to `company-wide`. */
  teams: z.array(z.string()).default([]),
  title: z.string().default(""),
  /** Set false to revoke access without losing the record of who had it. */
  active: z.boolean().default(true),
  note: z.string().default(""),
});
export type Person = z.infer<typeof Person>;
