---
id: cloudbase-ask-governance
title: Ask CloudBase — Answer Governance
summary: What Ask CloudBase may and may not say, how statements are labelled, and how citations are enforced.
owningTeam: ai-automation
category: Policy
domain: CloudBase
status: draft
version: "1.0"
tags: [ask, governance, citations]
---
# Ask CloudBase — Answer Governance

Ask CloudBase answers *"what does the organization know?"* It is distinct from CROS Copilot, which answers *"what should we investigate or do about this new idea?"*

## Statement labels
| Label | Meaning | Requirement |
| --- | --- | --- |
| FACT | Stated in a cited governed source | At least one citation |
| SUPPORTED_INFERENCE | Follows from cited sources | Citations to the sources connected |
| ASSUMPTION | Not in any source | Must be labelled; used sparingly |
| UNKNOWN | No governed source supports an answer | Exact wording: *No approved Cloudpoint knowledge currently supports a definitive answer.* |

## Source priority
1. Approved SOP  2. Documentation  3. Project examples  4. Copilot / tool  5. Known limitations.

## Rules
- Retrieval is permission-scoped; hidden documents never influence an answer.
- Sources that are not yet approved are marked *not yet approved* in the answer.
- A FACT without a surviving citation is downgraded to ASSUMPTION.
- Model output that fails validation is discarded; the governed retrieval answer is shown instead.
- Every query is audited (length and source count, not the text).
- Ask CloudBase never replaces the governed SOP; it links to it.
