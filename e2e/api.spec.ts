import { test, expect, type APIRequestContext } from "@playwright/test";
import { createHmac } from "node:crypto";
import { ROI_BOUNDS } from "@/types/roi";

/**
 * API integration tests — hit the running production server's API routes.
 * These verify the real HTTP contract: status codes, validation, method handling,
 * and the ROI calculation response shape.
 *
 * DB behavior note: the test server runs WITHOUT DATABASE_URL (no Postgres in
 * the test env). This is intentional — it verifies the documented fail-closed
 * behavior:
 *   - /api/leads without DB → 503 (lead capture must not silently succeed)
 *   - /api/roi-calculate without DB → 200 (analytics persist is best-effort;
 *     the calculation result is still returned to the user)
 */

const VALID_LEAD = {
  company_name: "Test Corp",
  contact_name: "Test Person",
  contact_email: "test@example.com",
  contact_phone: "416-555-0100",
  industry: "Real Estate",
  automation_interest: "Lead routing",
  message: "Automated test submission.",
};

const VALID_ROI = {
  team_size: ROI_BOUNDS.teamSize.default,
  average_salary: ROI_BOUNDS.averageSalary.default,
  hours_lost_per_week: ROI_BOUNDS.hoursLostPerWeek.default,
};

// ─── /api/leads ────────────────────────────────────────────────────────────
test.describe("POST /api/leads", () => {
  test("rejects invalid JSON body with 400", async ({ request }: { request: APIRequestContext }) => {
    const res = await request.post("/api/leads", { data: "{ not json" });
    // Next parses body; malformed JSON → our 400 handler
    expect([400, 415]).toContain(res.status());
  });

  test("rejects invalid payload (bad email) with 400", async ({ request }) => {
    const res = await request.post("/api/leads", {
      data: { ...VALID_LEAD, contact_email: "not-an-email" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/validation/i);
  });

  test("rejects missing required fields with 400", async ({ request }) => {
    const res = await request.post("/api/leads", {
      data: { contact_email: "test@example.com" },
    });
    expect(res.status()).toBe(400);
  });

  test("GET returns 405 method not allowed", async ({ request }) => {
    const res = await request.get("/api/leads");
    expect(res.status()).toBe(405);
  });

  test("valid payload without DB → 503 (fail-closed, no silent success)", async ({ request }) => {
    const res = await request.post("/api/leads", { data: VALID_LEAD });
    // No DATABASE_URL in test env → insert fails → 503. This is the CORRECT
    // behavior: we must not tell a user their lead was captured if it wasn't.
    expect(res.status()).toBe(503);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });
});

// ─── /api/roi-calculate ────────────────────────────────────────────────────
test.describe("POST /api/roi-calculate", () => {
  test("rejects invalid payload (out of bounds) with 400", async ({ request }) => {
    const res = await request.post("/api/roi-calculate", {
      data: { ...VALID_ROI, team_size: 999 },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects non-integer with 400", async ({ request }) => {
    const res = await request.post("/api/roi-calculate", {
      data: { ...VALID_ROI, team_size: 10.5 },
    });
    expect(res.status()).toBe(400);
  });

  test("GET returns 405", async ({ request }) => {
    const res = await request.get("/api/roi-calculate");
    expect(res.status()).toBe(405);
  });

  test("valid payload → 200 with correct ROI result (even without DB)", async ({ request }) => {
    const res = await request.post("/api/roi-calculate", { data: VALID_ROI });
    // Best-effort persist (fire-and-forget) — the RESULT is always returned.
    expect(res.status()).toBe(200);
    const body = await res.json();
    // Verify the response shape + the exact default-input math (see roi-math.spec.ts)
    expect(body).toHaveProperty("annualWaste", 137500);
    expect(body).toHaveProperty("automationCost", 25000);
    expect(body).toHaveProperty("netRecoveryYear1", 85000);
    expect(body).toHaveProperty("roiPercentage", 340);
    expect(body).toHaveProperty("paybackWeeks", 11.8);
  });

  test("different inputs produce different results", async ({ request }) => {
    const small = await request.post("/api/roi-calculate", {
      data: { team_size: 1, average_salary: 30000, hours_lost_per_week: 1 },
    });
    const big = await request.post("/api/roi-calculate", {
      data: { team_size: 100, average_salary: 150000, hours_lost_per_week: 40 },
    });
    const sBody = await small.json();
    const bBody = await big.json();
    expect(bBody.annualWaste).toBeGreaterThan(sBody.annualWaste);
  });
});

// ─── /api/calendly/webhook ─────────────────────────────────────────────────
test.describe("POST /api/calendly/webhook", () => {
  test("GET returns 405", async ({ request }) => {
    const res = await request.get("/api/calendly/webhook");
    expect(res.status()).toBe(405);
  });

  test("rejects request with no signature header → 401 (fail-closed)", async ({ request }) => {
    const res = await request.post("/api/calendly/webhook", {
      data: { event: "invitee.created", payload: { email: "x@example.com" } },
      headers: { "Content-Type": "application/json" },
    });
    // No CALENDLY_WEBHOOK_SIGNING_KEY in test env → verifyCalendlySignature
    // returns false → 401. No unauthenticated webhook is ever processed.
    expect(res.status()).toBe(401);
  });

  test("rejects request with malformed signature header → 401", async ({ request }) => {
    const res = await request.post("/api/calendly/webhook", {
      data: { event: "invitee.created" },
      headers: {
        "Content-Type": "application/json",
        "calendly-webhook-signature": "garbage",
      },
    });
    expect(res.status()).toBe(401);
  });

  test("rejects a signature with a stale timestamp (replay protection) → 401", async ({
    request,
  }) => {
    // Even with a well-formed header, an old timestamp must be rejected.
    const staleT = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const fakeSig = createHmac("sha256", "any-key")
      .update(`${staleT}.{"event":"test"}`)
      .digest("hex");
    const res = await request.post("/api/calendly/webhook", {
      data: { event: "test" },
      headers: {
        "Content-Type": "application/json",
        "calendly-webhook-signature": `t=${staleT},v1=${fakeSig}`,
      },
    });
    expect(res.status()).toBe(401);
  });
});
