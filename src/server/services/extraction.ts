import "server-only";
import path from "node:path";
import mammoth from "mammoth";
import type { ImportedContent } from "@/domain";
import { getRegistryWriter } from "@/server/repositories/writer";

/**
 * Runtime full-text extraction for a single governed source file (the same
 * rules as scripts/extract-source-documents.mjs): DOCX by heading, PDF by
 * page, ~900-character chunks. Appends/replaces the record in
 * content/knowledge/imported/sop-content.json so the file is searchable and
 * citable immediately after upload.
 */

const CHUNK = 900;
const STOP = new Set("a an and are as at be by for from has have in is it its of on or that the this to was were will with your you we our".split(" "));
export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const clean = (s: string) => s.replace(/ /g, " ").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
const keywords = (text: string) => {
  const counts = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[a-z][a-z0-9.-]{2,}/g) ?? []) if (!STOP.has(w)) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([w]) => w);
};

function splitChunks(text: string): string[] {
  const paras = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
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

interface Section {
  title: string;
  text: string;
  page?: number;
}

async function extractDocx(buffer: Buffer): Promise<Section[]> {
  const { value: html } = await mammoth.convertToHtml({ buffer });
  const blocks = [...html.matchAll(/<(h[1-6]|p|li|td|th)[^>]*>([\s\S]*?)<\/\1>/g)];
  const sections: Section[] = [];
  let current: Section = { title: "Document", text: "" };
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
    const { value } = await mammoth.extractRawText({ buffer });
    sections.push({ title: "Document", text: clean(value) });
  }
  return sections;
}

async function extractPdf(buffer: Buffer): Promise<Section[]> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  const pages = Array.isArray(result.pages) && result.pages.length ? result.pages.map((p, i) => ({ num: p.num ?? i + 1, text: p.text ?? "" })) : [{ num: 1, text: result.text }];
  await parser.destroy?.();
  return pages.map((p) => ({ title: `Page ${p.num}`, text: clean(p.text), page: p.num })).filter((p) => p.text);
}

/** Extracts one document (bytes + its storage-relative path) and upserts its ImportedContent record. */
export async function extractAndIndex(relPath: string, bytes: Buffer): Promise<ImportedContent> {
  const ext = path.extname(relPath).toLowerCase();
  const sections = ext === ".pdf" ? await extractPdf(bytes) : ext === ".docx" ? await extractDocx(bytes) : null;
  if (!sections) throw new Error("Unsupported file type");
  const id = `imported:${slug(relPath)}`;
  const chunks: ImportedContent["chunks"] = [];
  sections.forEach((s, si) => splitChunks(s.text).forEach((content, ci) => chunks.push({ id: `${slug(relPath)}-s${si + 1}-c${ci + 1}`, section: s.title, content, keywords: keywords(content), page: s.page })));
  const record: ImportedContent = {
    id,
    sourcePath: relPath.replace(/\\/g, "/"),
    extractedAt: new Date().toISOString().slice(0, 10),
    extractor: ext === ".pdf" ? "pdf-parse" : "mammoth",
    characterCount: sections.reduce((n, s) => n + s.text.length, 0),
    sections: sections.map((s) => ({ title: s.title, summary: s.text.slice(0, 160).replace(/\s+/g, " ") })),
    chunks,
  };
  await getRegistryWriter().upsertImportedContent(record);
  return record;
}
