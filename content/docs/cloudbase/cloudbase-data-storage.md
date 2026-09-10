---
id: cloudbase-data-storage
title: CloudBase Data Storage — Database, Documents and Audit
summary: How CloudBase stores governed records, source documents and audit events, and how to move from the file registry to a managed PostgreSQL database.
owningTeam: ai-automation
teams: [rnd, technical-gis]
category: Architecture
domain: CloudBase
status: draft
version: "0.1"
tags: [architecture, database, postgres, storage, governance]
---
# CloudBase Data Storage

CloudBase has three kinds of persistent state, and each one has a storage seam so the deployment target can change without touching a single page, service or permission check.

| State | File mode (default) | Database mode |
| --- | --- | --- |
| Governed records (SOPs, CROS, teams, CRM, docs) | YAML/Markdown under `content/` | `governed_records` table |
| Extracted document text | `content/knowledge/imported/sop-content.json` | `imported_content` table |
| Uploaded source documents | `source-documents/` on disk | `source_files` + an S3-compatible bucket |
| Audit events | JSON lines under `var/audit/` | `audit_events` table |

Both modes implement the same `Repositories` interface. Nothing in the UI, and nothing in the authorization layer, knows which one is active.

## Which mode am I in?

Storage mode is decided in `src/server/config.ts` — the only file in the codebase that reads `process.env`:

- `CLOUDBASE_STORAGE=file` — the git-versioned registry. No infrastructure required.
- `CLOUDBASE_STORAGE=postgres` — PostgreSQL, via `DATABASE_URL`.
- Neither set: setting `DATABASE_URL` alone switches to `postgres`; otherwise `file`.

**Governance → Integrations** shows the active mode, the database host, and where documents and audit events are being written.

## Why the file registry is still the default

The registry is small — hundreds of records — and being able to review a change to a governed record as a pull request is a real governance property, not a limitation. A deployment with no database still gets the full platform: search, Ask CloudBase, CROS, dashboards, the graph and read-only integrations.

The database becomes worthwhile when you need any of these:

- more than one server instance, or a serverless deployment with no durable disk;
- write workflows (SOP upload, submit, review, approve) whose results must survive a redeploy;
- an audit trail that can be queried rather than grepped;
- a shared environment where several people author at the same time.

## Setting up a managed PostgreSQL database

Both **Neon** (neon.tech) and **Supabase** (supabase.com) offer a free PostgreSQL tier that is sufficient for CloudBase, including a connection string that works unchanged. Supabase additionally provides S3-compatible object storage on the same free plan, which is the simpler choice if you also want uploaded documents off local disk.

1. Create the project and copy the connection string (it must include `sslmode=require` or be a hostname that is not localhost — the client enables TLS automatically for remote hosts).
2. Put it in `.env.local` as `DATABASE_URL`. It is a secret: never commit it, never paste it into a chat or an issue.
3. Apply the schema and load the registry:

```bash
npm run db:migrate   # applies the forward-only migrations in /drizzle
npm run db:seed      # loads content/ into the database (idempotent)
CLOUDBASE_STORAGE=postgres npm run dev
```

`db:seed` upserts on `(type, id)`, so it can be re-run after any registry change. It never deletes records that exist only in the database — records created by the platform's own approval workflows are safe.

## Schema shape

Governed objects are stored as validated JSON documents with the columns needed for authorization, listing and search promoted alongside them:

```
governed_records(type, id, tenant_id, title, owning_team, classification,
                 status, search_text, data jsonb, version, updated_by, updated_at)
```

Every row's `data` has passed its Zod schema before it was written, and is validated again on read — a malformed row fails loudly instead of rendering as garbage. One table serves every entity type, which is what lets a new governed entity ship without a migration.

Reads use a short-lived in-memory snapshot of the whole registry (15 s TTL), refreshed by `ensureRepositories()` at the start of each request and invalidated immediately by any write. That keeps the synchronous repository interface — and therefore every existing page — unchanged.

## Document storage

Uploaded documents are never written into `/public` and never served from a predictable URL. They are stored through the blob seam:

- **local** — the filesystem under `source-documents/`, path-traversal guarded;
- **s3** — any S3-compatible bucket (AWS S3, Cloudflare R2, Supabase Storage, MinIO) via `S3_BUCKET` and the matching credentials.

Delivery always goes through `/api/files/{id}`, which resolves the file by its registry id, checks `files.read` plus read access to the owning SOP, and audits the access. `/api/files/{id}/drive` redirects to the document in Google Drive instead of downloading it, under the same check.

## Audit

Audit writes follow the storage mode automatically: JSON lines in file mode, the append-only `audit_events` table in database mode. Every privileged action — approvals, send-backs, submissions, uploads, file access, agent runs, denied requests — is recorded with actor, action, target, outcome and detail. Nothing in the audit path is optional or best-effort at the call site; a failing sink is logged, never swallowed silently into a successful-looking response.

## What does not change

- Authorization is still evaluated server-side on every request, default deny, explicit deny wins.
- AI still cannot approve, publish or promote anything. The write workflows are the only code that mutates governed state, and no AI path calls them.
- No mock corpus is seeded in either mode. Empty collections stay empty.
