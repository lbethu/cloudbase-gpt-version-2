---
id: weekend-launch-runbook
title: Launch Runbook — Version 1 for the Admin Team
summary: Getting CloudBase in front of the admin team with real sign-in, the SOP finder and upload — with no directory administration in place, and with the parts that must not be skipped named explicitly.
owningTeam: ai-automation
teams: [operations-admin, leadership, ai-automation]
category: Runbook
domain: CloudBase
status: draft
version: "0.1"
tags: [launch, deployment, authentication, sop, admin]
---
# Launch Runbook — Version 1 for the Admin Team

**Scope of version 1.** The admin team signs in, types a keyword, and opens the SOP. They can upload new SOPs, which become searchable immediately and are approved through the existing workflow. Everything else in CloudBase is present but is not what this launch is for.

**What must be true before anyone else sees it.** Three things, and none of them is optional, because this holds 45 real Cloudpoint SOP documents:

1. Real sign-in. Not a shared link, not a password in a group chat.
2. Documents in the bucket, not on the server's disk.
3. A named list of who may be in. A person who signs in successfully but is not on the list gets nothing.

Everything below is how to get those three, in order.

## Step 1 — Who may sign in

Open `content/registry/people.yaml` and add the admin team, one block each:

```yaml
- email: firstname.lastname@cloudpointgeo.com
  name: Firstname Lastname
  roles: [contributor]        # add approver only for people who genuinely own SOP content
  teams: [operations-admin]
  active: true
```

This file is the access list. Anyone not on it is refused even after authenticating successfully — that is what scopes version 1 to the admin team rather than to whoever finds the URL. Every change is a reviewable diff, which is the property an Entra group would otherwise give you. `active: false` revokes access while keeping the record that the person had it.

Give `approver` sparingly. That permission is what makes a document official.

## Step 2 — Sign-in

Cloudpoint has no directory administration in place yet, so there are two honest paths and **both need exactly one administrative action**. Anyone who tells you otherwise is describing a shared password.

### Path A — Cloudflare Access (recommended)

Sits in front of the application and authenticates people before a request reaches it. Free for up to 50 users. People receive a one-time code at their work address — no identity provider needed at all — and Microsoft or Google sign-in can be added later without touching the app.

Requires: a domain in your Cloudflare account. You are already using Cloudflare R2 for documents, so the account exists; the domain has to be there too (or reachable through a Cloudflare Tunnel from wherever the app runs).

1. Cloudflare Zero Trust → Access → Applications → **Add a self-hosted application**, pointing at the app's hostname.
2. Policy: **Allow**, with the rule *Emails ending in* `@cloudpointgeo.com`. (The people register then narrows it further.)
3. Copy the **Application Audience (AUD) tag** and your team domain.
4. Set on the app:

```
CLOUDBASE_AUTH_MODE=access
CLOUDBASE_ACCESS_TEAM_DOMAIN=<your-team>.cloudflareaccess.com
CLOUDBASE_ACCESS_AUD=<the AUD tag>
```

CloudBase verifies the signed assertion Access sends — issuer, audience and signature against Cloudflare's key set. It never trusts the convenience email header on its own, because anything that can reach the origin can set a header; a signature cannot be forged that way.

**One thing to check and not assume:** the origin must not be reachable except through Access. If someone can hit the app's direct URL, they bypass the front door. Use a Cloudflare Tunnel, or restrict the origin to Cloudflare's addresses.

### Path B — Microsoft Entra via Azure App Service

Right if you host on Azure and someone can register an application in the Cloudpoint Microsoft 365 tenant — usually whoever set up Microsoft 365. Then people sign in with the account they already use, and roles can later come from Entra groups instead of the register.

Set `CLOUDBASE_AUTH_MODE=entra` and follow the deployment doc. The proxy must strip any inbound `x-ms-client-principal` header — that header *is* the identity.

### What not to do

A single shared password, or an unlisted URL. Both mean any leaked link is permanent access to every Cloudpoint SOP, with no record of who opened what. The audit trail is worth nothing if everyone is the same person.

## Hosting on Vercel

Vercel deploys this in minutes and is a reasonable choice, with three things that are specific to it and one that is a genuine blocker.

### The blocker: the `.vercel.app` URL

Every Vercel deployment keeps a public `*.vercel.app` address. Putting a custom domain behind Cloudflare Access does **not** close it — anyone with the deployment URL reaches the app directly and never meets the front door. Cloudflare Access in front of Vercel therefore only works if you also turn on Vercel's **Deployment Protection** to block direct access to the deployment URLs.

