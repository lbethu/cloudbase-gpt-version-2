import "server-only";
import { getConfig } from "@/server/config";

/**
 * Outbound mail — used only to deliver sign-in codes.
 *
 * Three drivers so a deployment is never blocked on a mail decision:
 *   smtp    any mailbox that speaks SMTP (Google Workspace and Microsoft 365
 *           both do, with an app password) — no new vendor, and mail arrives
 *           from a Cloudpoint address, which matters for a sign-in code;
 *   resend  an HTTP API, for hosts that block outbound SMTP ports;
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
    if (env === "production") return { ok: false, error: "No mail driver is configured, so sign-in codes cannot be delivered. Set CLOUDBASE_MAIL_DRIVER=smtp (or resend) and its credentials." };
    console.log(`\n── mail (dev) ──\nto: ${mail.to}\n${mail.subject}\n${mail.text}\n────────────────\n`);
    return { ok: true, driver: "log" };
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
