import "server-only";
import { getConfig } from "@/server/config";

/**
 * Outbound mail — used only to deliver sign-in codes.
 *
 * Four drivers, because "just use SMTP" fails in ordinary ways: a Workspace
 * administrator can disable app passwords, and a serverless host can be slow
 * or blocked on outbound SMTP ports.
 *
 *   smtp    any mailbox that speaks SMTP (Google Workspace, Microsoft 365)
 *           using an app password — mail arrives from a company address,
 *           which is worth having on a sign-in code;
 *   brevo   HTTP API. A sender address is verified by clicking a link in an
 *           email, so it needs no DNS changes and no administrator;
 *   resend  HTTP API. Needs a verified domain, so it suits a deployment that
 *           controls its own DNS;
 *   log     writes the code to the server log. Refused in production, because
 *           a sign-in code in a log file is not a sign-in code.
 */
export interface Mail {
  to: string;
  subject: string;
  text: string;
}

export type MailResult = { ok: true; driver: string } | { ok: false; error: string };

export async function sendMail(mail: Mail): Promise<MailResult> {
  const { mail: cfg, env } = getConfig();

  if (cfg.driver === "log") {
    if (env === "production") return { ok: false, error: "No mail driver is configured, so sign-in codes cannot be delivered. Set CLOUDBASE_MAIL_DRIVER to brevo, smtp or resend, with its credentials." };
    console.log(`\n── mail (dev) ──\nto: ${mail.to}\n${mail.subject}\n${mail.text}\n────────────────\n`);
    return { ok: true, driver: "log" };
  }

  if (cfg.driver === "brevo") {
    if (!cfg.brevoApiKey) return { ok: false, error: "BREVO_API_KEY is not set." };
    const match = /<([^>]+)>/.exec(cfg.from);
    const senderEmail = (match ? match[1] : cfg.from).trim();
    const senderName = match ? cfg.from.slice(0, match.index).trim().replace(/^"|"$/g, "") : "CloudBase";
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": cfg.brevoApiKey, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ sender: { email: senderEmail, name: senderName || "CloudBase" }, to: [{ email: mail.to }], subject: mail.subject, textContent: mail.text }),
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        // The usual cause is an unverified sender; say so rather than "400".
        return { ok: false, error: `Mail provider refused the message (${response.status}). ${detail.slice(0, 200)}` };
      }
      return { ok: true, driver: "brevo" };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Mail send failed." };
    }
  }

  if (cfg.driver === "resend") {
    if (!cfg.resendApiKey) return { ok: false, error: "RESEND_API_KEY is not set." };
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${cfg.resendApiKey}`, "content-type": "application/json" },
        body: JSON.stringify({ from: cfg.from, to: [mail.to], subject: mail.subject, text: mail.text }),
      });
      if (!response.ok) return { ok: false, error: `Mail provider refused the message (${response.status}).` };
      return { ok: true, driver: "resend" };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Mail send failed." };
    }
  }

  if (!cfg.smtpHost || !cfg.smtpUser || !cfg.smtpPassword) return { ok: false, error: "SMTP is selected but SMTP_HOST, SMTP_USER or SMTP_PASSWORD is missing." };
  try {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: cfg.smtpHost,
      port: cfg.smtpPort,
      secure: cfg.smtpPort === 465,
      auth: { user: cfg.smtpUser, pass: cfg.smtpPassword },
    });
    await transport.sendMail({ from: cfg.from, to: mail.to, subject: mail.subject, text: mail.text });
    return { ok: true, driver: "smtp" };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Mail send failed." };
  }
}
