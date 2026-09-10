---
id: cros-maturity-model
title: CROS Maturity Model (R0–R7)
summary: How Cloudpoint R&D moves from idea to operational capability, and what evidence each promotion requires.
owningTeam: rnd
teams: [leadership]
category: Reference
domain: CROS
status: draft
version: "0.1"
tags: [cros, maturity, r&d]
---
# CROS Maturity Model

CROS — the Cloudpoint Research Operating System — answers one question: *given this idea, problem, technology, client need or market signal, what should Cloudpoint do about it?*

| Level | Name | Entry evidence | Typical artefacts |
| --- | --- | --- | --- |
| R0 | Idea | Captured with source and problem statement | Idea record |
| R1 | Research | Internal reuse check done; research proposal accepted | Research proposal, existing-knowledge review |
| R2 | Feasibility | Technical + business feasibility assessed with an evaluation | Technical spike, tool comparison, evaluation |
| R3 | Prototype | Working prototype exists | Experiment plan, prototype repo/link |
| R4 | Validated Prototype | Approved evidence meets success criteria | Evidence records (approved), research findings |
| R5 | Pilot | Used on a real project/client under controlled conditions | Pilot evidence, client feedback |
| R6 | Production Candidate | Hardened, documented, owner assigned | SOP draft, documentation, security review |
| R7 | Operational Capability | Reliable and reusable with SOPs and support | Capability record with maturity R7, approved SOPs |

## Rules
- Maturity is assigned only by a governed **decision** record following an **evaluation**. Copilots and CloudBase never promote maturity.
- Evidence starts as `candidate` and becomes `approved` only after human review.
- A failure record is a valid and valuable outcome at any level.
- Capabilities inherit maturity from their strongest approved evidence, not from the ambition of the project.

## Relationships
`R&D project → creates → Capability → belongs-to → Cluster`; `Evidence → supports → Evaluation`; `Research → informs → R&D project`; `Project reference → produced-evidence-for → Capability`.
