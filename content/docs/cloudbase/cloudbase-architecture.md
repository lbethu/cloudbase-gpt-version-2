---
id: cloudbase-architecture
title: CloudBase AI Platform Architecture
summary: How CloudBase AI is built — domain model, registry, authorization, search and AI seams, and the path to PostgreSQL and Entra ID.
owningTeam: ai-automation
category: Architecture
domain: CloudBase
status: draft
version: "2.0"
tags: [cloudbase, architecture]
---
# CloudBase AI Platform Architecture

CloudBase AI is the internal intelligence layer over Cloudpoint's organizational knowledge. CROS remains authoritative for R&D; CloudBase reads it.

## Layers
```
UI (Next.js App Router, server components)
  └─ services (search, ask, relationships, reviews, files, audit)
       ├─ authz (default-deny, explicit deny precedence, classification)
       ├─ repositories (interfaces) ── file registry today · PostgreSQL later
       ├─ search provider (lexical today · hybrid/vector seam)
       └─ AI provider adapters (disabled by default · OpenAI / Azure OpenAI / Anthropic / Gemini)
```

## Domain model
Zod schemas in `src/domain` define every governed entity: teams, SOPs and versions, CROS (R&D projects, capabilities, clusters, ideas, evaluations, evidence, experiments, decisions), copilots, automations, project references, research, RFP records, technical documents, relationships, roles, audit events and review tasks.

## Registry
Git-versioned YAML/markdown under `content/`. Every file is validated at load; invalid records fail loudly. Adding a team, copilot or relationship is a data change, not a code change.

## Authorization
`resource.action` permissions (e.g. `sop.approve`) mapped from roles in `content/registry/roles.yaml`. `decide()` denies without identity, applies explicit denies first, then grants. `decideResource()` adds classification: `internal` (any employee), `confidential` (team membership or explicit grant), `restricted` (explicit grant only). Search, Ask and related panels only ever see permitted items.

## Identity
`IdentityProvider` seam. Development provider (never in production). Entra provider reads the authenticated principal injected by a trusted proxy (App Service Easy Auth) and maps groups/app roles to CloudBase roles and teams.

## Files
Source documents are never served from `/public`. `/api/files/{id}` resolves a registry-declared file id, enforces `files.read` and the owner's classification, guards path traversal and audits every access.

## Search
`SearchProvider` interface. `LexicalSearchProvider` ranks title, tags, metadata, summary and body with synonym expansion from `content/registry/search-synonyms.yaml`. `HybridSearchProvider` is the seam for embeddings, a vector store and reranking.

## Ask CloudBase governance
Statements are typed FACT / SUPPORTED_INFERENCE / ASSUMPTION / UNKNOWN. With AI disabled, answers are extracted verbatim from cited passages. With a provider configured, the model receives only permitted passages and must return JSON that is validated against them; uncited FACTs are downgraded and invalid responses fall back to governed retrieval.

## Audit
Append-only JSON lines (`var/audit/`) for file access, Ask queries, denied authorizations and provider errors. A database sink replaces the writer without touching callers.

## Path to PostgreSQL
Implement the repository interfaces with Drizzle, seed from the YAML, select with `CLOUDBASE_STORAGE=postgres`. Business ids stay; UUIDs are added.
