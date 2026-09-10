#!/usr/bin/env node
/**
 * Full-text extraction pipeline for governed source documents.
 *
 *   source-documents/**\/*.docx  → headings + paragraphs (mammoth)
 *   source-documents/**\/*.pdf   → per-page text (pdf-parse)
 *
 * Output: content/knowledge/imported/sop-content.json (ImportedContent[])
 *   - one record per file, keyed `imported:<path-slug>`
 *   - sections = document headings (docx) or pages (pdf)
 *   - chunks   ≈ 900 characters, aligned to sections, with page numbers
 *
 * It also points every non-locked SOP registry version at the new content id
 * so the registry never references stale extractions. Re-run whenever a
 * source file changes:  npm run extract:sources
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import mammoth from "mammoth";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const sourceDir = process.env.CLOUDBASE_SOURCE_DOCUMENTS_DIR ?? path.join(root, "source-documents");
const outFile = path.join(root, "content/knowledge/imported/sop-content.json");
const sopDir = path.join(root, "content/registry/sops");
const CHUNK = 900;
const today = new Date().toISOString().slice(0, 10);

const STOP = new Set("a an and are as at be by for from has have in is it its of on or that the this to was were will with your you we our".split(" "));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const clean = (s) => s.replace(/ /g, " ").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
const keywords = (text) => {
  const counts = new Map();
  for (const w of text.toLowerCase().match(/[a-z][a-z0-9.-]{2,}/g) ?? []) if (!STOP.has(w)) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([w]) => w);
};

const walk = (d) => (fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])) : []);

/** Split a section's text into ~CHUNK-sized pieces on paragraph boundaries. */
function splitChunks(text) {
  const paras = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const out = [];
  let cur = "";
  for (const p of paras) {
    if ((cur + "\n" + p).length > CHUNK && cur) {
      out.push(cur);
      cur = p;
    } else cur = cur ? `${cur}\n${p}` : p;
  }
  if (cur) out.push(cur);
  return out;
}

async function extractDocx(file) {
  const { value: html } = await mammoth.convertToHtml({ path: file });
  // Walk block elements in order; headings open a new section.
  const blocks = [...html.matchAll(/<(h[1-6]|p|li|td|th)[^>]*>([\s\S]*?)<\/\1>/g)];
  const sections = [];
  let current = { title: "Document", text: "" };
  for (const [, tag, inner] of blocks) {
    const text = clean(inner.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
    if (!text) continue;
    if (/^h[1-6]$/.test(tag)) {
      if (current.text.trim()) sections.push(current);
      current = { title: text.slice(0, 120), text: "" };
    } else current.text += text + "\n";
  }
  if (current.text.trim()) sections.push(current);
  if (!sections.length) {
    const { value } = await mammoth.extractRawText({ path: file });
    sections.push({ title: "Document", text: clean(value) });
  }
  return sections.map((s) => ({ ...s, page: undefined }));
}

async function extractPdf(file) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: fs.readFileSync(file) });
  const result = await parser.getText();
  const pages = Array.isArray(result.pages) && result.pages.length ? result.pages.map((p, i) => ({ num: p.num ?? i + 1, text: p.text ?? "" })) : [{ num: 1, text: result.text }];
  await parser.destroy?.();
  return pages.map((p) => ({ title: `Page ${p.num}`, text: clean(p.text), page: p.num })).filter((p) => p.text);
}

const records = [];
for (const file of walk(sourceDir).sort()) {
  const rel = path.relative(sourceDir, file).replace(/\\/g, "/");
  const ext = path.extname(file).toLowerCase();
  let sections;
  try {
    if (ext === ".docx") sections = await extractDocx(file);
    else if (ext === ".pdf") sections = await extractPdf(file);
    else continue;
  } catch (error) {
    console.error(`! ${rel}: ${error.message}`);
    continue;
  }
  const id = `imported:${slug(rel)}`;
  const chunks = [];
  sections.forEach((s, si) => {
    splitChunks(s.text).forEach((content, ci) => {
      chunks.push({ id: `${slug(rel)}-s${si + 1}-c${ci + 1}`, section: s.title, content, keywords: keywords(content), page: s.page });
    });
  });
  records.push({
    id,
    sourcePath: rel,
    extractedAt: today,
    extractor: ext === ".pdf" ? "pdf-parse" : "mammoth",
    characterCount: sections.reduce((n, s) => n + s.text.length, 0),
    sections: sections.map((s) => ({ title: s.title, summary: s.text.slice(0, 160).replace(/\s+/g, " ") })),
    chunks,
  });
  console.log(`✓ ${rel}  ${sections.length} sections, ${chunks.length} chunks`);
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(records, null, 2));

// Re-point SOP registry versions at the fresh content ids (unless locked).
const byPath = new Map(records.map((r) => [r.sourcePath, r.id]));
let updated = 0;
for (const f of fs.readdirSync(sopDir).filter((f) => f.endsWith(".yaml"))) {
  const p = path.join(sopDir, f);
  const sop = YAML.parse(fs.readFileSync(p, "utf8"));
  if (sop?.provenance?.locked) continue;
  let changed = false;
  for (const v of sop.versions ?? []) {
    const id = v.sourceFile?.path ? byPath.get(v.sourceFile.path) : undefined;
    if (id && v.importedContentId !== id) {
      v.importedContentId = id;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(p, YAML.stringify(sop, { lineWidth: 0 }));
    updated++;
  }
}
console.log(`\n${records.length} documents extracted → ${path.relative(root, outFile)}; ${updated} SOP records re-pointed.`);
