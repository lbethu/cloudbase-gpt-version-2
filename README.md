# CloudBase AI

**Cloudpoint Knowledge & Intelligence Hub** — one internal platform to discover Cloudpoint knowledge, SOPs, R&D (CROS), capabilities, project references, AI copilots, automations and technical guidance, with source attribution, ownership, versions and governed human approval.

This is a production-oriented internal operating platform, not a marketing site or a chatbot. AI may search, summarize, connect, recommend and draft; it never approves SOPs, publishes policy, promotes R&D maturity or creates organizational truth.

## What is here

| Area | Route | Notes |
| --- | --- | --- |
| Home | `/` | Domains, recommendations, recent updates, active R&D, copilots, review attention |
| Universal search | `/search`, `⌘K` | Full-text search over every extracted SOP section/page (507 passages from 45 files) with highlighted matches and "matched in §section · page" locations |
| Dashboards | `/dashboards/{leadership,sales,gis,field,operations,ai}` | Role-based agentic dashboards: KPIs, agent insights, lifecycle/maturity/pipeline charts |
| Knowledge Graph | `/graph` | Force-directed explorer of every relationship (declared, proposed, ownership), permission-scoped |
| CRM | `/crm`, `/crm/accounts`, `/crm/contacts`, `/crm/opportunities` | Pipeline board (IQL→MQL→SQL→proposal→negotiation→won/lost), accounts, contacts; governed records + read-only Pipedrive connector |
| Agents | `/agents` | Deterministic platform agents (coverage, freshness, relationships, duplicates, pipeline hygiene) with audited runs |
| Integrations | `/governance/integrations` | Entra ID, GitHub, Pipedrive, AI provider, Drive, search, audit — status and how-to |
| Ask CloudBase | `/ask` | Governed answers: FACT / SUPPORTED_INFERENCE / ASSUMPTION / UNKNOWN with citations |
| Team Workspaces | `/teams` | Teams are registry data; knowledge is shared by relationship, never duplicated |
| SOP Library | `/sops` | Governed lifecycle (draft → review → approved → superseded → historical), versions, protected source files |
| Documentation | `/docs` | Markdown + frontmatter, highlighted code, copy buttons, TOC |
| Research | `/research` | Research library + 7 templates, CROS-linked |
| CROS | `/cros` | Read-only R&D operating system: projects, capabilities, clusters, ideas, evaluations, evidence, experiments, decisions, portfolio, CROS Copilot entry |
| Capabilities | `/capabilities` | Project vs. capability, maturity R0–R7, clusters |
| Project References | `/projects` | Reference library + Project Reference Assistant |
| RFP Intelligence | `/rfp` | Records + “How we build an RFP Evaluation Assistant” |
| Copilots | `/copilots` | Registry, Creation Center, Engineering Standard |
| Automations | `/automations` | Library, proposal intake, Engineering Standard |
| Governance | `/governance/*` | Review queue, admin center, audit history |

Legacy prototype (fictional review corpus) remains at `/legacy` and `/presentation` behind `CLOUDBASE_ENABLE_LEGACY_PROTOTYPE` (off in production).

## Architecture

```
src/app/(platform)        routes — server components, permission-aware
src/components            shell (sidebar, ⌘K palette), ui primitives, detail-page standard
src/domain                Zod schemas for every governed entity
src/server/auth           IdentityProvider seam (dev · Entra ID via authenticating proxy)
src/server/authz          default-deny, explicit-deny precedence, classification checks
src/server/repositories   interfaces + file registry implementation (PostgreSQL later)
src/server/services       search, ask, relationships, reviews, files, audit, markdown
src/server/search         SearchProvider — lexical today, hybrid/vector seam
src/server/ai             AiProvider — disabled by default; OpenAI / Azure OpenAI / Anthropic / Gemini adapters
content/registry          teams, roles, sops/*, cros/*, copilots, automations, relationships, synonyms
content/docs              governed documentation (markdown + frontmatter)
content/templates         research templates
content/knowledge         imported, source-backed SOP text
source-documents/         original SOP files — served ONLY via /api/files/{id} with authorization + audit
```

See `docs/cloudbase-implementation-plan.md` for the audit, decisions and phase plan, and `/docs/cloudbase-architecture` inside the app.

## Run

```bash
npm install
cp .env.example .env.local      # dev identity is enabled by default outside production
npm run dev                     # http://localhost:3000
```

