import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { leadSchema } from "@/lib/validations";
import { mailerConfigured, sendLeadNotification } from "@/lib/mailer";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/leads — inbound contact-form lead capture.
 *
 * Validates with zod, then inserts via a parameterized query as sutaz_app.
 *
 * Abuse controls (both before validation):
 *  - Honeypot: the form renders a visually-hidden `website_url` field humans
 *    never see. A non-empty value = bot → pretend success (201, id null),
 *    no insert, no email.
 *  - Rate limit: sliding window per client IP (first x-forwarded-for hop),
 *    LEADS_RATE_MAX per LEADS_RATE_WINDOW_MS (defaults 5/60s) → 429.
 *
 * Notification: after a successful insert, when SMTP env is configured the
 * lead is emailed to LEAD_NOTIFY_TO (best-effort — a mail failure is logged
 * but never turns the 201 into an error; the DB row is the source of truth).
 *
 * NOTE on enum placeholders: the `leads` table's province/industry/scope
 * columns are NOT NULL enums sourced from the 210-lead spreadsheet taxonomy.
 * The contact form collects free-text industry + automation interest (per the
 * blueprint's form), so those values are stored verbatim in `notes` for later
 * CRM mapping, and the enum columns receive neutral placeholder values.
 * Rows are always distinguishable via `source='form'` vs `source='seed'`, so
 * the placeholders never pollute prospect analytics.
 */
const RATE_MAX = Number(process.env.LEADS_RATE_MAX ?? "5");
const RATE_WINDOW_MS = Number(process.env.LEADS_RATE_WINDOW_MS ?? "60000");

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip, RATE_MAX, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields; humans never see website_url.
  if (
    typeof body === "object" &&
    body !== null &&
    "website_url" in body &&
    typeof (body as Record<string, unknown>).website_url === "string" &&
    ((body as Record<string, unknown>).website_url as string).length > 0
  ) {
    return NextResponse.json({ id: null, status: "ok" }, { status: 201 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const d = parsed.data;

  try {
    const result = await pool.query(
      `INSERT INTO leads
         (province, city, industry, company_name, website_domain,
          automation_scope, contact_name, contact_email, contact_phone,
          notes, source, first_contact_date)
       VALUES
         ('ontario', 'N/A', 'web_design_seo', $1, 'https://sutaz.ca/form',
          'workflow_automation', $2, $3, $4, $5, 'form', NOW())
       RETURNING id, status`,
      [
        d.company_name,
        d.contact_name,
        d.contact_email,
        d.contact_phone ?? null,
        // notes carries the structured intent for later CRM mapping
        [
          `industry: ${d.industry}`,
          `automation_interest: ${d.automation_interest}`,
          d.message ? `message: ${d.message}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      ],
    );

    const row = result.rows[0];

    if (mailerConfigured()) {
      try {
        await sendLeadNotification({ ...d, id: row.id });
      } catch (err) {
        // Best-effort: the lead is already persisted; never fail the 201.
        console.error("[/api/leads] notification email failed:", err);
      }
    }

    return NextResponse.json(
      { id: row.id, status: row.status },
      { status: 201 },
    );
  } catch (err) {
    console.error("[/api/leads] insert failed:", err);
    return NextResponse.json(
      { error: "Failed to capture lead" },
      { status: 503 },
    );
  }
}

/** Other methods → 405. */
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
