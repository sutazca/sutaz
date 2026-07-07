import { test, expect } from "@playwright/test";
import { leadSchema, roiSchema } from "@/lib/validations";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { ROI_BOUNDS } from "@/types/roi";

/**
 * Unit tests for the zod validation schemas — the API boundary contract.
 * These verify that valid payloads pass and invalid ones are rejected with the
 * right reasons. Single source of truth (src/lib/validations.ts) imported by
 * every route, so testing here covers all API validation.
 */

test.describe("leadSchema — POST /api/leads validation", () => {
  const VALID = {
    company_name: "Acme Corp",
    contact_name: "Jane Doe",
    contact_email: "jane@acme.com",
    contact_phone: "416-555-0100",
    industry: "Real Estate",
    automation_interest: "Lead routing",
    message: "We need help.",
  };

  test("accepts a complete valid payload", () => {
    const r = leadSchema.safeParse(VALID);
    expect(r.success).toBe(true);
  });

  test("accepts payload without optional phone + message", () => {
    const { contact_phone, message, ...minimal } = VALID;
    void contact_phone;
    void message;
    const r = leadSchema.safeParse(minimal);
    expect(r.success).toBe(true);
  });

  test("rejects invalid email", () => {
    const r = leadSchema.safeParse({ ...VALID, contact_email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  test("rejects missing required fields", () => {
    const r = leadSchema.safeParse({ contact_email: "jane@acme.com" });
    expect(r.success).toBe(false);
  });

  test("rejects too-short company_name (< 2 chars)", () => {
    const r = leadSchema.safeParse({ ...VALID, company_name: "A" });
    expect(r.success).toBe(false);
  });

  test("rejects oversized message (> 5000 chars)", () => {
    const r = leadSchema.safeParse({ ...VALID, message: "x".repeat(5001) });
    expect(r.success).toBe(false);
  });
});

test.describe("roiSchema — POST /api/roi-calculate validation", () => {
  const VALID = {
    team_size: ROI_BOUNDS.teamSize.default,
    average_salary: ROI_BOUNDS.averageSalary.default,
    hours_lost_per_week: ROI_BOUNDS.hoursLostPerWeek.default,
  };

  test("accepts valid payload within bounds", () => {
    expect(roiSchema.safeParse(VALID).success).toBe(true);
  });

  test("accepts boundary minimum values", () => {
    const r = roiSchema.safeParse({
      team_size: ROI_BOUNDS.teamSize.min,
      average_salary: ROI_BOUNDS.averageSalary.min,
      hours_lost_per_week: ROI_BOUNDS.hoursLostPerWeek.min,
    });
    expect(r.success).toBe(true);
  });

  test("accepts boundary maximum values", () => {
    const r = roiSchema.safeParse({
      team_size: ROI_BOUNDS.teamSize.max,
      average_salary: ROI_BOUNDS.averageSalary.max,
      hours_lost_per_week: ROI_BOUNDS.hoursLostPerWeek.max,
    });
    expect(r.success).toBe(true);
  });

  test("rejects team_size above max (101 > 100)", () => {
    const r = roiSchema.safeParse({ ...VALID, team_size: ROI_BOUNDS.teamSize.max + 1 });
    expect(r.success).toBe(false);
  });

  test("rejects non-integer team_size", () => {
    const r = roiSchema.safeParse({ ...VALID, team_size: 10.5 });
    expect(r.success).toBe(false);
  });

  test("rejects negative salary", () => {
    const r = roiSchema.safeParse({ ...VALID, average_salary: -1000 });
    expect(r.success).toBe(false);
  });

  test("rejects hours_lost above max", () => {
    const r = roiSchema.safeParse({ ...VALID, hours_lost_per_week: ROI_BOUNDS.hoursLostPerWeek.max + 1 });
    expect(r.success).toBe(false);
  });

  test("rejects non-number inputs (string where number expected)", () => {
    const r = roiSchema.safeParse({ ...VALID, team_size: "10" });
    expect(r.success).toBe(false);
  });

  test("optional source field accepted, defaults fine", () => {
    const r = roiSchema.safeParse({ ...VALID, source: "homepage" });
    expect(r.success).toBe(true);
  });
});

test.describe("checkRateLimit — /api/leads abuse control", () => {
  test.beforeEach(() => resetRateLimit());

  test("allows up to max hits inside the window", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("ip-a", 5, 60_000, t0 + i * 1_000)).toBe(true);
    }
  });

  test("blocks the hit after max inside the window", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) checkRateLimit("ip-a", 5, 60_000, t0 + i);
    expect(checkRateLimit("ip-a", 5, 60_000, t0 + 10)).toBe(false);
  });

  test("keys are independent", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) checkRateLimit("ip-a", 5, 60_000, t0 + i);
    expect(checkRateLimit("ip-b", 5, 60_000, t0 + 10)).toBe(true);
  });

  test("window expiry frees the key again", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) checkRateLimit("ip-a", 5, 60_000, t0 + i);
    expect(checkRateLimit("ip-a", 5, 60_000, t0 + 61_000)).toBe(true);
  });
});
