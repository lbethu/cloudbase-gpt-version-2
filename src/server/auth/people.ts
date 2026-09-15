import "server-only";
import path from "node:path";
import { Person } from "@/domain/people";
import { getConfig } from "@/server/config";
import { loadYamlCollection } from "@/server/repositories/registry";

/**
 * The people register, read from content/registry/people.yaml.
 *
 * Kept out of the Repositories interface on purpose: this is authorization
 * input, it is consulted on every request including ones that fail, and it
 * must not depend on a database being reachable. A registry file is also the
 * right shape for it — every change to who can approve an SOP becomes a
 * reviewable diff.
 */
export function listPeople(): Person[] {
  return loadYamlCollection(path.join(getConfig().contentDir, "registry", "people.yaml"), Person);
}

export function findPerson(email: string): Person | undefined {
  const wanted = email.trim().toLowerCase();
  return listPeople().find((p) => p.email === wanted);
}

/**
 * Resolves the label on an access code entry to a registered person.
 *
 * The label may be an address, or just a first name while the preview runs on
 * placeholder addresses. Matching by name is only safe because it must be
 * unique: if two people are registered under the same name, neither is
 * returned, so an ambiguous label grants nothing rather than guessing between
 * two sets of roles.
 */
export function findPersonByLabel(label: string): Person | undefined {
  const wanted = label.trim().toLowerCase();
  if (!wanted) return undefined;
  const active = listPeople().filter((p) => p.active);
  const byEmail = active.find((p) => p.email === wanted);
  if (byEmail) return byEmail;
  const byName = active.filter((p) => p.name.trim().toLowerCase() === wanted);
  return byName.length === 1 ? byName[0] : undefined;
}
