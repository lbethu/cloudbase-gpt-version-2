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
