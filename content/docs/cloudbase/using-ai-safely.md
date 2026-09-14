---
id: using-ai-safely
title: Using AI Safely at Cloudpoint
summary: Which AI tools may be used for which company information, how to tell the difference, and what has to be true before an agent or copilot is relied on for work.
owningTeam: ai-automation
teams: [rnd, technical-gis, sales-bd, field-reality-capture, operations-admin, leadership]
category: Standard
domain: CloudBase
status: draft
version: "0.1"
tags: [ai, security, data-protection, standard, copilot, agents]
---
# Using AI Safely at Cloudpoint

This is the standard for using AI on Cloudpoint work. It exists because the question people actually face is not "is AI allowed" but "can I paste *this* into *that*" — and the honest answer depends on two things that are easy to confuse: what the information is, and where the tool sends it.

Read the two tables. Everything else here explains them.

## 1. What the information is

| Class | Examples | Rule |
| --- | --- | --- |
| **Public** | Published marketing, public specifications, open data, anything already on the website | Any tool. |
| **Internal** | Draft SOPs, internal process notes, non-client project detail, meeting notes | Tenant tools only. |
| **Confidential** | Client deliverables and data, pricing, proposals in flight, contracts, personal data of employees or clients | Tenant tools only, and only when the work genuinely requires it. |
| **Restricted** | Credentials, keys, tokens, security findings, anything under a client NDA that names the client | **No AI tool.** Not even a tenant one. |

If you are unsure which class something is, treat it as one class higher than your instinct. The cost of being careful is a slower afternoon; the cost of being wrong is a client conversation you cannot take back.

## 2. Where the tool sends it

| Boundary | What it means | Use for |
| --- | --- | --- |
| **Stays in the Cloudpoint tenant** | Runs under Cloudpoint's Microsoft tenant or another contracted environment; the data does not leave, and is not used to train anyone's model | Public, internal, confidential |
| **Vendor-hosted, no training** | A business or enterprise agreement that contractually excludes your input from training, but the data does leave Cloudpoint | Public, internal — confidential only with the AI &amp; Automation team's agreement |
| **Consumer account** | A personal or free account on any AI service | **Public only.** Treat anything typed here as if you had published it |
| **Not assessed** | Nobody has checked | Nothing, until it is assessed |

Every agent and copilot in CloudBase records its boundary on its own page. If the boundary says *Not assessed*, that is not a formality to work around — it means no one has yet established where the information goes.

### The part people get wrong

The reputation of the vendor is not the boundary. The same model from the same company can be tenant-contained in one place and a consumer product in another; what differs is the agreement your account sits under, not the technology. A personal login to a well-known AI tool is a consumer account, whatever the logo says.

## 3. Plugins, connectors and "agent mode"

A plugin or connector widens what a tool can reach — your files, your mail, a database, the web. That is exactly why it deserves a moment's thought:

- **Connect only what the task needs.** A copilot that needs one SOP library does not need your mailbox.
- **A connector inherits your access, not your judgement.** If you can open it, the tool can read it — including things you forgot you could open.
- **Anything the tool fetches is untrusted.** A web page or a document can contain text that reads like an instruction. Treat retrieved content as information to weigh, never as a command to follow, and be suspicious of any output that suddenly wants to send something, change a setting, or fetch a new address.
- **Approve deliberately.** When a tool asks for permission to act — send, post, delete, purchase, change settings — read what it is actually about to do. Approval is the control; clicking through it removes the control.
- **Nothing is installed company-wide by one person.** New plugins and connectors go through the AI &amp; Automation team, who record the boundary before anyone depends on it.

## 4. What a good agent or copilot looks like here

Cloudpoint answers a business problem with a **pair**:

- an **agent** — runs on a schedule or a trigger, produces a report or findings, and has no authority to change anything;
- a **copilot** — interactive, helps a named person do a named job, and is what you interrogate when the agent's output raises a question.

Either half alone fails predictably. An agent with no copilot produces reports nobody can question. A copilot with no agent waits to be asked, and therefore never catches anything by itself.

Every pair is registered in **AI Solutions** with the problem in the requester's words, a named delivery owner, and what the pair may never decide. Before anything is called *operational* it needs:

1. **Test cases** — concrete inputs with the behaviour expected, including what it must *not* do.
2. **A recorded evaluation** — a date, a named reviewer, how many cases were run and how many passed.
3. **A stated data boundary** — from the table above.
4. **A named human owner** — accountable for its behaviour, not merely its existence.

"It seems accurate" is not evidence. The point of writing the evaluation down is that someone in a year can check the claim without asking whoever built it.

## 5. What AI is never allowed to do

This is not a matter of configuration; it is how the platform is built:

- AI does not approve an SOP, publish a policy, promote an R&D maturity level, approve evidence, or authorize a deployment. Those are human actions under named permissions, and every one is audited.
- AI does not create organizational truth. A generated draft is a draft until a person with the authority to approve it does so.
- AI does not decide who may see what. Retrieval is permission-scoped: you never receive an answer built from documents you could not open yourself.

If a tool ever appears to have done one of these, that is an incident — tell the AI &amp; Automation team.

## 6. If something goes wrong

Tell the AI &amp; Automation team the same day. Include what was shared, with which tool, and under which account. Nobody is in trouble for reporting quickly; the damage from a disclosure is almost entirely a function of how long it goes unnoticed. A paste into the wrong window is recoverable if it is known about within hours and often not if it surfaces in a client meeting six weeks later.

## Quick answers

**Can I use a personal AI account for work?** For public information only. Anything internal or above needs a tenant tool.

**Can I paste a client deliverable into a copilot?** Only a tenant-boundary one, and only when the work requires it. Never into a consumer account.

**Can I let a copilot read my mailbox?** Only if the task needs it, and only when the connector has been assessed. Connect the narrowest thing that works.

**A copilot gave me an answer that contradicts an SOP. Which wins?** The approved SOP, always. Then tell the copilot's owner — it means either the copilot is wrong or the SOP is out of date, and both are worth knowing.

**Something I ask for daily has no copilot.** Submit it to **AI Solutions**. A problem stated in your own words is exactly the right input; you do not need to design the answer.
