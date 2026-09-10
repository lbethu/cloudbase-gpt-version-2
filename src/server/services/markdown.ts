import "server-only";
import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { codeToHtml } from "shiki";

/**
 * Governed markdown → sanitized HTML with server-side syntax highlighting.
 * Output is sanitized with an allow-list; no raw HTML from authors survives.
 */

const LANG_ALIASES: Record<string, string> = { js: "javascript", ts: "typescript", py: "python", sh: "bash", shell: "bash", yml: "yaml", tsx: "tsx", jsx: "jsx" };
const KNOWN = new Set(["javascript", "typescript", "python", "bash", "yaml", "json", "tsx", "jsx", "sql", "markdown", "html", "css", "xml", "powershell", "text", "arcade"]);

async function highlight(code: string, lang: string): Promise<string> {
  const resolved = LANG_ALIASES[lang] ?? lang;
  const language = KNOWN.has(resolved) && resolved !== "arcade" ? resolved : "text";
  try {
    return await codeToHtml(code, { lang: language, themes: { light: "github-light", dark: "github-dark" }, defaultColor: false });
  } catch {
    return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
  }
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export interface RenderedMarkdown {
  html: string;
  headings: Array<{ depth: number; text: string; id: string }>;
}

export async function renderMarkdown(markdown: string, options: { stripLeadingHeading?: boolean } = { stripLeadingHeading: true }): Promise<RenderedMarkdown> {
  if (options.stripLeadingHeading) markdown = markdown.replace(/^\s*#\s+[^\n]+\n+/, "");
  const headings: RenderedMarkdown["headings"] = [];
  const blocks: Array<Promise<string>> = [];
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    renderer: {
      heading({ text, depth }) {
        const id = slugify(text);
        if (depth <= 3) headings.push({ depth, text: text.replace(/<[^>]+>/g, ""), id });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      code({ text, lang }) {
        const index = blocks.push(highlight(text, (lang ?? "text").trim().split(/\s+/)[0] || "text")) - 1;
        const language = escapeHtml((lang ?? "text").trim() || "text");
        return `<div class="codeblock" data-lang="${language}">@@CODEBLOCK:${index}@@</div>\n`;
      },
    },
  });
  let html = await marked.parse(markdown);
  const rendered = await Promise.all(blocks);
  // Sanitize the prose first, then splice in highlighted blocks (shiki output is trusted: it only contains span/style/pre/code).
  html = sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "h1", "h2", "details", "summary", "input"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["id", "class", "data-lang"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      input: ["type", "checked", "disabled"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["https", "data"] },
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
  });
  html = html.replace(/@@CODEBLOCK:(\d+)@@/g, (_, i: string) => rendered[Number(i)] ?? "");
  return { html, headings };
}
