---
id: cloudbase-deployment
title: Deploying CloudBase for the Team
summary: The production checklist — Azure App Service, Microsoft Entra sign-in, Neon PostgreSQL and a Cloudflare R2 document bucket — and what must be true before anyone outside the platform team logs in.
owningTeam: ai-automation
teams: [rnd, technical-gis]
category: Runbook
domain: CloudBase
status: draft
version: "0.1"
tags: [deployment, hosting, azure, entra, r2, neon, security]
---
# Deploying CloudBase for the Team

CloudBase holds real Cloudpoint SOPs and a governed approval workflow. Going from "runs on my laptop" to "the team uses it" is therefore not only a hosting task: the platform has to know who each person is before it shows them anything, and the documents and records have to live somewhere that survives a redeploy.

Target architecture:

| Concern | Production |
| --- | --- |
| Application | Azure App Service (Linux, Node 22) |
| Sign-in | Microsoft Entra ID via App Service Easy Auth |
| Governed records, extracted text, audit | Neon PostgreSQL (`CLOUDBASE_STORAGE=postgres`) |
| SOP documents (.docx/.pdf) | Cloudflare R2, S3-compatible (`CLOUDBASE_BLOB_STORAGE=s3`) |
| Secrets | App Service application settings — never in the repository |

## Before you start

- The repository must be **private**. `source-documents/` contains 45 real Cloudpoint SOP documents.
- Have an Azure subscription with permission to create an App Service and register an Entra application.
- Have the Neon project already migrated and seeded (see the data-storage doc).

## 1. The document bucket (Cloudflare R2)

A hosted App Service filesystem is disposable: anything written to `source-documents/` disappears on the next deploy. Documents therefore go to a bucket.

1. Create an R2 bucket, e.g. `cloudbase-documents`. Leave it **private** — CloudBase never serves objects directly; every read goes through `/api/files/{id}` after an authorization check.
2. Create an API token scoped to that bucket (Object Read & Write). Note the account ID, access key and secret.
3. Configure and upload the existing documents from a machine that has them:

```bash
CLOUDBASE_BLOB_STORAGE=s3 \
S3_BUCKET=cloudbase-documents \
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com \
S3_REGION=auto \
S3_ACCESS_KEY_ID=... S3_SECRET_ACCESS_KEY=... S3_FORCE_PATH_STYLE=true \
npm run blob:upload
```

Keys mirror the paths already recorded in the registry, so no SOP record has to be rewritten — the same `sourceFile.path` resolves in either mode. Re-running skips what is already there; `-- --check` verifies without writing and lists anything missing.

## 2. Sign-in (Microsoft Entra ID)

The development identity provider is refused in production builds — a production deployment without a configured provider renders the sign-in boundary to everyone and shows no content at all. That is deliberate.

1. In the App Service, enable **Authentication** with Microsoft as the identity provider, restricted to the Cloudpoint tenant, and set unauthenticated requests to be redirected to log in. Easy Auth then injects the `x-ms-client-principal` header that CloudBase reads.
2. Set `CLOUDBASE_AUTH_MODE=entra`.
3. **The proxy must strip any inbound `x-ms-client-principal` header.** Easy Auth does this; if you ever put another proxy in front, verify it, because that header is the identity.
4. Map Entra groups to CloudBase roles and teams. Create groups (for example `cloudbase-approvers`, `cloudbase-reviewers`, `cloudbase-contributors`), then set:

```
CLOUDBASE_ENTRA_GROUP_ROLE_MAP={"<group-object-id>":"approver","<group-object-id>":"reviewer"}
CLOUDBASE_ENTRA_GROUP_TEAM_MAP={"<group-object-id>":"technical-gis"}
```

Everyone signed in gets the base `employee` role. Uploading needs `contributor` (`sop.author`), sending back needs `reviewer` (`sop.review`), approving needs `approver` (`sop.approve`). Grant approver to the people who actually own SOP content — that permission is what makes a document official.

## 3. The application

Application settings (App Service → Configuration):

```
NODE_ENV=production
CLOUDBASE_AUTH_MODE=entra
CLOUDBASE_TENANT_ID=cloudpoint
CLOUDBASE_ENTRA_GROUP_ROLE_MAP={...}
CLOUDBASE_ENTRA_GROUP_TEAM_MAP={...}
CLOUDBASE_STORAGE=postgres
DATABASE_URL=postgresql://...
CLOUDBASE_BLOB_STORAGE=s3
S3_BUCKET=cloudbase-documents
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_FORCE_PATH_STYLE=true
CLOUDBASE_ENABLE_LEGACY_PROTOTYPE=false
CLOUDBASE_DEVELOPER_CREDIT=Lokendra_bethu
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

Startup command: `npm start`. Next.js binds to the `PORT` App Service provides.

Deploy from the private GitHub repository (Deployment Center → GitHub Actions). The build runs `npm ci && npm run build`; the gates that must pass first are `npm run typecheck`, `npm test` and `npm run build`.

## 4. Verify before announcing it

Work through this list as a normal user, not as an admin:

- Signed out (or in a private window), every page shows the sign-in boundary — no SOP titles, no summaries, nothing.
- Signed in as someone with no extra groups: the SOP library lists documents, search finds text inside them, and the upload page refuses (`sop.author` required).
- Signed in as a contributor: upload a test .docx, confirm it appears as a draft, and confirm the document opens from the SOP page.
- Redeploy the app, then open that same test document again. If it still opens, the bucket is doing its job. **This is the check that catches a filesystem-backed deployment.**
- Signed in as an approver: submit → approve the test SOP, then confirm Governance → Audit records the approval with the right actor.
- Governance → Integrations shows Database *connected* with the Neon host, and Document storage *connected* with the bucket.
- Delete the test SOP's record before announcing, so the library starts clean.

## 5. Day-2

- **Backups.** Neon keeps point-in-time restore on its own schedule; confirm the retention window is acceptable, because the database is now the system of record for approvals and audit.
- **Key rotation.** R2 keys and the Neon password live only in App Service settings. Rotate them if they are ever exposed — including by being pasted into a chat or an issue.
- **Registry changes.** With `CLOUDBASE_STORAGE=postgres`, `content/` is no longer what the app serves. Editing a YAML file and deploying changes nothing until `npm run db:seed` runs against the database; the seed upserts and never deletes records created through the app's workflows.
- **Scaling.** Reads use a 15-second in-memory snapshot per instance, so a record approved on one instance is visible on another within that window.

## What does not change in production

Default deny, server-side authorization on every request, documents never public and never at a predictable URL, no mock corpus, and no AI path that can approve, publish or promote. Human authority stays final: an SOP becomes official only when a person holding `sop.approve` records the approval.
