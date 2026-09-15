import "server-only";
import path from "node:path";
import { createHash } from "node:crypto";

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

export type AuthMode = "dev" | "entra" | "access" | "email" | "code" | "none";
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
    /** Cloudflare Access: team domain and Application Audience tag. */
    accessTeamDomain: string;
    accessAud: string;
    /** Signs the session cookie and the stored sign-in codes. Required for email sign-in. */
    sessionSecret: string;
    sessionHours: number;
    /** Shared code for a demo deployment: read-only access for anyone who has it. */
    accessCode: string;
    /** One code per person, so access can be withdrawn from one of them alone. */
    personalCodes: Array<{ name: string; code: string }>;
    /** Optional second code granting the register's own roles. Kept separate on purpose. */
    adminCode: string;
    /** Who the admin code signs in as. Written `Name=code`; without it the code has no identity to attach. */
    adminName: string;
    tenantId: string;
    /**
     * Why the active mode is not the requested one, in words a person can act
     * on. Hosting dashboards store these values write-only, so when sign-in is
     * off the only way anyone can tell which variable is at fault is if the
     * app says so itself.
     */
    modeNote: string;
    requestedMode: string;
  };
  mail: {
    driver: "smtp" | "brevo" | "resend" | "log";
    from: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    resendApiKey: string;
    brevoApiKey: string;
  };
  ai: {
    provider: AiProviderName;
    model: string;
    apiKey: string;
    baseUrl: string;
    azureDeployment: string;
  };
  search: { provider: "lexical" | "hybrid" };
  /** Largest document the upload workflow accepts, in megabytes. */
  maxUploadMb: number;
  storage: { mode: "file" | "postgres" };
  database: { url: string };
  blob: { mode: "local" | "s3" | "postgres"; bucket: string; endpoint: string; region: string; accessKeyId: string; secretAccessKey: string; forcePathStyle: boolean };
  features: { legacyPrototype: boolean };
  drive: { configured: boolean };
  github: { token: string; configured: boolean };
  pipedrive: { token: string; domain: string; configured: boolean };
  branding: { developer: string };
  /**
   * Where the SOP process actually happens. Both are real destinations people
   * are sent to from the home page, so they are configuration rather than
   * markup: they can be changed in the deployment without a code edit, and an
   * empty value hides its step rather than offering a dead link.
   */
  links: { sopCopilot: string; sopDriveFolder: string };
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

/**
 * Reads CLOUDBASE_ACCESS_CODES: one entry per person, as `Name=code`,
 * separated by newlines, commas or semicolons. For example
 *
 *     Hunter=quiet-harbor-lantern; Jon=amber-ridge-compass
 *
 * A code per person is still a shared secret rather than proof of identity —
 * anyone it is passed to can use it — but it is revocable one person at a time
 * and it puts a real name in the access log instead of a typed one. Entries
 * without both halves are dropped rather than silently becoming a blank code
 * that would match an empty submission.
 */
function parsePersonalCodes(raw: string | undefined): Array<{ name: string; code: string }> {
  if (!raw?.trim()) return [];
  const seen = new Set<string>();
  const out: Array<{ name: string; code: string }> = [];
  for (const entry of raw.split(/[\n,;]+/)) {
    const at = entry.indexOf("=");
    if (at < 0) continue;
    const name = entry.slice(0, at).trim();
    const code = entry.slice(at + 1).trim();
    if (!name || !code || seen.has(code)) continue;
    seen.add(code);
    out.push({ name, code });
  }
  return out;
}

let cached: CloudBaseConfig | null = null;

