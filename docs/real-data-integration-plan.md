# Real Data Integration Plan

## Phase 1: Mock prototype approval

Validate navigation, taxonomy, answer format, upload states, source transparency, and reviewer expectations. Capture decisions about the initial audience and highest-value collections.

## Phase 2: Real SOP ingestion

Inventory approved SOPs and identify authoritative versions, owners, classifications, effective dates, and review dates. Parse content in an isolated pipeline, propose sections and chunks, and require owner approval before indexing.

## Phase 3: COM site, sales, and PM/PL mapping

Map source systems and collections. Normalize document types, categories, tags, owners, business units, and lifecycle states. Define sync behavior for changed or retired records.

## Phase 4: Access control and review workflow

Integrate company identity and group membership. Enforce source permissions during retrieval. Add content-owner review, employee feedback, freshness alerts, audit records, and removal workflows.

## Phase 5: Production-ready deployment

Deploy hybrid keyword/vector search and an approved model for grounded synthesis. Add reranking, citation checks, abstention, prompt-injection defenses, monitoring, evaluation datasets, backups, incident procedures, and secure hosting.

## Recommended production gates

- Security and privacy review
- Source-owner approval
- Access-control test coverage
- Retrieval-quality evaluation
- Citation and faithfulness thresholds
- Operational ownership and support model
- Pilot sign-off before broader release

## Migration strategy

Keep the front-end document and search-result contracts stable. Replace the local data import with a governed API, then replace the local scorer with the retrieval service. This limits migration risk and lets the approved user experience carry forward.
