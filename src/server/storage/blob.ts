import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getConfig } from "@/server/config";

/**
 * Provider-neutral private document storage.
 *  - local:    files under source-documents/ (git-tracked or not — never /public)
 *  - s3:       any S3-compatible bucket (Supabase Storage, AWS S3, Cloudflare R2, MinIO, Azure via gateway)
 *  - postgres: bytes in the database, for a deployment that has one and no
 *              object store. Not the shape to grow into, but it needs no
 *              second service and no second set of credentials.
 * Objects are never public; every read goes through the authorized file route.
 */
export interface BlobStat {
  size: number;
  contentType?: string;
}
export interface BlobStorage {
  readonly name: "local" | "s3" | "postgres";
  exists(key: string): Promise<boolean>;
  stat(key: string): Promise<BlobStat | null>;
  read(key: string): Promise<Buffer>;
  stream(key: string): Promise<Readable>;
  put(key: string, bytes: Buffer, contentType: string): Promise<void>;
  /** Removes an object. Missing objects are not an error — deletion is idempotent. */
  remove(key: string): Promise<void>;
}

const safeKey = (key: string) => {
  const normalized = key.replace(/\\/g, "/").replace(/^\/+/, "");
  if (normalized.split("/").some((seg) => seg === ".." || seg === "")) throw new Error("Invalid storage key");
  return normalized;
};

class LocalStorage implements BlobStorage {
  readonly name = "local" as const;
  private abs(key: string) {
    const root = path.resolve(getConfig().sourceDocumentsDir);
    const abs = path.resolve(root, safeKey(key));
    if (!abs.startsWith(root + path.sep)) throw new Error("Invalid storage key");
    return abs;
  }
  async exists(key: string) {
    return fs.existsSync(this.abs(key));
  }
  async stat(key: string) {
    const abs = this.abs(key);
    return fs.existsSync(abs) ? { size: fs.statSync(abs).size } : null;
  }
  async read(key: string) {
    return fs.readFileSync(this.abs(key));
  }
  async stream(key: string) {
    return fs.createReadStream(this.abs(key));
  }
  async put(key: string, bytes: Buffer) {
    const abs = this.abs(key);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, bytes);
  }
  async remove(key: string) {
    const abs = this.abs(key);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  }
}

class S3Storage implements BlobStorage {
  readonly name = "s3" as const;
  private client: S3Client;
  private bucket: string;
  constructor() {
    const { blob } = getConfig();
    if (!blob.bucket || !blob.accessKeyId || !blob.secretAccessKey) throw new Error("S3 storage requires S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY");
    this.bucket = blob.bucket;
    this.client = new S3Client({ region: blob.region, endpoint: blob.endpoint || undefined, forcePathStyle: blob.forcePathStyle, credentials: { accessKeyId: blob.accessKeyId, secretAccessKey: blob.secretAccessKey } });
  }
  async stat(key: string) {
    try {
      const r = await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: safeKey(key) }));
      return { size: Number(r.ContentLength ?? 0), contentType: r.ContentType };
    } catch {
      return null;
    }
  }
  async exists(key: string) {
    return (await this.stat(key)) !== null;
  }
  async read(key: string) {
    const r = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: safeKey(key) }));
    return Buffer.from(await r.Body!.transformToByteArray());
  }
  async stream(key: string) {
    const r = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: safeKey(key) }));
    return r.Body as unknown as Readable;
  }
  async put(key: string, bytes: Buffer, contentType: string) {
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: safeKey(key), Body: bytes, ContentType: contentType }));
  }
  async remove(key: string) {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: safeKey(key) }));
  }
}

/**
 * Documents held as rows in the database.
 *
 * `stream` reads the row whole rather than streaming it: these are SOP
 * documents of a few megabytes, and the upload limit caps them well below
 * anything worth the complexity of a chunked read. If that stops being true,
 * that is the signal to move to a bucket rather than to make this cleverer.
 */
class PostgresBlobStorage implements BlobStorage {
  readonly name = "postgres" as const;
  private async db() {
    const { getDb, schema } = await import("@/server/db/client");
    return { db: getDb(), table: schema.documentBlobs };
  }
  async stat(key: string) {
    const { db, table } = await this.db();
    const { eq } = await import("drizzle-orm");
    const rows = await db.select({ size: table.size, contentType: table.contentType }).from(table).where(eq(table.key, safeKey(key))).limit(1);
    return rows[0] ? { size: rows[0].size, contentType: rows[0].contentType } : null;
  }
  async exists(key: string) {
    return (await this.stat(key)) !== null;
  }
  async read(key: string) {
    const { db, table } = await this.db();
    const { eq } = await import("drizzle-orm");
    const rows = await db.select({ bytes: table.bytes }).from(table).where(eq(table.key, safeKey(key))).limit(1);
    if (!rows[0]) throw new Error(`No such document: ${key}`);
    return Buffer.from(rows[0].bytes);
  }
  async stream(key: string) {
    return Readable.from(await this.read(key));
  }
  async put(key: string, bytes: Buffer, contentType: string) {
    const { db, table } = await this.db();
    const safe = safeKey(key);
    await db
      .insert(table)
      .values({ key: safe, bytes, contentType, size: bytes.byteLength, updatedAt: new Date() })
      .onConflictDoUpdate({ target: table.key, set: { bytes, contentType, size: bytes.byteLength, updatedAt: new Date() } });
  }
  async remove(key: string) {
    const { db, table } = await this.db();
    const { eq } = await import("drizzle-orm");
    await db.delete(table).where(eq(table.key, safeKey(key)));
  }
}

let instance: BlobStorage | null = null;
export function getBlobStorage(): BlobStorage {
  if (instance) return instance;
  const mode = getConfig().blob.mode;
  instance = mode === "s3" ? new S3Storage() : mode === "postgres" ? new PostgresBlobStorage() : new LocalStorage();
  return instance;
}
export function resetBlobStorageForTests() {
  instance = null;
}