So on Vercel there are two workable shapes, and one that only looks safe:

| Approach | Verdict |
| --- | --- |
| Custom domain proxied through Cloudflare + Access + **Deployment Protection on** | Works. Check the `.vercel.app` URL yourself afterwards — it must refuse you. |
| Vercel's own **Password Protection** or **Vercel Authentication** (paid plans) | Works, and is the least configuration. Vercel Authentication only admits members of your Vercel team, so it suits a small admin group and not a wider rollout. |
| Cloudflare Access on the custom domain, Deployment Protection off | **Not safe.** The deployment URL is an unauthenticated way in, and it is the URL people paste to each other. |

Whichever you choose, CloudBase still refuses anyone who is not in `content/registry/people.yaml`. That is the second lock, not the first — do not rely on it alone, because it cannot log who tried.

### Uploads are capped at 4.5 MB

Vercel rejects a request body over 4.5 MB before any application code runs, so the app's own 25 MB limit is not what applies. Set:

```
CLOUDBASE_MAX_UPLOAD_MB=4
```

so the upload page states the real limit instead of failing at the platform boundary with an opaque error. Most SOPs are far smaller than this; scanned PDFs are the ones that will hit it. If you routinely need larger documents, the fix is a direct-to-bucket upload, which is a change worth making deliberately rather than on launch weekend.

### The filesystem is read-only

Both settings below are mandatory on Vercel, not optional tuning:

```
CLOUDBASE_STORAGE=postgres
CLOUDBASE_BLOB_STORAGE=s3
```

Without them the app would try to write governed records and documents to the server's disk, which on Vercel is read-only and disposable. CloudBase now refuses the upload in production with a message naming the missing setting, rather than failing deep inside a filesystem call — but the refusal is a safety net, not a substitute for setting them.

**Vercel plan note:** the Hobby plan is for non-commercial use. An internal company tool needs a paid plan; worth knowing before it becomes a surprise.

## Step 3 — Documents in the bucket

On a hosted server the filesystem is disposable: uploads vanish on the next deploy and every document link breaks. Create a private Cloudflare R2 bucket and a scoped token, then from the machine that has the documents:

```bash
CLOUDBASE_BLOB_STORAGE=s3 S3_BUCKET=cloudbase-documents \
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com S3_REGION=auto \
S3_ACCESS_KEY_ID=... S3_SECRET_ACCESS_KEY=... S3_FORCE_PATH_STYLE=true \
npm run blob:upload
```

`npm run blob:upload -- --check` verifies afterwards. Full detail in the data-storage doc.

## Step 4 — The database

Already provisioned on Neon. On the host:

```
CLOUDBASE_STORAGE=postgres
DATABASE_URL=postgresql://...
```

Run `npm run db:migrate` and `npm run db:seed` once against it. After this, `content/` is no longer what the app serves — a registry edit needs `db:seed` to take effect. The people register is the exception: it is read from the file on every request, deliberately, so access control does not depend on a database being reachable.

## Step 5 — Check it as a normal user, not as yourself

Do these in a private window. Each catches a different failure that is invisible from an admin account:

- Signed out: every page shows the sign-in wall. No SOP titles, no summaries.
- Signed in as someone **not** in the register: still refused. If they get in, the register is not being consulted.
- Signed in as an admin-team member: `/find` → type *expenses* → the right SOP → **Open document** opens the Word file.
- Upload a test SOP, then **redeploy the app and open that document again.** If it still opens, storage is right. If it 404s, documents are still on the disposable filesystem.
- Delete the test SOP, and confirm Governance → Audit recorded the upload, the open and the deletion.

## After the weekend

Version 1 is deliberately small. The next things in order:

1. **Register the agents that already exist** — the ones built in ChatGPT, Copilot Studio, n8n and Claude — each with its owner, data boundary, link and test cases. Until an agent is in the registry with a boundary recorded, nobody can tell which company information may be given to it.
2. **SOL-004, the intelligence radar** for the admin team. Most of it exists already: the deterministic agents produce the findings, and the Agents console shows them. What it needs is an owner and a decision about what belongs on one standing report.
3. **SOL-001, SOP generation.** Worth doing after a few weeks of real uploads, because the generator's quality depends on what the approved library looks like.

Each needs a delivery owner and an agreed success measure before building starts. That is the whole point of recording them at intake rather than starting with the interesting half.
