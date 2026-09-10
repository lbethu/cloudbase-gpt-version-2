import type { ContentRef, ContentType } from "@/domain/common";

/** Canonical route for every governed object type. Shared by server and client. */
const BASE: Record<ContentType, string> = {
  sop: "/sops",
  documentation: "/docs",
  research: "/research",
  "rnd-project": "/cros/projects",
  capability: "/capabilities",
  "capability-cluster": "/capabilities/clusters",
  evaluation: "/cros/evaluations",
  evidence: "/cros/evidence",
  experiment: "/cros/experiments",
  decision: "/cros/decisions",
  idea: "/cros/ideas",
  copilot: "/copilots",
  automation: "/automations",
  "project-reference": "/projects",
  rfp: "/rfp",
  team: "/teams",
  policy: "/sops",
  account: "/crm/accounts",
  contact: "/crm/contacts",
  opportunity: "/crm/opportunities",
  agent: "/agents",
};

export const urlFor = (ref: ContentRef) => `${BASE[ref.type]}/${encodeURIComponent(ref.id)}`;
export const listUrlFor = (type: ContentType) => BASE[type];
