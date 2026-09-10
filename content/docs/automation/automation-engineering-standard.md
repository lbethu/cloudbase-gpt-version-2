---
id: automation-engineering-standard
title: Cloudpoint Automation Engineering Standard
summary: How Cloudpoint decides between deterministic automation, AI-assisted automation and no automation — and what every automation record must document.
owningTeam: ai-automation
teams: [operations-admin, technical-gis]
category: Standard
domain: Automation
status: draft
version: "0.1"
tags: [automation, standard, governance]
---
# Cloudpoint Automation Engineering Standard

**Core rule: start from the workflow problem.** Only then decide the mechanism.

## Decision: which kind of automation?

| Question | Deterministic | AI-assisted | No automation |
| --- | --- | --- | --- |
| Are inputs structured and the rules stable? | Yes | Partly | — |
| Does the step require judgment over unstructured content? | No | Yes | — |
| Frequency × effort justifies build and maintenance? | Yes | Yes | No |
| Can a wrong output be caught before it matters? | Usually | Requires a human review point | — |
| Would an SOP or form change solve it? | — | — | Yes |

Deterministic automation is preferred whenever it is sufficient. AI-assisted automation always includes a human review point before any consequential output.

## Required documentation (registry fields)

| Field | What to write |
| --- | --- |
| Business problem | Who is affected, how often, what it costs today |
| Trigger | Event, schedule or manual start |
| Inputs | Data, files, fields, systems of record |
| Systems | Everything read or written (Pipedrive, BigTime, ArcGIS Online, SharePoint, …) |
| Logic | Steps in order; decision points; where AI is used and why |
| Human review | Points where a person confirms, and what they see |
| Output | Records created/updated, notifications sent |
| Failure path | What happens on error; retries; who is alerted; how to roll back |
| Logging | What is logged, where, retention |
| Security | Credentials location, least-privilege scopes, data classification |
| Owner | Named owner and backup |
| Maintenance | Review cadence; dependency updates |
| Success metric | The measurable improvement, and how it is read |

## Proposal intake

Use [Propose a New Automation](/automations/propose). The intake questions map to future CROS intake so a proposal can become an idea, evaluation and eventually a capability without re-entry.

## Status lifecycle

`proposed → in-development → pilot → approved → retired`. Approval is recorded in the review queue by an AI steward; AI never approves an automation.

## Example: a deterministic record

```yaml
- id: example-structure-only
  title: (example structure — not a registered automation)
  status: proposed
  kind: deterministic
  owningTeam: operations-admin
  trigger: "Weekly, Monday 07:00"
  inputs: ["Open invoices export"]
  systems: ["Accounting system", "Email"]
  workflow:
    - "Export invoices past due > 30 days"
    - "Group by client"
    - "Draft reminder from approved template"
  humanReviewPoints: ["Finance owner approves each reminder before send"]
  output: "Reminder emails sent; log entry per client"
  failurePath: "On export failure, notify owner; no emails sent"
  logging: "Run log with counts; retained 12 months"
  successMetric: "Days-sales-outstanding for >30-day invoices"
```
