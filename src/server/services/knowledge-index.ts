import type { ContentType, GovernedBase, KnowledgeItem } from "@/domain";
import { MATURITY_MODEL, SOP_STATUS_LABELS } from "@/domain";
import { urlFor } from "@/lib/urls";
import type { Repositories } from "@/server/repositories/interfaces";

/**
 * Builds the unified knowledge index consumed by search, the command palette,
 * home page feeds and related-content panels. Pure: takes repositories in,
 * returns items out — no I/O of its own.
 */

const text = (...parts: Array<string | string[] | undefined>) =>
  parts
    .flat()
    .filter((p): p is string => typeof p === "string" && p.length > 0)
    .join("\n");

function base(type: ContentType, g: GovernedBase, extra: Partial<KnowledgeItem> & { body?: string }): KnowledgeItem {
  return {
    ref: { type, id: g.id },
    title: g.title,
    summary: g.summary,
    owningTeam: g.owningTeam,
    teams: g.teams,
    status: "",
    classification: g.classification,
    tags: g.tags,
    updatedAt: g.updatedAt,
    url: urlFor({ type, id: g.id }),
    body: "",
    ...extra,
  };
}

export function buildKnowledgeIndex(repos: Repositories): KnowledgeItem[] {
  const items: KnowledgeItem[] = [];

  for (const sop of repos.sops.list()) {
    // Retired SOPs stay in the registry for audit and history but leave the
    // live index: nobody should find guidance the owners have withdrawn.
    if (sop.versions.every((v) => v.status === "historical")) continue;
    const effective = sop.versions.find((v) => v.version === sop.effectiveVersion) ?? sop.versions[sop.versions.length - 1];
    const imported = sop.versions.map((v) => (v.importedContentId ? repos.sops.importedContent(v.importedContentId) : undefined));
    items.push(
      base("sop", sop, {
        status: SOP_STATUS_LABELS[effective.status],
        category: sop.category,
        body: text(
          sop.sopNumber,
          sop.category,
          sop.kind,
          effective.purpose,
          effective.prerequisites,
          effective.procedure.map((p) => `${p.step} ${p.detail}`),
          effective.warnings,
          imported.flatMap((c) => c?.chunks.map((ch) => `${ch.section} ${ch.content} ${ch.keywords.join(" ")}`) ?? []),
        ),
      }),
    );
  }

  for (const doc of repos.docs.list()) {
    items.push(base("documentation", doc, { status: doc.status, category: doc.category, body: text(doc.domain, doc.category, doc.body) }));
  }
  for (const r of repos.research.list()) {
    items.push(base("research", r, { status: r.status, category: r.kind, body: text(r.question, r.findings, r.recommendation, r.body) }));
  }
  for (const p of repos.cros.rndProjects()) {
    items.push(
      base("rnd-project", p, {
        status: p.status,
        maturity: p.maturity ? `${p.maturity} ${MATURITY_MODEL[p.maturity].label}` : undefined,
        body: text(p.code, p.problem, p.hypothesis, p.technologies, p.serviceLines),
      }),
    );
  }
  for (const c of repos.cros.capabilities()) {
    items.push(
      base("capability", c, {
        status: c.maturity ? MATURITY_MODEL[c.maturity].label : "Maturity not assessed",
        maturity: c.maturity,
        body: text(c.code, c.description, c.useCases, c.inputs, c.outputs, c.technicalApproach, c.limitations),
      }),
    );
  }
  for (const cl of repos.cros.clusters()) {
    items.push(base("capability-cluster", cl, { body: text(cl.code, cl.description, cl.serviceLines) }));
  }
  for (const e of repos.cros.evaluations()) items.push(base("evaluation", e, { status: e.decision, body: text(e.criteria.map((c) => `${c.name} ${c.note}`)) }));
  for (const e of repos.cros.evidence()) items.push(base("evidence", e, { status: e.status, body: text(e.kind, e.findings, e.limitations) }));
  for (const e of repos.cros.experiments()) items.push(base("experiment", e, { status: e.status, body: text(e.question, e.method, e.result) }));
  for (const d of repos.cros.decisions()) items.push(base("decision", d, { status: d.outcome, body: text(d.rationale) }));
  for (const i of repos.cros.ideas()) items.push(base("idea", i, { status: i.status, body: text(i.signal) }));

  for (const c of repos.copilots.list()) {
    items.push(base("copilot", c, { status: c.status, body: text(c.purpose, c.description, c.supportedUsers, c.usageGuide, c.limitations, c.authorityBoundaries) }));
  }
  for (const a of repos.automations.list()) {
    items.push(base("automation", a, { status: a.status, category: a.category, body: text(a.businessProblem, a.trigger, a.workflow, a.systems, a.output) }));
  }
  for (const p of repos.projectReferences.list()) {
    items.push(base("project-reference", p, { status: p.status, category: p.serviceLine, body: text(p.client, p.location, p.problem, p.workPerformed, p.technologies, p.outcomes, p.lessons) }));
  }
  for (const r of repos.rfp.list()) {
    items.push(base("rfp", r, { status: r.status, category: r.kind, body: text(r.body) }));
  }
  for (const a of repos.crm.accounts()) items.push(base("account", a, { status: a.status, category: a.kind, body: text(a.region, a.serviceLines) }));
  for (const c of repos.crm.contacts()) items.push(base("contact", c, { status: c.role, body: text(c.role, c.accountId) }));
  for (const o of repos.crm.opportunities()) items.push(base("opportunity", o, { status: o.stage, category: o.serviceLine, body: text(o.source, o.nextStep, o.rfpDecision, o.accountId) }));
  for (const a of repos.agents.list()) {
    items.push({ ref: { type: "agent", id: a.id }, title: a.title, summary: a.purpose, owningTeam: a.owningTeam, teams: [], status: a.status, classification: "internal", tags: a.audiences, url: urlFor({ type: "agent", id: a.id }), body: text(a.kind, a.implementation, a.authorityBoundaries) });
  }
  for (const t of repos.teams.list()) {
    items.push({
      ref: { type: "team", id: t.id },
      title: t.name,
      summary: t.description,
      owningTeam: t.id,
      teams: [],
      status: t.scope,
      classification: "internal",
      tags: [],
      url: urlFor({ type: "team", id: t.id }),
      body: text(t.commonQuestions, t.experts.map((e) => `${e.name} ${e.area}`)),
    });
  }
  return items;
}
