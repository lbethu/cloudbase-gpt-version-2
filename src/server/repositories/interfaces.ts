import type {
  Account,
  Activity,
  AgentDefinition,
  Automation,
  Capability,
  CapabilityCluster,
  Contact,
  Copilot,
  Decision,
  Evaluation,
  Evidence,
  Experiment,
  Idea,
  ImportedContent,
  Opportunity,
  ProjectReference,
  Relationship,
  ResearchDocument,
  RfpRecord,
  Role,
  RndProject,
  Sop,
  Team,
  TechnicalDocument,
} from "@/domain";

/**
 * Repository interfaces — the only seam between the application and storage.
 * The file registry implements them today; a PostgreSQL/Drizzle implementation
 * can be selected later via configuration without touching services or UI.
 */

export interface TeamRepository {
  list(): Team[];
  get(id: string): Team | undefined;
}

export interface RoleRepository {
  list(): Role[];
}

export interface SopRepository {
  list(): Sop[];
  get(id: string): Sop | undefined;
  importedContent(id: string): ImportedContent | undefined;
  allImportedContent(): ImportedContent[];
}

/** Read-only view of CROS. CROS remains authoritative for all of these. */
export interface CrosRegistry {
  readonly source: "local-registry" | "external";
  rndProjects(): RndProject[];
  rndProject(id: string): RndProject | undefined;
  capabilities(): Capability[];
  capability(id: string): Capability | undefined;
  clusters(): CapabilityCluster[];
  cluster(id: string): CapabilityCluster | undefined;
  ideas(): Idea[];
  evaluations(): Evaluation[];
  evidence(): Evidence[];
  experiments(): Experiment[];
  decisions(): Decision[];
}

export interface CopilotRepository {
  list(): Copilot[];
  get(id: string): Copilot | undefined;
}

export interface AutomationRepository {
  list(): Automation[];
  get(id: string): Automation | undefined;
}

export interface ProjectReferenceRepository {
  list(): ProjectReference[];
  get(id: string): ProjectReference | undefined;
}

export interface ResearchRepository {
  list(): ResearchDocument[];
  get(id: string): ResearchDocument | undefined;
}

export interface RfpRepository {
  list(): RfpRecord[];
  get(id: string): RfpRecord | undefined;
}

export interface DocumentationRepository {
  list(): TechnicalDocument[];
  get(id: string): TechnicalDocument | undefined;
}

export interface RelationshipRepository {
  list(): Relationship[];
}

export interface CrmRepository {
  accounts(): Account[];
  account(id: string): Account | undefined;
  contacts(): Contact[];
  contact(id: string): Contact | undefined;
  opportunities(): Opportunity[];
  opportunity(id: string): Opportunity | undefined;
  activities(): Activity[];
}

export interface AgentRepository {
  list(): AgentDefinition[];
  get(id: string): AgentDefinition | undefined;
}

export interface Repositories {
  crm: CrmRepository;
  agents: AgentRepository;
  teams: TeamRepository;
  roles: RoleRepository;
  sops: SopRepository;
  cros: CrosRegistry;
  copilots: CopilotRepository;
  automations: AutomationRepository;
  projectReferences: ProjectReferenceRepository;
  research: ResearchRepository;
  rfp: RfpRepository;
  docs: DocumentationRepository;
  relationships: RelationshipRepository;
}
