import type { Permission } from "@/domain";

/** Left-navigation model. Sections collapse; items are hidden when the viewer lacks the permission. */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  permission?: Permission;
  exact?: boolean;
}
export interface NavSection {
  id: string;
  label?: string;
  items: NavItem[];
}

export const NAVIGATION: NavSection[] = [
  {
    id: "top",
    items: [
      { label: "Home", href: "/", icon: "home", exact: true },
      { label: "Ask CloudBase", href: "/ask", icon: "sparkles", permission: "ask.use" },
      { label: "Search", href: "/search", icon: "search" },
    ],
  },
  {
    id: "dashboards",
    label: "Dashboards",
    items: [
      { label: "Leadership", href: "/dashboards/leadership", icon: "gauge", permission: "knowledge.read" },
      { label: "Sales", href: "/dashboards/sales", icon: "trending", permission: "knowledge.read" },
      { label: "GIS / Technical", href: "/dashboards/gis", icon: "map", permission: "knowledge.read" },
      { label: "Field", href: "/dashboards/field", icon: "compass", permission: "knowledge.read" },
      { label: "Operations", href: "/dashboards/operations", icon: "clipboard", permission: "knowledge.read" },
      { label: "AI / Automation", href: "/dashboards/ai", icon: "cpu", permission: "knowledge.read" },
    ],
  },
  {
    id: "knowledge",
    label: "Knowledge",
    items: [
      { label: "Team Workspaces", href: "/teams", icon: "users", permission: "knowledge.read" },
      { label: "SOPs", href: "/sops", icon: "book", permission: "sop.read" },
      { label: "Documentation", href: "/docs", icon: "file-code", permission: "knowledge.read" },
      { label: "Research", href: "/research", icon: "flask", permission: "knowledge.read" },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    items: [
      { label: "CROS", href: "/cros", icon: "orbit", permission: "rnd.read" },
      { label: "Capabilities", href: "/capabilities", icon: "layers", permission: "capability.read" },
      { label: "Project References", href: "/projects", icon: "briefcase", permission: "knowledge.read" },
      { label: "RFP Intelligence", href: "/rfp", icon: "scale", permission: "knowledge.read" },
      { label: "Knowledge Graph", href: "/graph", icon: "network", permission: "knowledge.read" },
    ],
  },
  {
    id: "crm",
    label: "CRM",
    items: [
      { label: "Pipeline", href: "/crm", icon: "kanban", permission: "crm.read", exact: true },
      { label: "Accounts", href: "/crm/accounts", icon: "building", permission: "crm.read" },
      { label: "Contacts", href: "/crm/contacts", icon: "contact", permission: "crm.read" },
      { label: "Opportunities", href: "/crm/opportunities", icon: "target", permission: "crm.read" },
    ],
  },
  {
    id: "ai",
    label: "AI",
    items: [
      { label: "Copilots", href: "/copilots", icon: "bot", permission: "copilot.read" },
      { label: "Automations", href: "/automations", icon: "workflow", permission: "automation.read" },
      { label: "Agents", href: "/agents", icon: "radar", permission: "agent.read" },
    ],
  },
  {
    id: "governance",
    label: "Governance",
    items: [
      { label: "Reviews", href: "/governance/reviews", icon: "check-square", permission: "review.read" },
      { label: "Admin", href: "/governance/admin", icon: "shield", permission: "admin.access" },
      { label: "Audit", href: "/governance/audit", icon: "scroll", permission: "audit.read" },
      { label: "Integrations", href: "/governance/integrations", icon: "plug", permission: "integration.read" },
    ],
  },
];

export interface PaletteCommand {
  id: string;
  label: string;
  href: string;
  permission?: Permission;
  hint?: string;
}

export const PALETTE_COMMANDS: PaletteCommand[] = [
  { id: "ask", label: "Ask CloudBase", href: "/ask", permission: "ask.use", hint: "Governed answer with sources" },
  { id: "sop-draft", label: "Create SOP draft", href: "/sops/new", permission: "sop.author" },
  { id: "rnd-idea", label: "Submit R&D idea", href: "/cros/ideas/new", permission: "rnd.submit" },
  { id: "automation", label: "Propose automation", href: "/automations/propose", permission: "automation.read" },
  { id: "research", label: "Create research proposal", href: "/research/templates/research-proposal", permission: "knowledge.read" },
  { id: "cros-copilot", label: "Open CROS Copilot", href: "/cros/copilot", permission: "rnd.read" },
  { id: "copilot-create", label: "How to create a Cloudpoint Copilot", href: "/copilots/create", permission: "copilot.read" },
  { id: "graph", label: "Open Knowledge Graph", href: "/graph", permission: "knowledge.read" },
  { id: "agents", label: "Run platform agents", href: "/agents", permission: "agent.read" },
  { id: "pipeline", label: "Open sales pipeline", href: "/crm", permission: "crm.read" },
  { id: "dash-lead", label: "Leadership dashboard", href: "/dashboards/leadership", permission: "knowledge.read" },
];
