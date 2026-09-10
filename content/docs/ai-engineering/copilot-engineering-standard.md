---
id: copilot-engineering-standard
title: Cloudpoint Copilot Engineering Standard
summary: The standard every Cloudpoint copilot must satisfy before it is registered, piloted or made operational.
owningTeam: ai-automation
teams: [rnd, technical-gis]
category: Standard
domain: AI Engineering
status: draft
version: "0.1"
tags: [copilot, ai, governance, standard]
---
# Cloudpoint Copilot Engineering Standard

A **copilot** is a governed AI assistant that helps a defined user do a defined job with defined authority. It is not a chatbot, and it is never the source of organizational truth. This standard applies to every entry in the [Copilot Registry](/copilots).

> Principle: **AI recommends, humans decide.** A copilot may search, summarize, connect, draft, classify and extract. It must not approve, publish, promote, authorize or create official records without a governed human step.

## 1. Problem definition

Start from a workflow problem, not from a model. Record:

- The job to be done, in the user's words.
- Where the time, error or risk is today.
- What "good" looks like (a measurable outcome).
- Whether deterministic tooling would solve it (if yes, build that instead — see the [Automation Engineering Standard](/docs/automation/automation-engineering-standard)).

## 2. User

Name the persona(s), their permissions in CloudBase, their expertise level, and the situations in which they will and will not use the copilot.

## 3. Mode

| Mode | Description | Example |
| --- | --- | --- |
| Retrieval | Finds and cites governed knowledge | SOP Knowledge Assistant |
| Advisory | Analyzes inputs and recommends | RFP Appraisal Assistant, CROS Copilot |
| Drafting | Produces a draft for human editing | Project Reference Assistant |
| Engineering | Assists code/configuration under review | Experience Builder Engineering Copilot |

A copilot may combine modes; each must be declared.

## 4. Authority boundaries

Write explicit **may / must not** lists. Every "must not" becomes a test case (§11).

```yaml
authorityBoundaries:
  - MAY draft a project reference from approved project data.
  - MAY ask for missing dates, metrics, locations.
  - MUST NOT invent outcomes, ROI, dates, locations or metrics.
  - MUST NOT mark wording as client-approved.
```

## 5. System prompt / master instructions

Structure the master instructions as: identity → mission → users → authority boundaries → knowledge rules → output contract → refusal rules → tone. Keep them versioned in the registry (`instructions` field) and never embed secrets or credentials.

```text
You are the <Name>, an internal Cloudpoint copilot for <users>.
Your job: <one sentence>.
You answer only from the provided governed sources. If none applies, say:
"No approved Cloudpoint knowledge currently supports a definitive answer."
Label each statement FACT, SUPPORTED_INFERENCE, ASSUMPTION or UNKNOWN.
Never: <authority boundaries>.
Output: <contract from §8>.
```

## 6. Knowledge context

Declare every knowledge source in the registry (`knowledgeSources`), with type (registry / documents / external / system) and classification. Retrieval must be **permission-scoped**: a user must never receive an answer derived from a document they cannot read.

## 7. Tool access

List every tool the copilot can call, what it can read/write, and what requires confirmation. Write tools default to disabled. Tool calls are logged.

## 8. Output contracts

Define the response shape so downstream humans and systems can rely on it.

```json
{
  "decision": "GO | CONDITIONAL_GO | NO_GO",
  "reasons": ["…"],
  "redFlags": ["…"],
  "missingInformation": ["…"],
  "citations": [{ "sourceId": "…", "section": "…" }]
}
```

Every contract includes citations and a way to express uncertainty.

## 9. Security

- Classification of inputs and outputs; where data is processed; retention.
- Provider selection through the CloudBase AI adapter layer only — no direct provider calls in UI or copilot code.
- Prompt-injection defenses: retrieved content is data, never instructions.
- Secrets in server configuration only.

## 10. Human review

State which outputs require review, by whom, and how the review is recorded (review queue, approval evidence). Nothing a copilot produces becomes an SOP, policy, evidence or decision without this step.

## 11. Evaluation

Maintain `testCases` in the registry: input → expected behaviour → must-not list. Run them before every version change. Track:

- Groundedness (every FACT cites a real, permitted source).
- Refusal correctness (declines when no source supports the answer).
- Boundary adherence (must-not list never violated).
- Usefulness (rated by the target users).

## 12. Versioning

Semantic versions. Instruction, knowledge-source or tool changes bump the version and add a release note. Superseded versions stay in history.

## 13. Deployment

Status progression: `concept → draft → prototype → pilot → operational`. Promotion requires the review in §10 and passing evaluation in §11. `accessUrl` is set only when a deployment is approved and configured — never fabricated.

## 14. Maintenance

Owner, review cadence (default quarterly), knowledge freshness checks, incident path.

## 15. Deprecation

Announce, redirect users to the replacement or SOP, set status `deprecated`, keep the record for audit.

## Templates

- Master Instructions — §5 skeleton.
- Knowledge Context — table of sources with id, kind, classification, freshness owner.
- Governance — authority boundaries, human review points, escalation.
- Output Contract — JSON schema as in §8.
- Test Cases — `id, input, expectedBehaviour, mustNot[]`.
- Evaluation Rubric — groundedness / refusal / boundary / usefulness, 0–5 each.
- Release Notes — `version, date, note`.
