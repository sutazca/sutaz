/**
 * SMTP mailer for transactional lead notifications.
 *
 * Ports the proven SutazStays pattern (lazy cached nodemailer transport,
 * SMTP_* env contract) to this site. Sends through the self-hosted
 * docker-mailserver (mail.tottynotti.com) authenticated as noreply@sutaz.ca;
 * port 465 = implicit TLS, anything else = STARTTLS (nodemailer `secure`).
 *
 * Configuration is entirely server-side env (never NEXT_PUBLIC): SMTP_HOST,
 * SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, plus LEAD_NOTIFY_TO (comma
 * list). When unset (local dev, e2e), mailerConfigured() is false and the
 * leads route skips sending — behavior is identical to the pre-mail site.
 */
import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import type { LeadInput } from "@/lib/validations";

let cached: Transporter | null = null;

export function mailerConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM,
  );
}

function transport(): Transporter {
  if (cached) return cached;
  const port = Number(process.env.SMTP_PORT ?? "587");
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return cached;
}

/** Minimal HTML escape so visitor-supplied text can't inject markup. */
function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Send the "new lead" notification for a persisted lead row.
 * Reply-To is the visitor so a reply from the inbox goes straight to them.
 */
export async function sendLeadNotification(
  lead: LeadInput & { id: number | string },
): Promise<void> {
  const to = (process.env.LEAD_NOTIFY_TO ?? "hello@sutaz.ca, sutazstay@gmail.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const fields: Array<[string, string]> = [
    ["Lead ID", String(lead.id)],
    ["Company", lead.company_name],
    ["Name", lead.contact_name],
    ["Email", lead.contact_email],
    ["Phone", lead.contact_phone ?? "—"],
    ["Industry", lead.industry],
    ["Automation interest", lead.automation_interest],
    ["Message", lead.message ?? "—"],
  ];

  await transport().sendMail({
    from: process.env.SMTP_FROM,
    to,
    replyTo: lead.contact_email,
    subject: `New lead: ${lead.company_name}`,
    text: fields.map(([k, v]) => `${k}: ${v}`).join("\n"),
    html: `<table cellpadding="6">${fields
      .map(
        ([k, v]) =>
          `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`,
      )
      .join("")}</table>`,
  });
}
