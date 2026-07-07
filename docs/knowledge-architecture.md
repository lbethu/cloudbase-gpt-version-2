# Knowledge Architecture

## Core objects

Each document contains an ID, company workspace, source kind, optional SOP number, title, type, category, owner role, update date, lifecycle status, original filename, tags, summary, key sections, and retrieval chunks. Each chunk carries its source section, text, and retrieval keywords.

The current review index contains one deliberately safe corpus:

- CloudBase AI mock foundation: 30 fictional documents and 109 chunks across 10 source groups

No supplied or confidential company document participates in retrieval. Approved sources can use the same contract after access, ownership, and review decisions are complete.

## Retrieval flow

1. Normalize and tokenize the employee's question.
2. Remove low-information stop words.
3. Filter by the selected company workspace and score its authorized chunks.
4. Boost matches in title, source group, document type, audience, department, category, tags, headings, chunks, and example questions.
5. Return the strongest three to five chunks.
6. Derive a High, Medium, or Low confidence label.
7. Produce a direct answer, most relevant and supporting sources, related documents, low-confidence question suggestions, and a next action.

Version 1 uses deterministic lexical scoring. This makes the prototype free to run, easy to inspect, and suitable for experience validation.

## Source grounding

Every result retains its document and section identity. The interface links answers to a source viewer where users can inspect metadata, key sections, sample chunks, tags, ownership, and replacement status.

## Production extension

The `searchKnowledgeBase` contract can be backed by a hybrid retrieval service without rewriting the product experience. A production implementation should combine:

- Keyword and vector retrieval
- Metadata filters
- Identity-aware access controls
- Reranking
- Approved language-model synthesis
- Citation validation
- Retrieval and faithfulness evaluation
- Audit logging and feedback

Only sources the current user is authorized to read should be retrieved or sent to an answer model.
