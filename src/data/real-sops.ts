import { KnowledgeDocument } from "@/types/knowledge";

const realSop = (
  base: Omit<KnowledgeDocument, "status" | "sourceKind" | "companyId" | "companyName">,
): KnowledgeDocument => ({
  ...base,
  status: "Indexed Real SOP",
  sourceKind: "real",
  companyId: "cloudpoint",
  companyName: "Cloudpoint Geospatial",
});

export const realSopDocuments: KnowledgeDocument[] = [
  realSop({
    id: "real-sop-201",
    sopNumber: "201",
    title: "201 — Creating Campaigns",
    type: "Standard Operating Procedure",
    category: "Campaign Management",
    collection: "Sales & Marketing SOPs",
    ownerRole: "Sales Lead / Marketing Coordinator",
    lastUpdated: "June 23, 2026",
    sourceFile: "201- Creating Campaigns.docx",
    tags: ["campaigns", "Pipedrive", "Trello", "BigTime", "Scorecard"],
    summary:
      "Defines campaign setup, naming, materials, execution, follow-up, and closeout across the sales and marketing workflow.",
    sections: [
      { title: "Campaign setup", summary: "Number, name, schedule, and connect the campaign workspace." },
      { title: "Campaign execution", summary: "Launch activities and follow-up through Pipedrive." },
      { title: "Campaign wrap-up", summary: "Close records and report campaign results." },
    ],
    chunks: [
      {
        id: "real-201-purpose",
        section: "Purpose and scope",
        content:
          "Campaigns are the overarching method for generating new business. They are numbered and tracked in the Marketing Scorecard, Pipedrive, Avaza, Trello, and BigTime. The SOP applies to Sales & Marketing and the Local Government, Infrastructure, Public Safety, or Campus Facilities team supporting the campaign.",
        keywords: ["campaign purpose", "new business", "scorecard", "teams"],
      },
      {
        id: "real-201-responsibility",
        section: "Responsibilities",
        content:
          "Each team’s Sales Lead and Tech Lead, with Marketing input, decides the audience, message, methodology, and timeframe for a campaign.",
        keywords: ["sales lead", "tech lead", "audience", "message", "timeframe"],
      },
      {
        id: "real-201-setup",
        section: "Campaign setup",
        content:
          "Add the campaign to the Marketing Campaigns Scorecard to obtain an ID, notify the Office Manager to add the number in BigTime, copy the Campaign Template Card on the Trello Campaigns board, attach the shared-drive campaign folder, connect the card to the team board, and set start and end dates.",
        keywords: ["setup", "campaign ID", "BigTime", "Trello", "shared drive"],
      },
      {
        id: "real-201-naming",
        section: "Campaign naming convention",
        content:
          "Campaigns use the naming pattern YYYY.##-Title of Campaign, with no spaces around the dash. The title comes from the Team Leader and should be succinct but recognizable, such as 2024.10-Esri UC.",
        keywords: ["naming", "YYYY", "campaign number", "title"],
      },
      {
        id: "real-201-materials",
        section: "Campaign materials",
        content:
          "Allow at least two weeks for printed materials. Develop and review the marketing list using required Pipedrive fields, then develop, review, edit, and finalize campaign content before launch.",
        keywords: ["printed materials", "lead time", "marketing list", "content review"],
      },
      {
        id: "real-201-launch",
        section: "Campaign execution",
        content:
          "The Sales Lead or Marketing Coordinator imports initial campaign activities into Pipedrive, adds the campaign-number tag to people, launches the campaign, imports follow-up activities, and records returned letters, bounced emails, contact changes, and completed follow-ups.",
        keywords: ["launch", "Pipedrive", "activities", "follow-up", "bounced emails"],
      },
      {
        id: "real-201-closeout",
        section: "Campaign wrap-up",
        content:
          "Confirm that the correct Deals, People, and Activities are tagged and logged in Pipedrive. Move the Trello card to the year’s Completed Campaigns list, update results in Marketing Campaigns, and ask the Office Manager to mark the campaign complete in BigTime.",
        keywords: ["wrap up", "complete", "results", "Pipedrive", "Trello", "BigTime"],
      },
    ],
  }),
  realSop({
    id: "real-sop-209",
    sopNumber: "209",
    title: "209 — Creating and Sending Proposals and Quotes",
    type: "Standard Operating Procedure",
    category: "Proposals & Quotes",
    collection: "Sales & Marketing SOPs",
    ownerRole: "Business Development Manager",
    lastUpdated: "June 23, 2026",
    sourceFile: "209- Creating and Sending Proposals and Quotes.docx",
    tags: ["proposal", "quote", "PandaDoc", "Pipedrive", "approval"],
    summary:
      "Covers the controlled creation, review, approval, delivery, filing, and follow-up of client quotes and proposals.",
    sections: [
      { title: "Quote workflow", summary: "Create, approve, finalize, send, and follow up." },
      { title: "Proposal workflow", summary: "Add executive signature and supporting recommendations." },
      { title: "Automations", summary: "Archive completed PDFs and schedule follow-up." },
    ],
    chunks: [
      {
        id: "real-209-purpose",
        section: "Purpose and systems",
        content:
          "This SOP applies to Sales and Marketing staff and team leaders creating and sending quotes or proposals. Required systems include Pipedrive, a PandaDoc Standard User account, and Adobe.",
        keywords: ["purpose", "Pipedrive", "PandaDoc", "Adobe"],
      },
      {
        id: "real-209-automation",
        section: "Automations",
        content:
          "When a PandaDoc document is completed, Zapier places a PDF copy in the designated folder for the Marketing Coordinator to distribute to the correct Proposals & Contracts client folder. Completing the Send Quote or Send Proposal activity in Pipedrive schedules follow-up activities and posts an out-the-door Slack notification.",
        keywords: ["Zapier", "automation", "PDF", "follow-up", "Slack"],
      },
      {
        id: "real-209-preparation",
        section: "Quote and proposal preparation",
        content:
          "Save client surveys, meeting notes, and data in the client’s Proposals & Contracts folder. Create or update the Pipedrive Deal, start the document from the PandaDoc area of that Deal, use an approved template, remove recipients, add collaborators, and work with the Team Lead, Technical Expert, or Project Manager on scope and pricing.",
        keywords: ["client folder", "deal", "template", "scope", "pricing"],
      },
      {
        id: "real-209-quote-approval",
        section: "Quote approval",
        content:
          "A quote requires Team Lead approval before sending. Apply the Cloudpoint naming standard, add a 90-day expiration date unless another date is approved, complete a final grammar, syntax, and format review, then download the PDF.",
        keywords: ["quote", "team lead approval", "90-day", "naming", "proofread"],
      },
      {
        id: "real-209-proposal-approval",
        section: "Proposal approval",
        content:
          "A proposal requires Team Lead approval and a signature from the Cloudpoint President or Vice President. Finalize the title using Cloudpoint naming standards, perform the final read-through, and include letters of recommendation when appropriate.",
        keywords: ["proposal", "signature", "president", "vice president", "approval"],
      },
      {
        id: "real-209-send",
        section: "Sending and filing",
        content:
          "Move the downloaded PDF into the client’s Shared Drive Proposals and Contracts folder. Send it through Pipedrive, copy the Team Lead, add the Project Manager as needed, and follow up with the client appropriately.",
        keywords: ["send", "shared drive", "client", "CC", "follow-up"],
      },
      {
        id: "real-209-no-document",
        section: "Deal disposition",
        content:
          "If no quote or proposal is sent to the client, the Deal should be deleted. This should occur only under special circumstances. Use the separate closing-a-deal procedure when the work is won.",
        keywords: ["delete deal", "no proposal", "won", "special circumstances"],
      },
    ],
  }),
  realSop({
    id: "real-sop-216",
    sopNumber: "216",
    title: "216 — Inbound Lead Qualification Process",
    type: "Standard Operating Procedure",
    category: "Lead Qualification",
    collection: "Sales & Marketing SOPs",
    ownerRole: "Business Development Manager / Marketing Coordinator",
    lastUpdated: "June 23, 2026",
    sourceFile: "216- Inbound Lead Qualification Process.docx",
    tags: ["inbound leads", "qualification", "Pipedrive", "MQL", "response time"],
    summary:
      "Defines how inbound inquiries are qualified, assigned, documented, labeled, and answered.",
    sections: [
      { title: "Qualification", summary: "Determine whether an inquiry is a qualified lead." },
      { title: "Assignment", summary: "Route the inquiry to the proper Sales Lead." },
      { title: "Response", summary: "Record the lead and respond within 24 hours." },
    ],
    chunks: [
      {
        id: "real-216-purpose",
        section: "Purpose and scope",
        content:
          "This SOP defines how Cloudpoint qualifies and responds to inbound leads received from multiple sources for services across all teams. It applies to the Sales and Marketing team.",
        keywords: ["inbound", "lead", "qualification", "sales", "marketing"],
      },
      {
        id: "real-216-owner",
        section: "Responsibilities and systems",
        content:
          "The Business Development Manager and Marketing Coordinator maintain the procedure. Pipedrive is the required operating system for lead records.",
        keywords: ["BDM", "marketing coordinator", "Pipedrive", "owner"],
      },
      {
        id: "real-216-qualify",
        section: "Qualify the inquiry",
        content:
          "When an inquiry is received, determine whether it is a Qualified Lead before routing and follow-up.",
        keywords: ["inquiry", "qualified lead", "QL", "qualify"],
      },
      {
        id: "real-216-assign",
        section: "Assign the lead",
        content:
          "Review the COM Site Team Management page and assign the qualified inquiry to the proper Sales Lead for the relevant team.",
        keywords: ["assign", "COM site", "team management", "sales lead"],
      },
      {
        id: "real-216-record",
        section: "Record in Pipedrive",
        content:
          "Add the contact to Pipedrive and request missing information when the person is new. If the contact already exists, update the record and pin a note containing the inquiry details. Label the person as MQL.",
        keywords: ["contact", "Pipedrive", "pin note", "MQL", "update"],
      },
      {
        id: "real-216-response",
        section: "Response time",
        content:
          "The assigned Sales Lead or Team Lead follows up with the inbound lead within 24 hours.",
        keywords: ["24 hours", "follow-up", "response", "sales lead", "team lead"],
      },
    ],
  }),
  realSop({
    id: "real-sop-220",
    sopNumber: "220",
    title: "220 — Marketing Content Review & Approval",
    type: "Standard Operating Procedure",
    category: "Content Approval",
    collection: "Sales & Marketing SOPs",
    ownerRole: "VP of Sales",
    lastUpdated: "June 23, 2026",
    effectiveDate: "January 1, 2026",
    sourceFile: "220-Marketing Content Review & Approval SOP.docx",
    tags: ["marketing", "content review", "approval tiers", "brand", "escalation"],
    summary:
      "Defines three approval tiers, role ownership, strategic escalation, review checks, and publishing controls for external content.",
    sections: [
      { title: "Approval tiers", summary: "Route content by scope and impact." },
      { title: "Strategic escalation", summary: "Escalate unresolved alignment questions." },
      { title: "Review checklist", summary: "Validate accuracy, brand, audience, and CTA." },
    ],
    chunks: [
      {
        id: "real-220-scope",
        section: "Purpose and scope",
        content:
          "The procedure applies to externally facing marketing and sales materials, including websites, blogs, social content, one-pagers, case studies, white papers, proposal marketing components, email campaigns, newsletters, and event materials. It protects brand consistency, technical accuracy, strategic alignment, and efficient decisions.",
        keywords: ["external content", "website", "social", "email", "brand"],
      },
      {
        id: "real-220-roles",
        section: "Roles and responsibilities",
        content:
          "The Marketing Coordinator owns brand standards, determines the approval tier, manages review, and approves Tier 1. Team Leaders own technical accuracy and service positioning. The VP of Sales owns strategic alignment and approves Tier 2. The Marketing Leadership Group approves Tier 3.",
        keywords: ["roles", "marketing coordinator", "team leader", "VP sales", "leadership"],
      },
      {
        id: "real-220-tier1",
        section: "Tier 1 — Team-specific content",
        content:
          "Tier 1 covers content for one team, service, or offering. The Team Leader reviews technical accuracy and positioning; the Marketing Coordinator reviews brand, message, and clarity and is the final approver. Strategic concerns are escalated to the VP of Sales.",
        keywords: ["tier 1", "team-specific", "final approval", "marketing coordinator"],
      },
      {
        id: "real-220-tier2",
        section: "Tier 2 — Cross-team or new-channel content",
        content:
          "Tier 2 covers multi-team campaigns, industry campaigns, company newsletters, cross-team events, landing pages, and new channels. Participating Team Leaders review their sections, Marketing reviews brand cohesion, and the VP of Sales gives final approval after strategic and go-to-market review.",
        keywords: ["tier 2", "cross-team", "new channel", "newsletter", "VP sales"],
      },
      {
        id: "real-220-tier3",
        section: "Tier 3 — Company-wide initiatives",
        content:
          "Tier 3 covers company-wide campaigns, pricing promotions, major white papers, homepage changes, and strategic announcements. Marketing checks execution readiness, Team Leaders verify accuracy, and the Marketing Leadership Group gives final approval.",
        keywords: ["tier 3", "company-wide", "pricing", "homepage", "leadership group"],
      },
      {
        id: "real-220-escalation",
        section: "Strategic escalation rule",
        content:
          "The Marketing Coordinator must not resolve strategic alignment questions. Unclear audience or market fit, positioning changes, claims affecting partnerships or brand risk, and campaigns affecting sales prioritization must be escalated to the VP of Sales.",
        keywords: ["escalation", "non-negotiable", "brand risk", "positioning", "VP sales"],
      },
      {
        id: "real-220-checklist",
        section: "Standard review checklist",
        content:
          "At every tier, confirm technical accuracy, defensible claims, clear audience and intent, brand-compliant visuals, consistent voice and tone, and an appropriate call to action.",
        keywords: ["review checklist", "technical accuracy", "claims", "voice", "CTA"],
      },
      {
        id: "real-220-meeting",
        section: "Weekly leadership meeting",
        content:
          "Use the weekly Marketing Leadership meeting for Tier 3 approvals or issues, escalations beyond the VP of Sales, and campaign outcomes. Do not use it for line-by-line review, visual formatting feedback, or routine Tier 1 or Tier 2 approvals.",
        keywords: ["weekly meeting", "tier 3", "campaign outcomes", "not used"],
      },
      {
        id: "real-220-enforcement",
        section: "Enforcement and exceptions",
        content:
          "Content may not be published or distributed until the required approval steps are complete. Exceptions require VP of Sales approval, and the SOP is reviewed annually or as the organization scales.",
        keywords: ["publish", "distribution", "exception", "annual review"],
      },
    ],
  }),
];

export const realSopCategories = [
  "Campaign Management",
  "Proposals & Quotes",
  "Lead Qualification",
  "Content Approval",
];
