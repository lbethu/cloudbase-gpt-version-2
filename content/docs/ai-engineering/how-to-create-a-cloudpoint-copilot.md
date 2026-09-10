---
id: how-to-create-a-cloudpoint-copilot
title: How to Create a Cloudpoint Copilot
summary: The internal AI engineering playbook — fourteen steps from business problem to maintained copilot.
owningTeam: ai-automation
category: Playbook
domain: AI Engineering
status: draft
version: "0.1"
tags: [copilot, playbook, ai]
---
# How to Create a Cloudpoint Copilot

This playbook walks through building a copilot that satisfies the [Copilot Engineering Standard](/docs/ai-engineering/copilot-engineering-standard). Each step produces a registry field.

## 1. Start with the business problem
Write the problem statement with the person who has it. If you cannot name the person, stop.

## 2. Determine whether AI is needed
Ask: is the input structured? Is the rule stable? Could a script, a form or an SOP fix it? Only proceed when judgment over unstructured information is the bottleneck.

## 3. Define the user / persona
Who, how often, with which permissions, at which moment in their workflow.

## 4. Define authority boundaries
Write the MAY / MUST NOT list. Convert every MUST NOT into a test case later.

## 5. Define knowledge sources
Search CloudBase first. List SOPs, documentation, project references, capabilities the copilot may use. Record classification for each.

## 6. Define instructions
Draft the master instructions using the standard's skeleton. Keep them short enough to review in one sitting.

## 7. Define output contracts
Decide the shape of every answer, including how uncertainty and missing information are expressed.

## 8. Define security / data restrictions
Where data goes, what is retained, which provider through the adapter layer, which tools are enabled.

## 9. Define human review
Which outputs need a reviewer, who that is, and how approval is recorded.

## 10. Test
Run the test cases. Include adversarial prompts (instructions hidden in retrieved content, requests to exceed authority).

## 11. Evaluate
Score groundedness, refusal correctness, boundary adherence and usefulness with real users.

## 12. Version
Set the semantic version and release note.

## 13. Publish
Submit the registry record for review. Status moves `draft → prototype → pilot → operational` only through the review queue. Publication without authorized review is not possible.

## 14. Maintain
Assign owner and review cadence. Re-run tests when knowledge sources change.

## Registry record skeleton

```yaml
- id: my-copilot
  title: My Copilot
  status: draft
  owningTeam: ai-automation
  purpose: One sentence.
  supportedUsers: [Role A, Role B]
  authorityBoundaries:
    - MAY …
    - MUST NOT …
  knowledgeSources:
    - { label: "SOP 209", ref: { type: sop, id: sop-209 }, kind: registry }
  outputContract: "…"
  humanReview: "…"
  securityClassification: internal
  testCases:
    - { id: t1, input: "…", expectedBehaviour: "…", mustNot: ["…"] }
  version: "0.1.0"
```
