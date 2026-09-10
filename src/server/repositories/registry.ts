import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import matter from "gray-matter";
import type { ZodType } from "zod";

/**
 * File-backed registry loader.
 *
 * Every collection is validated with its Zod schema at load time so a bad
 * record fails loudly (with file + index) instead of rendering garbage.
 * Results are cached per process; in development the cache is invalidated
 * when the file's mtime changes.
 */

interface CacheEntry<T> {
  mtimeKey: string;
  value: T;
}
const cache = new Map<string, CacheEntry<unknown>>();

const isDev = process.env.NODE_ENV !== "production";

const mtimeKeyFor = (files: string[]) =>
  isDev ? files.map((f) => `${f}:${fs.existsSync(f) ? fs.statSync(f).mtimeMs : 0}`).join("|") : "static";

export class RegistryValidationError extends Error {
  constructor(
    public readonly file: string,
    public readonly index: number | null,
    public readonly issues: string,
  ) {
    super(`Invalid registry record in ${file}${index === null ? "" : ` [#${index}]`}: ${issues}`);
  }
}

function parseCollection<T>(file: string, schema: ZodType<T>, raw: unknown): T[] {
  const list = raw == null ? [] : Array.isArray(raw) ? raw : [raw];
  return list.map((item, index) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      throw new RegistryValidationError(file, index, result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
    }
    return result.data;
  });
}

function listFiles(dir: string, ext: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && ext.some((x) => e.name.endsWith(x)))
    .map((e) => path.join(dir, e.name))
    .sort();
}

/** Loads one YAML file (list or single object) or every YAML file in a directory. */
export function loadYamlCollection<T>(target: string, schema: ZodType<T>): T[] {
  const files = fs.existsSync(target) && fs.statSync(target).isDirectory() ? listFiles(target, [".yaml", ".yml"]) : fs.existsSync(target) ? [target] : [];
  const key = `yaml:${target}`;
  const mtimeKey = mtimeKeyFor(files);
  const hit = cache.get(key) as CacheEntry<T[]> | undefined;
  if (hit && hit.mtimeKey === mtimeKey) return hit.value;
  const value = files.flatMap((file) => parseCollection(file, schema, YAML.parse(fs.readFileSync(file, "utf8"))));
  cache.set(key, { mtimeKey, value });
  return value;
}

export function loadJsonCollection<T>(file: string, schema: ZodType<T>): T[] {
  const key = `json:${file}`;
  const mtimeKey = mtimeKeyFor([file]);
  const hit = cache.get(key) as CacheEntry<T[]> | undefined;
  if (hit && hit.mtimeKey === mtimeKey) return hit.value;
  const value = fs.existsSync(file) ? parseCollection(file, schema, JSON.parse(fs.readFileSync(file, "utf8"))) : [];
  cache.set(key, { mtimeKey, value });
  return value;
}

export interface MarkdownRecord {
  file: string;
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

/** Loads every markdown file (recursively) with frontmatter. */
export function loadMarkdownDir(dir: string): MarkdownRecord[] {
  const files: string[] = [];
  const walk = (d: string) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".md")) files.push(p);
    }
  };
  walk(dir);
  files.sort();
  const key = `md:${dir}`;
  const mtimeKey = mtimeKeyFor(files);
  const hit = cache.get(key) as CacheEntry<MarkdownRecord[]> | undefined;
  if (hit && hit.mtimeKey === mtimeKey) return hit.value;
  const value = files.map((file) => {
    const parsed = matter(fs.readFileSync(file, "utf8"));
    return {
      file,
      slug: path.relative(dir, file).replace(/\\/g, "/").replace(/\.md$/, ""),
      frontmatter: parsed.data,
      body: parsed.content,
    };
  });
  cache.set(key, { mtimeKey, value });
  return value;
}

export function clearRegistryCache() {
  cache.clear();
}