export function getConfig(): CloudBaseConfig {
  if (cached) return cached;
  const env = (process.env.NODE_ENV as CloudBaseConfig["env"]) ?? "development";
  // Pasting a value into a hosting dashboard often carries a stray space or a
  // trailing newline with it. An unrecognised mode used to fall through every
  // branch and leave a sign-in page with no way to sign in and nothing to
  // explain why, so normalise the value and say so plainly when it is wrong.
  const rawMode = (process.env.CLOUDBASE_AUTH_MODE ?? "").trim().toLowerCase();
  const known: readonly AuthMode[] = ["dev", "entra", "access", "email", "code", "none"];
  let requestedMode: AuthMode;
  let modeNote = "";
  if (!rawMode) {
    requestedMode = env === "production" ? "none" : "dev";
    if (env === "production") modeNote = "CLOUDBASE_AUTH_MODE is not set in this deployment's environment.";
  } else if ((known as readonly string[]).includes(rawMode)) {
    requestedMode = rawMode as AuthMode;
  } else {
    modeNote = `CLOUDBASE_AUTH_MODE is set to something that is not one of: ${known.join(", ")}. Check it for a stray space, quotes or a capital letter.`;
    console.error(`[config] ${modeNote}`);
    requestedMode = "none";
  }
  // Never allow the development identity provider in production builds.
  let mode: AuthMode = env === "production" && requestedMode === "dev" ? "none" : requestedMode;
  if (mode !== requestedMode && requestedMode === "dev") modeNote = "CLOUDBASE_AUTH_MODE is set to dev, which is refused in a production deployment because it would make every visitor an administrator. Set it to code.";
  // Email sign-in signs its session cookie and hashes its codes with this
  // secret. Without one, sessions would be forgeable — so the mode turns
  // itself off rather than pretending to authenticate anybody.
  if (mode === "code" && !(process.env.CLOUDBASE_ACCESS_CODE ?? "").trim() && parsePersonalCodes(process.env.CLOUDBASE_ACCESS_CODES).length === 0) {
    modeNote = "CLOUDBASE_AUTH_MODE is set to code, but neither CLOUDBASE_ACCESS_CODE nor CLOUDBASE_ACCESS_CODES is set in this deployment's environment. Add one (Production scope) and redeploy.";
    if (env === "production") console.error(`[config] ${modeNote}`);
    mode = "none";
  }
  if (mode === "email" && !(process.env.CLOUDBASE_SESSION_SECRET ?? "").trim()) {
    modeNote = "CLOUDBASE_AUTH_MODE is set to email, but CLOUDBASE_SESSION_SECRET is missing, so sessions could not be signed.";
    if (env === "production") console.error(`[config] ${modeNote}`);
    mode = "none";
  }

  // CLOUDBASE_ADMIN_CODE may be written `Name=code`, which is what lets it
  // resolve to a person in the register. A bare code still works for the
  // shared-code form, where the visitor types a name.
  const adminEntry = parsePersonalCodes(process.env.CLOUDBASE_ADMIN_CODE)[0];

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
      accessTeamDomain: (process.env.CLOUDBASE_ACCESS_TEAM_DOMAIN ?? "").trim().replace(/^https?:\/\//, "").replace(/\/$/, ""),
      accessAud: (process.env.CLOUDBASE_ACCESS_AUD ?? "").trim(),
      accessCode: (process.env.CLOUDBASE_ACCESS_CODE ?? "").trim(),
      personalCodes: parsePersonalCodes(process.env.CLOUDBASE_ACCESS_CODES),
      adminCode: adminEntry?.code ?? (process.env.CLOUDBASE_ADMIN_CODE ?? "").trim(),
      adminName: adminEntry?.name ?? "",
      modeNote,
      requestedMode: rawMode,
      // In code mode the shared codes can stand in for a session secret, so a
      // demo needs two settings rather than three. Changing a code then signs
      // everyone out, which is the behaviour you want anyway.
      sessionSecret: (process.env.CLOUDBASE_SESSION_SECRET ?? "").trim() || (process.env.CLOUDBASE_ACCESS_CODE ? `derived:${createHash("sha256").update(`${process.env.CLOUDBASE_ACCESS_CODE}|${process.env.CLOUDBASE_ADMIN_CODE ?? ""}`).digest("hex")}` : ""),
      sessionHours: Math.max(1, Number(process.env.CLOUDBASE_SESSION_HOURS ?? 12)),
      tenantId: process.env.CLOUDBASE_TENANT_ID ?? "cloudpoint",
    },
    ai: {
      provider: (process.env.CLOUDBASE_AI_PROVIDER as AiProviderName | undefined) ?? "disabled",
      model: process.env.CLOUDBASE_AI_MODEL ?? "",
      apiKey: process.env.CLOUDBASE_AI_API_KEY ?? "",
      baseUrl: process.env.CLOUDBASE_AI_BASE_URL ?? "",
      azureDeployment: process.env.CLOUDBASE_AI_AZURE_DEPLOYMENT ?? "",
    },
    mail: {
      driver: (process.env.CLOUDBASE_MAIL_DRIVER?.trim() as "smtp" | "brevo" | "resend" | "log" | undefined) || (process.env.SMTP_HOST ? "smtp" : process.env.BREVO_API_KEY ? "brevo" : process.env.RESEND_API_KEY ? "resend" : "log"),
      from: process.env.CLOUDBASE_MAIL_FROM ?? "CloudBase <no-reply@cloudpointgeo.com>",
      smtpHost: (process.env.SMTP_HOST ?? "").trim(),
      smtpPort: Number(process.env.SMTP_PORT ?? 587),
      smtpUser: (process.env.SMTP_USER ?? "").trim(),
      smtpPassword: process.env.SMTP_PASSWORD ?? "",
      resendApiKey: (process.env.RESEND_API_KEY ?? "").trim(),
      brevoApiKey: (process.env.BREVO_API_KEY ?? "").trim(),
    },
    search: { provider: (process.env.CLOUDBASE_SEARCH_PROVIDER as "lexical" | "hybrid" | undefined) ?? "lexical" },
    // The file registry is the default and never has to be asked for. Serving
    // from the database is an explicit opt-in (CLOUDBASE_STORAGE=postgres):
    // merely having a DATABASE_URL in the environment must not switch a
    // working deployment onto a database that has not been migrated or seeded.
    storage: { mode: process.env.CLOUDBASE_STORAGE?.trim() === "postgres" ? "postgres" : "file" },
    database: { url: process.env.DATABASE_URL?.trim() ?? "" },
    blob: {
      // Explicit, like the record store: credentials sitting in the
      // environment never switch the mode by themselves.
      mode: ((m) => (m === "s3" ? "s3" : m === "postgres" ? "postgres" : "local"))(process.env.CLOUDBASE_BLOB_STORAGE?.trim().toLowerCase()),
      bucket: process.env.S3_BUCKET ?? "",
      endpoint: process.env.S3_ENDPOINT ?? "",
      region: process.env.S3_REGION ?? "us-east-1",
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
      forcePathStyle: bool(process.env.S3_FORCE_PATH_STYLE, true),
    },
    // Serverless platforms cap the request body well below the app's own limit
    // (Vercel functions stop at 4.5 MB), and the platform rejects the upload
    // before any of this code runs — so the limit has to be configurable and
    // shown to the person choosing the file.
    maxUploadMb: Math.max(1, Number(process.env.CLOUDBASE_MAX_UPLOAD_MB ?? 25)),
    features: { legacyPrototype: bool(process.env.CLOUDBASE_ENABLE_LEGACY_PROTOTYPE, env !== "production") },
    drive: { configured: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) },
    github: { token: process.env.GITHUB_TOKEN ?? "", configured: bool(process.env.CLOUDBASE_GITHUB_ENABLED, true) },
    pipedrive: { token: process.env.PIPEDRIVE_API_TOKEN ?? "", domain: process.env.PIPEDRIVE_COMPANY_DOMAIN ?? "", configured: Boolean(process.env.PIPEDRIVE_API_TOKEN) },
    branding: { developer: process.env.CLOUDBASE_DEVELOPER_CREDIT ?? "Cloudpoint Geospatial · AI & Automation" },
    links: {
      sopCopilot: (process.env.CLOUDBASE_SOP_COPILOT_URL ?? "https://chatgpt.com/agents/a/agt_6aa94e2b76308191b29e62e50e28d355").trim(),
      sopDriveFolder: (process.env.CLOUDBASE_SOP_DRIVE_FOLDER_URL ?? "https://drive.google.com/drive/folders/1R8nMuTCM8rUL74pfo9WkAQTtyWeyIDe4?usp=drive_link").trim(),
    },
  };
  return cached;
}

/** Test helper — resets the cached config after env changes. */
export function resetConfigForTests() {
  cached = null;
}
