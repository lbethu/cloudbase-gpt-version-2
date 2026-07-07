import { KnowledgeDocument } from "@/types/knowledge";

const chunks = (
  id: string,
  items: Array<[string, string, string[]]>,
) =>
  items.map(([section, content, keywords], index) => ({
    id: `${id}-c${index + 1}`,
    section,
    content,
    keywords,
  }));

export const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: "project-setup",
    title: "SOP: Project Setup and Folder Structure",
    type: "Standard Operating Procedure",
    category: "Project Setup",
    ownerRole: "Project Manager / Project Lead",
    lastUpdated: "May 14, 2026",
    status: "Ready for Review",
    tags: ["kickoff", "folders", "metadata", "templates"],
    summary:
      "Standardizes project kickoff, workspace creation, naming, metadata, and initial internal review.",
    sections: [
      { title: "New project kickoff", summary: "Inputs required before work begins." },
      { title: "Folder naming convention", summary: "A repeatable project workspace pattern." },
      { title: "PM/PL review", summary: "Ownership and readiness checkpoints." },
    ],
    chunks: chunks("project-setup", [
      ["New project kickoff", "Before creating a workspace, the PM confirms the project number, client name, scope, contract status, delivery dates, project lead, and primary coordinate system. Work should not begin from an untracked personal folder.", ["kickoff", "project number", "scope", "coordinate system"]],
      ["Folder naming convention", "Create the root folder as ProjectNumber_Client_ShortProjectName. Use 01_Admin, 02_Source_Data, 03_Working, 04_QAQC, 05_Deliverables, and 06_Archive as the standard first-level folders.", ["folder", "naming", "structure", "directory"]],
      ["Project metadata", "Record the project number, client, PM, PL, task order, spatial reference, data sensitivity, retention class, and target delivery date in the project metadata record.", ["metadata", "client", "spatial reference", "retention"]],
      ["PM responsibilities", "The PM verifies authorization, budget, client contacts, delivery expectations, and communication cadence before marking setup complete.", ["PM", "budget", "authorization", "client"]],
      ["PL responsibilities", "The PL validates the technical approach, software environment, spatial reference, source-data needs, and production assignments.", ["PL", "technical", "software", "assignments"]],
      ["Internal review checklist", "A second team member confirms folder structure, access permissions, metadata completeness, backup coverage, and the presence of approved templates.", ["review", "checklist", "permissions", "backup"]],
      ["Setup completion", "The project may move to production only after the PM and PL acknowledge the setup checklist and unresolved risks are recorded in the project log.", ["approval", "production", "risk", "checklist"]],
    ]),
  },
  {
    id: "gis-data",
    title: "SOP: GIS Data Management",
    type: "Standard Operating Procedure",
    category: "Data Management",
    ownerRole: "GIS Technical Lead",
    lastUpdated: "April 28, 2026",
    status: "Mock Prototype",
    tags: ["GIS", "raw data", "versioning", "backup"],
    summary:
      "Defines how geospatial source, working, and final datasets are preserved, named, versioned, and backed up.",
    sections: [
      { title: "Raw data preservation", summary: "Protect original source material." },
      { title: "Processed data", summary: "Separate transformation outputs." },
      { title: "Version control", summary: "Make change history understandable." },
    ],
    chunks: chunks("gis-data", [
      ["Raw data preservation", "Store received GIS data unchanged in 02_Source_Data/Raw using a dated source subfolder. Treat raw files as read-only and never overwrite or edit them in place.", ["raw", "source data", "read-only", "preserve"]],
      ["Source documentation", "Save delivery emails, download notes, data dictionaries, licenses, and source URLs beside the raw dataset so provenance remains available.", ["provenance", "data dictionary", "license", "URL"]],
      ["Processed data folders", "Place cleaned, projected, joined, or otherwise transformed datasets in 03_Working/Processed. The filename or processing log should identify the transformation.", ["processed", "working", "transform", "projection"]],
      ["GIS naming standards", "Use concise names with approved abbreviations, no spaces, and a meaningful subject-area prefix. Avoid final_final naming and unexplained initials.", ["naming", "filename", "abbreviation", "GIS"]],
      ["Backup expectations", "Project data must reside in the managed project workspace covered by organizational backup. Local scratch copies are temporary and are not the system of record.", ["backup", "managed", "local", "system of record"]],
      ["Version control notes", "Use dated releases or semantic revision labels for major geodatabase and deliverable milestones. Record material schema or processing changes in the project log.", ["version", "revision", "geodatabase", "change log"]],
      ["Data handoff", "Before handoff, remove temporary layers, repair broken paths, document coordinate systems, and identify the authoritative dataset for downstream users.", ["handoff", "coordinate system", "authoritative", "paths"]],
    ]),
  },
  {
    id: "qaqc",
    title: "SOP: QA/QC Workflow for GIS Deliverables",
    type: "Quality Standard",
    category: "QA/QC",
    ownerRole: "QA/QC Reviewer",
    lastUpdated: "June 3, 2026",
    status: "Ready for Review",
    tags: ["validation", "delivery", "geometry", "attributes"],
    summary:
      "A defensible review workflow for geometry, attributes, projections, domains, maps, and final packages.",
    sections: [
      { title: "Automated checks", summary: "Repeatable technical validation." },
      { title: "Independent review", summary: "A reviewer outside production checks outputs." },
      { title: "Release approval", summary: "Documented readiness before delivery." },
    ],
    chunks: chunks("qaqc", [
      ["Geometry validation", "Run geometry checks for null, empty, self-intersecting, duplicate, and invalid features. Resolve errors or document accepted exceptions before delivery.", ["geometry", "invalid", "duplicate", "topology"]],
      ["Attribute completeness", "Confirm required fields are populated, identifiers are unique, null values are intentional, and field formats match the delivery schema.", ["attribute", "completeness", "null", "schema"]],
      ["Projection checks", "Verify every dataset uses the approved horizontal and vertical coordinate systems and that transformation methods are documented.", ["projection", "coordinate system", "transformation", "spatial reference"]],
      ["Domain validation", "Compare coded values against approved domains and flag orphaned, deprecated, misspelled, or out-of-range values.", ["domain", "coded value", "range", "validation"]],
      ["Cartographic review", "Inspect labels, legends, scale-dependent visibility, symbology, north arrows, dates, and disclaimers at the intended output size.", ["map", "legend", "labels", "symbology"]],
      ["Final deliverable review", "An independent reviewer compares the package with the scope, naming standard, schema, and client instructions, then records findings and disposition.", ["final", "deliverable", "independent review", "scope"]],
      ["Release approval", "The PM confirms client-facing completeness and the PL confirms technical quality. Delivery occurs only after critical findings are closed.", ["approval", "PM", "PL", "critical findings"]],
    ]),
  },
  {
    id: "sales",
    title: "Sales Playbook Sample",
    type: "Playbook",
    category: "Sales",
    ownerRole: "Business Development Lead",
    lastUpdated: "March 19, 2026",
    status: "Replace with Real Data Later",
    tags: ["discovery", "RFP", "CRM", "follow-up"],
    summary:
      "A sample opportunity workflow from lead intake and discovery through proposal and follow-up.",
    sections: [
      { title: "Lead intake", summary: "Capture opportunity context." },
      { title: "Discovery", summary: "Understand the problem behind the request." },
      { title: "Proposal workflow", summary: "Coordinate a clear response." },
    ],
    chunks: chunks("sales", [
      ["Lead intake", "Create an opportunity record with organization, contact, source, need, location, timing, estimated value, and assigned pursuit owner.", ["lead", "intake", "opportunity", "owner"]],
      ["Discovery questions", "Ask what decision the client must make, who uses the output, what data exists, what has failed before, what deadline matters, and how success will be measured.", ["discovery", "questions", "success", "deadline"]],
      ["Discovery notes", "Capture notes in the approved CRM opportunity record within one business day. Separate client statements, team assumptions, decisions, and open questions.", ["notes", "CRM", "client", "open questions"]],
      ["Client pain points", "Translate symptoms into operational impacts such as delayed field work, uncertain asset records, repeated manual processing, compliance risk, or weak decision visibility.", ["pain point", "risk", "manual", "decision"]],
      ["Proposal and RFP flow", "Assign a response lead, build a compliance matrix, confirm win themes, collect resumes and project examples, review pricing, and schedule red-team review.", ["proposal", "RFP", "compliance matrix", "pricing"]],
      ["Follow-up workflow", "Send a concise recap with decisions, owners, and dates after discovery. Log the next action and avoid leaving an opportunity without a dated follow-up.", ["follow-up", "recap", "next action", "date"]],
      ["Pursuit handoff", "When work is awarded, transfer assumptions, commitments, exclusions, contacts, pricing basis, and discovery notes to the delivery PM and PL.", ["handoff", "award", "commitment", "PM"]],
    ]),
  },
  {
    id: "pm-pl",
    title: "PM/PL Guide Sample",
    type: "Role Guide",
    category: "PM/PL Guidance",
    ownerRole: "Operations Director",
    lastUpdated: "May 30, 2026",
    status: "Mock Prototype",
    tags: ["PM", "PL", "milestones", "escalation"],
    summary:
      "Clarifies commercial and technical leadership responsibilities, review cadence, client updates, and escalation.",
    sections: [
      { title: "Role clarity", summary: "Distinct, complementary accountability." },
      { title: "Milestone reviews", summary: "Structured internal checkpoints." },
      { title: "Escalation", summary: "Surface risk early and clearly." },
    ],
    chunks: chunks("pm-pl", [
      ["PM responsibilities", "The PM owns scope, schedule, budget, contract alignment, client communication, staffing coordination, and commercial risk.", ["PM", "scope", "schedule", "budget"]],
      ["PL responsibilities", "The PL owns technical approach, production quality, task direction, technical decisions, standards compliance, and technical risk.", ["PL", "technical", "quality", "standards"]],
      ["Working agreement", "At kickoff, the PM and PL agree on decision rights, review points, communication channels, staffing assumptions, and escalation thresholds.", ["kickoff", "decision rights", "staffing", "threshold"]],
      ["Internal milestone review", "Hold reviews at setup, approximately 30%, 60%, 90%, and release. Each review should assess scope, budget, schedule, risks, quality, and decisions needed.", ["milestone", "30%", "60%", "90%"]],
      ["Client update cadence", "Set a predictable update cadence appropriate to project risk. Updates should state completed work, next work, decisions needed, schedule or budget health, and emerging risks.", ["client update", "cadence", "status", "risk"]],
      ["Escalation process", "Escalate when scope, schedule, budget, safety, data quality, or client expectations threaten a committed outcome. State the issue, impact, options, recommendation, and decision date.", ["escalation", "issue", "impact", "recommendation"]],
      ["Pre-delivery review", "Before client delivery, the PM checks scope, commitments, packaging, and message; the PL checks technical validity, QA/QC closure, reproducibility, and limitations.", ["delivery", "review", "limitations", "QA/QC"]],
    ]),
  },
  {
    id: "com-site",
    title: "COM Site Reference Sample",
    type: "Internal Reference",
    category: "COM Site Reference",
    ownerRole: "Knowledge Administrator",
    lastUpdated: "June 10, 2026",
    status: "Replace with Real Data Later",
    tags: ["COM", "resources", "templates", "navigation"],
    summary:
      "A mock directory showing how employees could navigate governed internal resources and this assistant.",
    sections: [
      { title: "Resource navigation", summary: "Find the governed source quickly." },
      { title: "Knowledge collections", summary: "Understand where each resource belongs." },
      { title: "Using the assistant", summary: "Use answers as a guided starting point." },
    ],
    chunks: chunks("com-site", [
      ["Internal resource navigation", "Begin at the mock COM Operations Hub. Use governed collection links rather than bookmarks to individual files, which may move or be superseded.", ["COM", "operations hub", "navigation", "resource"]],
      ["Finding SOPs", "Find approved operational procedures under Operations Hub > Standards & SOPs. Filter by practice, process owner, status, or effective date.", ["SOP", "standards", "approved", "effective date"]],
      ["Project templates", "Find kickoff forms, folder templates, QA/QC checklists, status reports, and delivery transmittals under Operations Hub > Project Delivery Toolkit.", ["template", "kickoff", "checklist", "delivery toolkit"]],
      ["Sales references", "Find discovery prompts, qualification guidance, proposal assets, resumes, and project examples under Growth Hub > Sales & Proposals.", ["sales", "proposal", "discovery", "growth hub"]],
      ["PM/PL references", "Find role guides, financial review aids, milestone agendas, escalation guidance, and closeout resources under Operations Hub > Project Leadership.", ["PM", "PL", "project leadership", "closeout"]],
      ["Using the knowledge base", "Ask the assistant for a source-backed summary, then open the cited section before acting on high-impact, client-facing, contractual, or safety-related guidance.", ["knowledge base", "source", "citation", "assistant"]],
      ["Content feedback", "If guidance appears missing or outdated, use the review action to notify the listed content owner. Do not silently copy and republish controlled content.", ["feedback", "outdated", "owner", "controlled content"]],
    ]),
  },
];

export const categories = [
  "Project Setup",
  "Data Management",
  "QA/QC",
  "Field Collection",
  "Deliverables",
  "Client Communication",
  "Sales",
  "PM/PL Guidance",
  "COM Site Reference",
];
