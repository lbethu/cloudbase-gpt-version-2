---
id: rfp-evaluation-assistant-pattern
title: How We Build an RFP Evaluation Assistant
summary: The internal design pattern behind the RFP Appraisal Engine — inputs, red flags, compliance matrix, fit assessment and the GO / CONDITIONAL_GO / NO_GO decision vocabulary.
owningTeam: sales-bd
teams: [ai-automation, leadership]
category: Design Pattern
domain: RFP
status: draft
version: "0.1"
tags: [rfp, proposal, appraisal, copilot]
---
# How We Build an RFP Evaluation Assistant

This document describes the **design pattern** for AI-assisted RFP opportunity evaluation (R&D project CP-RND-006, capability CAP-006). It contains no confidential RFP content; governed evaluations are stored as RFP Intelligence records with restricted access.

## Problem
Evaluating an RFP takes senior time, is inconsistent between evaluators, and missed requirements surface late. The assistant structures the evaluation so a human can decide quickly and defensibly.

## Inputs
- RFP document(s) and addenda (text extracted; originals stay access-controlled).
- Cloudpoint context from CloudBase: service lines, capabilities, project references, SOPs (209 Creating and Sending Proposals and Quotes; 223 Project Reference Creation and Updates).
- Constraints: staffing window, geography, certifications, insurance, partner availability.

## Analysis blocks
1. **Red flags** — unrealistic schedule, unfavourable terms, unusual insurance/bonding, sole-source signals, scope outside Cloudpoint service lines.
2. **Compliance matrix** — every "shall/must" mapped to: requirement → where addressed → owner → status.
3. **Geography / drive-time** — site locations vs. offices and field crews; travel burden.
4. **Client / service fit** — alignment with service lines and past work; relationship history (from governed sources only).
5. **Partner / subcontractor assessment** — gaps requiring partners, approved subcontractor process (SOP 107).
6. **Required sections** — outline extracted from the RFP with page limits.
7. **Submission instructions** — format, portal, copies, deadline and time zone, questions deadline.
8. **Award criteria** — weights, scoring method, price vs. qualifications.

## Decision vocabulary
| Decision | Meaning |
| --- | --- |
| `GO` | Pursue; no blocking gaps |
| `CONDITIONAL_GO` | Pursue only if named conditions are met (partner secured, clarification received, staffing confirmed) |
| `NO_GO` | Do not pursue; reasons recorded for learning |

The assistant **recommends**; the pursuit decision is recorded by an authorized human.

## Output contract
```json
{
  "decision": "GO | CONDITIONAL_GO | NO_GO",
  "conditions": ["…"],
  "redFlags": [{ "issue": "…", "evidence": "RFP §3.2", "severity": "high|medium|low" }],
  "complianceMatrix": [{ "requirement": "…", "source": "RFP §…", "addressedBy": "…", "owner": "…", "status": "planned|gap" }],
  "fit": { "serviceLine": "…", "score": 0, "rationale": "…" },
  "geography": { "sites": ["…"], "driveTimeNotes": "…" },
  "partners": ["…"],
  "requiredSections": [{ "title": "…", "pageLimit": "…" }],
  "submission": { "deadline": "…", "method": "…", "format": "…" },
  "awardCriteria": [{ "criterion": "…", "weight": "…" }],
  "projectReferences": ["project-reference ids"],
  "missingInformation": ["…"]
}
```

## Human review
Sales lead reviews the compliance matrix and red flags; leadership records the decision. Lessons learned from awards and losses become RFP Intelligence records.

## Related knowledge
- SOP 209 — Creating and Sending Proposals and Quotes
- SOP 209.1 — SL Proposal Requirements checklist
- SOP 223 — Project Reference Creation and Updates
- Capability CAP-006 — AI-Assisted RFP Opportunity Evaluation
