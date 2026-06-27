import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { roiSchema } from "@/lib/validations";
import { calculateROI } from "@/lib/roi";

/**
 * POST /api/roi-calculate — server-side validation + persistence of ROI inputs.
 *
 * The client calculates live (src/lib/roi.ts is isomorphic), but this route
 * is the trusted source for the persisted analytics row: it re-validates
 * bounds server-side and stores an anonymous record (no PII) in
 * roi_calculations. Returns the canonical result.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = roiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const d = parsed.data;

  const result = calculateROI({
    teamSize: d.team_size,
    averageSalary: d.average_salary,
    hoursLostPerWeek: d.hours_lost_per_week,
  });

  // Persist anonymously — fire-and-forget; analytics is best-effort and must
  // never block the response. A DB outage degrades to "no analytics", not error.
  pool
    .query(
      `INSERT INTO roi_calculations
         (team_size, average_salary, hours_lost_per_week,
          annual_waste, calculated_roi, source)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        d.team_size,
        d.average_salary,
        d.hours_lost_per_week,
        result.annualWaste,
        result.roiPercentage,
        d.source ?? "homepage",
      ],
    )
    .catch((err) => console.error("[/api/roi-calculate] persist failed:", err));

  return NextResponse.json(result, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
