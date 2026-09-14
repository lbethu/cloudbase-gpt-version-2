import "server-only";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { and, eq, lt } from "drizzle-orm";
import { getConfig } from "@/server/config";
import { findPerson } from "./people";
import { sendMail } from "./mailer";

/**
 * Sign-in by one-time code.
 *
 * CloudBase has no passwords and no user database of its own: the people
 * register says who may be here, and a code sent to that address proves the
 * person reading it is them. That is enough for an internal tool, and it is
 * considerably better than a shared password — every sign-in is attributable,
 * and removing someone is one line in a reviewed file.
 *
 * Properties that matter, and why:
 *  - Codes are stored **hashed**. A leaked database row must not be a way in.
 *  - Comparison is constant-time, so the check cannot be probed character by
 *    character.
 *  - Five attempts, then the code dies. Six digits is 1-in-a-million per
 *    guess; unlimited guesses would make that meaningless.
 *  - Ten minutes to use it.
 *  - Requesting a code for an unknown address returns the same answer as a
 *    known one. Otherwise this page becomes a way to discover who works here.
 */

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

const hashCode = (email: string, code: string) => createHash("sha256").update(`${email}:${code}:${getConfig().auth.sessionSecret}`).digest("hex");

interface CodeRecord {
  email: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

/**
 * Development storage only. A serverless deployment runs many instances, so a
 * code issued by one would be invisible to the next — which is why postgres
 * storage is required for this sign-in mode in production.
 */
const memory = new Map<string, CodeRecord>();

async function putCode(record: CodeRecord): Promise<void> {
  if (getConfig().storage.mode !== "postgres") {
    memory.set(record.email, record);
    return;
  }
  const { getDb, schema } = await import("@/server/db/client");
  const db = getDb();
  await db
    .insert(schema.signInCodes)
    .values({ email: record.email, codeHash: record.codeHash, expiresAt: new Date(record.expiresAt), attempts: 0, createdAt: new Date(record.createdAt) })
    .onConflictDoUpdate({ target: schema.signInCodes.email, set: { codeHash: record.codeHash, expiresAt: new Date(record.expiresAt), attempts: 0, createdAt: new Date(record.createdAt) } });
}

async function getCode(email: string): Promise<CodeRecord | null> {
  if (getConfig().storage.mode !== "postgres") return memory.get(email) ?? null;
  const { getDb, schema } = await import("@/server/db/client");
  const rows = await getDb().select().from(schema.signInCodes).where(eq(schema.signInCodes.email, email)).limit(1);
  const row = rows[0];
  return row ? { email: row.email, codeHash: row.codeHash, expiresAt: row.expiresAt.getTime(), attempts: row.attempts, createdAt: row.createdAt.getTime() } : null;
}

async function bumpAttempts(email: string, attempts: number): Promise<void> {
  if (getConfig().storage.mode !== "postgres") {
    const record = memory.get(email);
    if (record) record.attempts = attempts;
    return;
  }
  const { getDb, schema } = await import("@/server/db/client");
  await getDb().update(schema.signInCodes).set({ attempts }).where(eq(schema.signInCodes.email, email));
}

async function clearCode(email: string): Promise<void> {
  if (getConfig().storage.mode !== "postgres") {
    memory.delete(email);
    return;
  }
  const { getDb, schema } = await import("@/server/db/client");
  const db = getDb();
  await db.delete(schema.signInCodes).where(eq(schema.signInCodes.email, email));
  // Opportunistic cleanup so expired codes do not accumulate.
  await db.delete(schema.signInCodes).where(and(lt(schema.signInCodes.expiresAt, new Date()), eq(schema.signInCodes.attempts, schema.signInCodes.attempts)));
}

export type RequestResult = { ok: true; cooldown?: false } | { ok: false; error: string; retryAfterSeconds?: number };

/** Issues a code. The answer is the same whether or not the address is known. */
export async function requestSignInCode(rawEmail: string): Promise<RequestResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Enter a valid email address." };

  const person = findPerson(email);
  if (!person || !person.active) {
    // Deliberately indistinguishable from success: this page must not reveal
    // who has access. A short pause keeps the timing similar too.
    await new Promise((r) => setTimeout(r, 400));
    return { ok: true };
  }

  const existing = await getCode(email);
  if (existing && Date.now() - existing.createdAt < RESEND_COOLDOWN_MS) {
    return { ok: false, error: "A code was just sent. Check your inbox, or wait a minute to request another.", retryAfterSeconds: Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - existing.createdAt)) / 1000) };
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await putCode({ email, codeHash: hashCode(email, code), expiresAt: Date.now() + CODE_TTL_MS, attempts: 0, createdAt: Date.now() });

  const sent = await sendMail({
    to: email,
    subject: `${code} is your CloudBase sign-in code`,
    text: `Your CloudBase sign-in code is ${code}\n\nIt expires in 10 minutes and can be used once.\n\nIf you did not ask to sign in, you can ignore this message — but tell the AI & Automation team, because it means someone else entered your address.\n\nCloudBase AI · Cloudpoint Geospatial`,
  });
  if (!sent.ok) {
    await clearCode(email);
    return { ok: false, error: sent.error };
  }
  return { ok: true };
}

export type VerifyResult = { ok: true; email: string } | { ok: false; error: string };

export async function verifySignInCode(rawEmail: string, rawCode: string): Promise<VerifyResult> {
  const email = rawEmail.trim().toLowerCase();
  const code = rawCode.replace(/\D/g, "");
  const record = await getCode(email);
  const generic = "That code is not valid. Request a new one.";

  if (!record || record.expiresAt < Date.now()) return { ok: false, error: "That code has expired. Request a new one." };
  if (record.attempts >= MAX_ATTEMPTS) {
    await clearCode(email);
    return { ok: false, error: "Too many attempts. Request a new code." };
  }
  if (code.length !== 6) {
    await bumpAttempts(email, record.attempts + 1);
    return { ok: false, error: generic };
  }

  const expected = Buffer.from(record.codeHash, "hex");
  const actual = Buffer.from(hashCode(email, code), "hex");
  const matches = expected.length === actual.length && timingSafeEqual(expected, actual);
  if (!matches) {
    await bumpAttempts(email, record.attempts + 1);
    return { ok: false, error: generic };
  }

  const person = findPerson(email);
  if (!person || !person.active) {
    await clearCode(email);
    return { ok: false, error: generic };
  }
  await clearCode(email); // single use
  return { ok: true, email };
}
