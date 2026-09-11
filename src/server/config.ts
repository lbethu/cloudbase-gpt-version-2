import "server-only";
import path from "node:path";

/**
 * Centralized server configuration. Every environment variable the platform
 * reads is declared here — nothing else in the codebase touches process.env.
 * Secrets never leave the server.
 */

const bool = (value: string | undefined, fallback = false) =>
  value === undefined ? fallback : ["1", "true", "yes", "on"].includes(value.toLowerCase());

const list = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export type AuthMode = "dev" | "entra" | "none";
export type AiProviderName = "disabled" | "openai" | "azure-openai" | "anthropic" | "gemini";

export interface CloudBaseConfig {
  env: "development" | "production" | "test";
  contentDir: string;
  sourceDocumentsDir: string;
  auditDir: string;
  auth: {
    mode: AuthMode;
    dev: { subject: string; name: string; email: string; roles: string[]; teams: string[] };
    /** JSON map of Entra group object ids → CloudBase role ids. */
    entraGroupRoleMap: Record<string, string>;
    entraGroupTeamMap: Record<string, string>;
    tenantId: string;
  };
  ai: {
    provider: AiProviderName;
    model: string;
    apiKey: string;
    baseUrl: string;
    azureDeployment: string;
  };
  search: { provider: "lexical" | "hybrid" };
  storage: { mode: "file" | "postgres" };
  database: { url: string };
  blob: { mode: "local" | "s3"; bucket: string; endpoint: string; region: string; accessKeyId: string; secretAccessKey: string; forcePathStyle: boolean };
  features: { legacyPrototype: boolean };
  drive: { configured: boolean };
  github: { token: string; configured: boolean };
  pipedrive: { token: string; domain: string; configured: boolean };
  branding: { developer: string };
}

const parseJsonMap = (value: string | undefined): Record<string, string> => {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.fromEntries(Object.entries(parsed as Record<string, unknown>).map(([k, v]) => [k, String(v)]));
    }
  } catch {
    /* fall through */
  }
  return {};
};

let cached: CloudBaseConfig | null = null;

export function getConfig(): CloudBaseConfig {
  if (cached) return cached;
  const env = (process.env.NODE_ENV as CloudBaseConfig["env"]) ?? "development";
  const requestedMode = (process.env.CLOUDBASE_AUTH_MODE as AuthMode | undefined) ?? (env === "production" ? "none" : "dev");
  // Never allow the development identity provider in production builds.
  const mode: AuthMode = env === "production" && requestedMode === "dev" ? "none" : requestedMode;

  const rootDir = process.cwd();
  cached = {
    env,
    contentDir: process.env.CLOUDBASE_CONTENT_DIR ?? path.join(rootDir, "content"),
    sourceDocumentsDir: process.env.CLOUDBASE_SOURCE_DOCUMENTS_DIR ?? path.join(rootDir, "source-documents"),
    auditDir: process.env.CLOUDBASE_AUDIT_DIR ?? path.join(rootDir, "var", "audit"),
    auth: {
      mode,
      dev: {
        subject: process.env.CLOUDBASE_DEV_USER_SUBJECT ?? "dev-user",
        name: process.env.CLOUDBASE_DEV_USER_NAME ?? "Development User",
        email: process.env.CLOUDBASE_DEV_USER_EMAIL ?? "dev@cloudpoint.local",
        roles: list(process.env.CLOUDBASE_DEV_USER_ROLES ?? "employee,contributor,reviewer,approver,ai-steward,admin,sales-manager"),
        teams: list(process.env.CLOUDBASE_DEV_USER_TEAMS ?? "company-wide,ai-automation"),
      },
      entraGroupRoleMap: parseJsonMap(process.env.CLOUDBASE_ENTRA_GROUP_ROLE_MAP),
      entraGroupTeamMap: parseJsonMap(process.env.CLOUDBASE_ENTRA_GROUP_TEAM_MAP),
      tenantId: process.env.CLOUDBASE_TENANT_ID ?? "cloudpoint",
    },
    ai: {
      provider: (process.env.CLOUDBASE_AI_PROVIDER as AiProviderName | undefined) ?? "disabled",
      model: process.env.CLOUDBASE_AI_MODEL ?? "",
      apiKey: process.env.CLOUDBASE_AI_API_KEY ?? "",
      baseUrl: process.env.CLOUDBASE_AI_BASE_URL ?? "",
      azureDeployment: process.env.CLOUDBASE_AI_AZURE_DEPLOYMENT ?? "",
    },
    search: { provider: (process.env.CLOUDBASE_SEARCH_PROVIDER as "lexical" | "hybrid" | undefined) ?? "lexical" },
    // The file registry is the default and never has to be asked for. Serving
    // from the database is an explicit opt-in (CLOUDBASE_STORAGE=postgres):
    // merely having a DATABASE_URL in the environment must not switch a
    // working deployment onto a database that has not been migrated or seeded.
    storage: { mode: process.env.CLOUDBASE_STORAGE?.trim() === "postgres" ? "postgres" : "file" },
    database: { url: process.env.DATABASE_URL?.trim() ?? "" },
    blob: {
      mode: process.env.CLOUDBASE_BLOB_STORAGE?.trim() === "s3" ? "s3" : "local",
      bucket: process.env.S3_BUCKET ?? "",
      endpoint: process.env.S3_ENDPOINT ?? "",
      region: process.env.S3_REGION ?? "us-east-1",
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
      forcePathStyle: bool(process.env.S3_FORCE_PATH_STYLE, true),
    },
    features: { legacyPrototype: bool(process.env.CLOUDBASE_ENABLE_LEGACY_PROTOTYPE, env !== "production") },
    drive: { configured: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) },
    github: { token: process.env.GITHUB_TOKEN ?? "", configured: bool(process.env.CLOUDBASE_GITHUB_ENABLED, true) },
    pipedrive: { token: process.env.PIPEDRIVE_API_TOKEN ?? "", domain: process.env.PIPEDRIVE_COMPANY_DOMAIN ?? "", configured: Boolean(process.env.PIPEDRIVE_API_TOKEN) },
    branding: { developer: process.env.CLOUDBASE_DEVELOPER_CREDIT ?? "Lokendra_bethu" },
  };
  return cached;
}

/** Test helper — resets the cached config after env changes. */
export function resetConfigForTests() {
  cached = null;
}
