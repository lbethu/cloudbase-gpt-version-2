import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { SourceFile } from "@/domain";
import type { Identity } from "@/server/auth/identity";
import { can, canRead } from "@/server/authz";
import { getConfig } from "@/server/config";
import { getRepositories } from "@/server/repositories";
import { recordAudit } from "./audit";

/**
 * Protected source-file access.
 *
 * Files are addressed by registry-declared ids, never by path. The resolved
 * path must stay inside `source-documents/`. Access requires `files.read`
 * plus read access to the owning object; every access is audited.
 */

export interface ResolvedFile {
  file: SourceFile;
  absolutePath: string;
  owner: { type: "sop"; id: string; title: string };
}

export function findSourceFile(fileId: string): ResolvedFile | null {
  const repos = getRepositories();
  for (const sop of repos.sops.list()) {
    for (const version of sop.versions) {
      if (version.sourceFile?.id === fileId) {
        const root = path.resolve(getConfig().sourceDocumentsDir);
        const absolutePath = path.resolve(root, version.sourceFile.path);
        if (!absolutePath.startsWith(root + path.sep)) return null; // traversal guard
        return { file: version.sourceFile, absolutePath, owner: { type: "sop", id: sop.id, title: sop.title } };
      }
    }
  }
  return null;
}

export type FileAccess =
  | { ok: true; resolved: ResolvedFile; stream: fs.ReadStream; size: number }
  | { ok: false; status: 401 | 403 | 404 };

export function openSourceFile(identity: Identity | null, fileId: string): FileAccess {
  const resolved = findSourceFile(fileId);
  const actor = identity?.subject ?? "anonymous";
  if (!identity) {
    recordAudit({ actor, action: "files.read", outcome: "denied", detail: { fileId, reason: "no-identity" } });
    return { ok: false, status: 401 };
  }
  if (!resolved) {
    recordAudit({ actor, action: "files.read", outcome: "denied", detail: { fileId, reason: "not-found" } });
    return { ok: false, status: 404 };
  }
  const sop = getRepositories().sops.get(resolved.owner.id);
  const allowed =
    can(identity, "files.read") &&
    !!sop &&
    canRead(identity, { type: "sop", classification: sop.classification, owningTeam: sop.owningTeam, teams: sop.teams, accessGrants: sop.accessGrants });
  if (!allowed) {
    recordAudit({ actor, action: "files.read", target: { type: "sop", id: resolved.owner.id }, outcome: "denied", detail: { fileId } });
    return { ok: false, status: 403 };
  }
  if (!fs.existsSync(resolved.absolutePath)) {
    recordAudit({ actor, action: "files.read", target: { type: "sop", id: resolved.owner.id }, outcome: "error", detail: { fileId, reason: "missing-on-disk" } });
    return { ok: false, status: 404 };
  }
  recordAudit({ actor, action: "files.read", target: { type: "sop", id: resolved.owner.id }, outcome: "allowed", detail: { fileId } });
  return { ok: true, resolved, stream: fs.createReadStream(resolved.absolutePath), size: fs.statSync(resolved.absolutePath).size };
}
