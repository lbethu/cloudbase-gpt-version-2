#!/usr/bin/env node
/**
 * One-time importer: converts the legacy prototype SOP index
 * (src/legacy/data/sop-knowledge-base.ts — text extracted from the real files
 * in source-documents/) into the governed registry:
 *
 *   content/registry/sops/<id>.yaml         SOP entries + versions + file pointers
 *   content/knowledge/imported/sop-content.json  extracted sections/chunks
 *
 * Re-running is idempotent for generated fields and never overwrites a SOP
 * YAML that has `provenance.locked: true` (hand-edited after import).
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const legacyPath = path.join(root, "src/legacy/data/sop-knowledge-base.ts");
const sopDir = path.join(root, "content/registry/sops");
const importedPath = path.join(root, "content/knowledge/imported/sop-content.json");

const ts = fs.readFileSync(legacyPath, "utf8");
const match = ts.match(/sopKnowledgeDocuments[^=]*=\s*(\[[\s\S]*?\n\]);/);
if (!match) throw new Error("could not locate sopKnowledgeDocuments array");
const docs = JSON.parse(match[1]);

const teamByDepartment = {
  Finance: "operations-admin",
  Operations: "operations-admin",
  Marketing: "sales-bd",
  Sales: "sales-bd",
  "Field Operations": "field-reality-capture",
  "Project Delivery": "operations-admin",
};

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/\(1\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const baseTitle = (t) => t.replace(/\s*\(1\)\s*$/, "").trim();
const mediaType = (p) =>
  p.endsWith(".pdf")
    ? "application/pdf"
    : p.endsWith(".docx")
      ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : "application/octet-stream";

const today = new Date().toISOString().slice(0, 10);
const groups = new Map();
const imported = [];

for (const d of docs) {
  const title = baseTitle(d.title);
  const key = d.sopNumber ? `sop-${slug(d.sopNumber)}` : `sop-${slug(title)}`;
  const relPath = decodeURIComponent(d.sourceUrl.replace(/^\/source-documents\//, ""));
  const contentId = `imported:${d.id}`;
  imported.push({
    id: contentId,
    sourcePath: relPath,
    extractedAt: today,
    sections: d.sections,
    chunks: d.chunks,
  });
  if (!groups.has(key)) groups.set(key, { title, doc: d, files: [] });
  groups.get(key).files.push({ relPath, contentId, original: d.title });
}

fs.mkdirSync(sopDir, { recursive: true });
fs.mkdirSync(path.dirname(importedPath), { recursive: true });

let written = 0;
for (const [id, g] of groups) {
  const target = path.join(sopDir, `${id}.yaml`);
  if (fs.existsSync(target)) {
    const existing = YAML.parse(fs.readFileSync(target, "utf8"));
    if (existing?.provenance?.locked) continue;
  }
  const d = g.doc;
  const owningTeam = teamByDepartment[d.department] ?? "company-wide";
  const teams = d.collection === "PM/PL SOPs" ? ["technical-gis"] : [];
  const versions = g.files.map((f, i) => ({
    version: g.files.length > 1 ? `imported.${i + 1}` : "imported.1",
    status: "review",
    changeSummary:
      g.files.length > 1
        ? `Imported from "${f.original}". Two files were found for this SOP; the effective version must be confirmed by the owner.`
        : `Imported from "${f.original}".`,
    importedContentId: f.contentId,
    sourceFile: {
      id: `file-${slug(f.original)}-${i + 1}`,
      path: f.relPath,
      mediaType: mediaType(f.relPath),
      label: f.original,
    },
    purpose: d.summary && baseTitle(d.summary) !== g.title ? d.summary : "",
    references: [],
  }));
  const record = {
    id,
    title: g.title,
    sopNumber: d.sopNumber || "",
    category: d.category,
    summary: d.summary && baseTitle(d.summary) !== g.title ? d.summary : "",
    kind: /checklist/i.test(g.title) ? "checklist" : d.documentType === "PDF" ? (/playbook|manual/i.test(g.title) ? "manual" : "guide") : "sop",
    owningTeam,
    teams,
    owner: d.ownerRole || "",
    classification: "internal",
    tags: [...new Set((d.tags || []).filter((t) => t.length > 2 && !/[.,]$/.test(t)))].slice(0, 10),
    version: "imported",
    updatedAt: today,
    versions,
    relatedSystems: [],
    provenance: {
      importedFrom: "legacy prototype index (src/legacy/data/sop-knowledge-base.ts)",
      importedAt: today,
      note: "Text was extracted from the original file. Owner verification is required before this SOP can be approved.",
      locked: false,
    },
  };
  fs.writeFileSync(target, YAML.stringify(record, { lineWidth: 0 }));
  written++;
}

fs.writeFileSync(importedPath, JSON.stringify(imported, null, 2));
console.log(`SOPs written: ${written} (groups: ${groups.size}); imported content records: ${imported.length}`);
