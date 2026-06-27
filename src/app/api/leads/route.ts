import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { leadSchema } from "@/lib/validations";

/**
 * POST /api/leads — inbound contact-form lead capture.
 *
 * Validates with zod, then inserts via a parameterized query as sutaz_app.
 *
 * NOTE on enum placeholders: the `leads` table's province/industry/scope
 * columns are NOT NULL enums sourced from the 210-lead spreadsheet taxonomy.
 * The contact form collects free-text industry + automation interest (per the
 * blueprint's form), so those values are stored verbatim in `notes` for later
 * CRM mapping, and the enum columns receive neutral placeholder values.
 * Rows are always distinguishable via `source='form'` vs `source='seed'`, so
 * the placeholders never pollute prospect analytics.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
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
