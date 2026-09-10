# CloudBase AI — Audit & Implementation Plan

Status: living document. Owner: platform engineering. Last updated: 2026-09-10.

## 1. Phase 0 audit — what exists today

| Area | Finding |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript `strict`, no Tailwind, custom CSS in `globals.css` + a few CSS modules. |
| Routes | `/` (single client component `KnowledgeApp.tsx`, 695 lines, 13 tab "views" in local state — no deep links), `/presentation` (executive walkthrough), `/api/drive/search` (server-side Google Drive search, service account, optional). |
| Data | `src/data/rich-mock.ts` — 40 **fictional** documents. `src/data/sop-knowledge-base.ts` — 45 records + 142 chunks **extracted from real Cloudpoint SOP files** (41 DOCX SOPs, 4 PDFs). Both were merged into one live index (`knowledge-index.ts`). `documents.ts` and `real-sops.ts` are unused dead code. |
| Retrieval | `src/lib/retrieval.ts` — deterministic lexical scorer with concept expansion, confidence labels, related documents. Good foundation; tightly coupled to the global index import. |
| Governance | None implemented. No SOP lifecycle, versions, review, approval, ownership model beyond an `ownerRole` string. |
| CROS | Does not exist in this repository or anywhere else on the workstation (confirmed with owner). |
| Identity / authz | None. No server-side authorization anywhere. |
| Storage | Real SOP `.docx`/`.pdf` files are duplicated into `public/source-documents/` and served at predictable public URLs. **Security issue.** |
| Database | None. No Drizzle, no migrations. |
| Tests | None. |
| Build | `tsc --noEmit` passes on baseline. |

### Reusable foundations (keep)
- Next.js App Router + strict TypeScript.
- Lexical retrieval scorer and its query-expansion concepts (`retrieval.ts`) → becomes the Phase‑1 `LexicalSearchProvider`.
- Extracted SOP chunks (45 docs / 142 chunks) → become the imported SOP corpus, loaded through the service layer.
- Google Drive search route and `googleDrive.ts` (server-only, credential-safe) → preserved as an integration.
- Executive walkthrough (`/presentation`) → preserved behind a feature flag as a labeled prototype artifact.

### Conflicts with the target architecture
1. Fictional corpus mixed into the live index → **removed from the production index**; kept only as dev/test fixtures.
2. Confidential source files served from `/public` → **moved behind a permission-checked file route**; public copies removed.
3. Single-component tab UI → **replaced by real routes** (deep-linkable, server-rendered) while its unique views remain reachable at `/legacy` behind a flag.
4. No identity/authorization → **server-side default-deny authz** with an identity seam prepared for Microsoft Entra ID.
5. No governed entities (teams, SOP lifecycle, CROS, copilots, automations, relationships) → **domain model + registry** added.

## 2. Decisions recorded with the product owner (2026-09-10)
- CROS is built **inside this repo** as a governed subsystem behind a read-only `CrosRegistry` adapter, so an external CROS backend can replace it later without UI changes.
- Persistence for the first release is a **git-versioned registry** (`content/registry/**/*.yaml`, `content/docs/**/*.md`) loaded server-side through repository interfaces with Zod validation. PostgreSQL/Drizzle can be introduced behind the same interfaces (see §6).
- The fictional corpus is removed from the live index.
- Source files are protected.

## 3. Target architecture (this repository)

```
src/
  app/                      routes (server components by default)
  components/shell           sidebar, topbar, command palette
  components/ui              badges, cards, empty states, detail layout, code blocks
  components/domain          per-domain cards/lists
  domain/                    Zod schemas + TS types for every governed entity
  server/
    auth/                    IdentityProvider seam (dev provider, Entra placeholder)
    authz/                   permission catalog, roles, default-deny authorize()
    repositories/            interfaces + FileRegistryRepository implementations
    services/                knowledge, search, ask, cros, relationships, audit, files
    ai/                      AiProvider interface + adapters (disabled by default)
    search/                  SearchProvider interface; lexical provider; semantic seam
content/
  registry/                  teams, sops, copilots, automations, cros/*, relationships…
  docs/                      governed technical documentation (markdown + frontmatter)
  knowledge/imported/        extracted SOP chunks (generated, source-backed)
source-documents/            original SOP files (never served from /public)
```

