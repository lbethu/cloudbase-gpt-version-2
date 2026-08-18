# CloudBase AI

CloudBase AI is an enterprise-style prototype for an internal company intelligence, knowledge guidance, and future workflow automation platform.

The approval-facing library contains 45 real documents across 10 source groups, 7 team AI dashboards, and 10 planned guidance modules. Mock records must be replaced by authoritative, access-controlled sources before production use.

## Why this prototype exists

The prototype validates the user experience and knowledge architecture before sensitive documents are introduced. It gives reviewers a concrete way to assess:

- Source-backed answer structure
- SOP and category navigation
- Document metadata and ownership
- Content upload and review workflow
- Mock retrieval quality
- The path to governed real-data integration

## Version 1 scope

- Executive dashboard with prototype health metrics
- Ask Knowledge Base experience with confidence, sources, matching sections, and next steps
- Local TypeScript retrieval engine with weighted lexical scoring
- SOP Navigator across a future-ready category taxonomy
- Filterable document library
- Front-end upload and processing simulation
- Source viewer with metadata, sections, chunks, and replacement notes
- Five-phase real-data integration plan
- 45 realistic mock documents and 109 indexed chunks
- Ten source groups and seven team AI dashboards
- Ten planned AI guidance and workflow modules
- Five-layer CloudBase AI architecture
- Knowledge source map and document coverage matrix
- Reviewer Mode with approval decisions and real-data requirements
- Responsive enterprise interface

## Mock source groups

- COM Site
- SOP Library
- Sales Playbook
- PM/PL Documents
- Field Team Resources
- Tech Team Resources
- RFP / Proposal Knowledge
- Training / Onboarding
- Project Templates
- Delivery Standards

All mock guidance is fictional and exists only to validate the product workflow and knowledge architecture.

## Review-data boundary

No supplied or confidential company document participates in this review build. Search, navigation, the document library, and the source viewer use the fictional CloudBase AI corpus only.

## Tech stack

- Next.js 15 App Router
- React 19
- TypeScript
- Custom responsive design system
- Lucide icons
- Local typed data and retrieval for the mock foundation and imported SOP navigator
- Optional live Google Drive search (server-side only, via a service account — see below). No other external API, model, database, or paid service is used.

## Google Drive live search (optional)

A separate "Google Drive search" tab searches a real, access-limited Google
Drive folder directly and returns the matching document plus a link to it
and to its containing folder — this is additive and does not change the
existing mock/SOP experience described above. It requires a one-time Google
Cloud service-account setup. See
[docs/google-drive-integration.md](docs/google-drive-integration.md) for the
full walkthrough, and copy `.env.example` to `.env.local` to configure it.
Until configured, the tab clearly states it isn't connected yet rather than
failing silently.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Executive presentation

After starting the application, open:

```text
http://localhost:3000/presentation
```

The Executive Product Walkthrough is a presentation-friendly, 5–7 minute narrative covering:

- The product problem and solution
- Knowledge source architecture
- Why the prototype uses mock company-style data
- Current source-group coverage
- Team-based dashboards
- Source-backed Q&A retrieval
- Future document ingestion
- Reviewer approval decisions
- The real-data integration roadmap

Use [docs/executive-walkthrough.md](docs/executive-walkthrough.md) as the presenter guide and [docs/demo-script.md](docs/demo-script.md) as the spoken script.

The walkthrough is print-friendly and clearly labels all approval-facing content as mock prototype data. It must not be represented as approved company policy or a production data integration.

Create a production build with:

```bash
npm run build
npm start
```

## Folder structure

```text
cloudpoint-knowledge-base-gpt/
├── docs/
│   ├── Review-notes.md
│   ├── knowledge-architecture.md
│   ├── mock-data-plan.md
│   ├── project-overview.md
│   └── real-data-integration-plan.md
├── public/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── KnowledgeApp.tsx
│   ├── data/
│   │   └── documents.ts
│   ├── lib/
│   │   └── retrieval.ts
│   └── types/
│       └── knowledge.ts
├── package.json
└── README.md
```

## Knowledge and retrieval architecture

Documents are represented as typed records with company, source-kind, SOP, governance, section, and retrieval metadata. The local engine normalizes a question and scores authorized chunks using:

- Content keyword overlap
- Explicit chunk keywords
- Section-heading matches
- Document-title matches
- Category and tag matches
- Exact phrase bonuses

The top results produce a concise answer, a confidence label, source cards, and a recommended next action. `src/lib/retrieval.ts` is the seam for a future hybrid vector-search and approved model-synthesis implementation.

## Real-data integration plan

1. Approve the prototype workflow and taxonomy.
2. Inventory and ingest approved SOPs.
3. Map COM site, sales, PM/PL, and operational collections.
4. Add identity-aware permissions and content review.
5. Deploy hybrid retrieval, grounded synthesis, evaluation, monitoring, and secure hosting.

See [docs/real-data-integration-plan.md](docs/real-data-integration-plan.md) for the detailed plan.

## Future roadmap

- Approved document connectors and extraction pipeline
- Hybrid vector and keyword retrieval
- SSO and role-based access controls
- Content-owner approval and freshness workflows
- Answer feedback and retrieval evaluation
- Audit logs and source-access analytics
- Approved enterprise language-model integration

## Notes for reviewer

The key approval decision is whether the experience, answer structure, source groups, team dashboards, metadata, and source-review flow are appropriate before authoritative company collections are mapped.

The strongest reviewer path is: dashboard → ask a sample question → open a cited source → inspect upload staging → review the integration plan.