Quality gates:

```bash
npm run typecheck
npm test
npm run build
npm run verify                  # all three
```

## Governance rules baked in

- **Default deny.** Every page, API route and file download is authorized server-side against `content/registry/roles.yaml`. Hidden links are not the control.
- **Permission-scoped retrieval.** Search, Ask CloudBase and related-content panels only ever see items the viewer may read.
- **No fabricated data.** No fake SOPs, employees, projects, clients or metrics. Empty states are designed. Imported SOPs enter as *in review*; nothing is approved until an approver records it.
- **CROS is authoritative.** CloudBase reads the CROS registry; maturity is never inferred. Relationships implied by naming are marked *proposed* until confirmed.
- **Audit.** File access, Ask queries (metadata only), denied authorizations and provider errors are appended to `var/audit/`.
- **Versioned knowledge.** SOP history is never overwritten; a new version supersedes the old one.

## Source documents → searchable text

`npm run extract:sources` extracts the full text of every file in `source-documents/` (DOCX headings/paragraphs via mammoth, PDF per page via pdf-parse) into `content/knowledge/imported/sop-content.json` and re-points the SOP registry. Run it whenever a source file changes. Search, Ask CloudBase and the SOP library all rank over these passages, so any keyword inside a document (e.g. "SQL" in the Sales Playbook) finds the SOP.

## Storage: file registry or PostgreSQL

CloudBase runs with **no database at all** by default — governed records live as YAML/Markdown under `content/`, which makes every change to organizational truth reviewable as a pull request. The same `Repositories` interface is also implemented over PostgreSQL, so a deployment that needs multi-instance hosting, durable write workflows or a queryable audit trail can switch without touching a page, service or permission check.

```bash
# Free managed Postgres: Neon (neon.tech) or Supabase (supabase.com)
export DATABASE_URL="postgres://…"     # secret — .env.local only, never committed
npm run db:migrate                     # forward-only migrations in /drizzle
npm run db:seed                        # loads content/ into the database (idempotent)
CLOUDBASE_STORAGE=postgres npm run dev
```

Governed objects are stored as Zod-validated JSON documents in one `governed_records` table with the authorization and listing columns promoted alongside, so a new entity type ships without a migration. Uploaded documents go to the local filesystem or any S3-compatible bucket (`S3_BUCKET` — AWS S3, Cloudflare R2, Supabase Storage, MinIO) and are only ever delivered through the authorized `/api/files/{id}` route. Audit events follow the same switch: JSONL in file mode, the `audit_events` table in database mode. Full detail: `content/docs/cloudbase/cloudbase-data-storage.md`.

Set `CLOUDBASE_TEST_DATABASE_URL` to a throwaway database to run the Postgres parity suite (`tests/unit/postgres-storage.test.ts`); without it that suite is skipped and the default test run needs no infrastructure.

## Adding knowledge

- Team: add to `content/registry/teams.yaml`.
- SOP: add `content/registry/sops/<id>.yaml` (or use *Create SOP draft* in the app to generate one).
- Documentation: add markdown with frontmatter under `content/docs/<domain>/`.
- Relationship: add a line to `content/registry/relationships.yaml`.
- Copilot / automation / project reference / research / RFP record: add to the matching registry folder.

Every file is validated on load; a malformed record fails with the file and field named.

## Integrations

- **GitHub** — link any record with `repositories: [{ owner, repo }]`; detail pages show repo stats and latest commit (read-only; `GITHUB_TOKEN` for private repos).
- **Pipedrive** — `PIPEDRIVE_API_TOKEN` + `PIPEDRIVE_COMPANY_DOMAIN` surface live deals/organizations/people read-only in the CRM workspace; governed records always win.

## Identity in production

Run behind an authenticating proxy (Azure App Service Easy Auth or equivalent) with `CLOUDBASE_AUTH_MODE=entra`. The proxy must strip inbound `x-ms-client-principal`. Map Entra groups/app roles to CloudBase roles and teams with `CLOUDBASE_ENTRA_GROUP_ROLE_MAP` / `CLOUDBASE_ENTRA_GROUP_TEAM_MAP`. The development identity provider is refused in production builds.

## Google Drive live search (optional)

Preserved from the prototype; requires `knowledge.read` and a service account — see `docs/google-drive-integration.md`.