Key rules:
- All reads go through `src/server/services/*`; UI never imports registry files directly.
- Every list/detail page filters through `authorize()`; search and Ask only see permitted items.
- Relationships live in one extensible `relationships` collection (`from`, `to`, `type`, `confidence: declared|proposed`).
- No entity is marked approved/operational unless the registry says so; imported SOPs enter as `review` ("imported — pending owner verification").
- AI is optional: with no provider configured, Ask CloudBase runs in governed retrieval mode and labels every statement FACT (chunk‑backed) or UNKNOWN.

## 4. Phases

| Phase | Scope | Gate |
| --- | --- | --- |
| 1 Shell | design tokens (light/dark), sidebar/topbar, command palette, home, search shell, detail-page standard, empty states | typecheck, build |
| 2 Knowledge | teams, SOP library + versions + protected files, documentation center (markdown, highlighted code, copy), research library + templates | tests: permissions, search, versions |
| 3 Intelligence | CROS overview/projects/capabilities/clusters/evaluations/evidence/decisions/portfolio, capability library, project references, RFP intelligence | relationship integrity test |
| 4 AI | copilot registry + creation center + engineering standard, automation library + proposal + standard, Ask CloudBase (governed) | ask abstention tests |
| 5 Governance | reviews queue, admin (teams/roles/permissions/integrations), audit log, permission-aware UX | unauthorized-access tests |

## 5. Quality gates
`npm run typecheck`, `npm test`, `npm run build` must pass; no fictional records in the live index; all relationship targets resolve (tested); no source document reachable without authorization (tested).

## 6. Path to PostgreSQL
Repository interfaces (`SopRepository`, `CrosRegistry`, `RelationshipRepository`, …) are the only consumers of the file registry. A Drizzle implementation would map 1:1 to the Zod schemas in `src/domain`, import the YAML via a one-time seed command, and be selected by `CLOUDBASE_STORAGE=postgres`. Forward-only migrations, UUID ids alongside the human-readable business ids (`CP-RND-001`, `CAP-004`).

## 7. Delivered in this iteration (2026-09-10)

Phases 1–5 first coherent version, all read-only against the governed registry:

- Shell: sidebar with collapsible sections, ⌘K command palette (search + commands), light/dark tokens, responsive to 400px.
- Domain model (Zod) and file registry with load-time validation; importer converted the 45 extracted SOP records into 43 governed SOP entries (duplicate files became versions), all `review` / no effective version.
- Server-side authz (default deny, explicit deny precedence, classification), identity seam (dev · Entra via proxy), audit log, protected file route.
- Search provider (lexical + synonym registry; hybrid seam), permission-scoped index; Ask CloudBase with FACT/SUPPORTED_INFERENCE/ASSUMPTION/UNKNOWN, citations, AI adapters disabled by default.
- Pages: home, search, ask, teams, SOPs (+versions, files, copilot CTA, draft generator), docs (markdown, highlighting, copy, TOC), research (+7 templates), CROS (overview, projects, ideas, evaluations, evidence, experiments, decisions, portfolio, copilot entry), capabilities/clusters, project references (+assistant page), RFP intelligence, copilots (+creation center), automations (+proposal), governance (reviews, admin, audit).
- Documentation authored (status draft): Copilot Engineering Standard, How to Create a Cloudpoint Copilot, Automation Engineering Standard, RFP Evaluation Assistant pattern, CROS Maturity Model, CloudBase Architecture, Ask governance.
- Tests: 44 (authz, registry integrity, search scoping, relationships, reviews, ask governance, schemas, route handlers incl. 401/403/404 and path safety).

### Known gaps / next
- Write workflows (SOP approval, idea submission, automation approval) are draft generators; server-side mutation with audit is the next phase behind `sop.approve` / `rnd.submit` / `automation.manage`.
- CROS records carry only the fields supplied by the owner; maturity, problem statements and evidence remain to be entered through CROS.
- Hybrid/vector search and AI provider are seams, not enabled.
- PostgreSQL implementation of the repository interfaces (§6).
- Entra group→role mapping needs the tenant's group ids.
