import { test, expect } from "@playwright/test";
import { calculateROI, RECOVERY_RATE_ASSUMPTION, AUTOMATION_COST_YEAR_1 } from "@/lib/roi";
import { ROI_BOUNDS } from "@/types/roi";

/**
 * Unit tests for calculateROI — the core business claim (blueprint Section 10.3).
 *
 * Pure function, deterministic, no I/O. Expected values were derived by hand
 * from the documented constants BEFORE writing assertions, so these are a real
 * check of correctness, not a mirror of the implementation.
 *
 * Documented constants (src/lib/roi.ts, sourced from Master Blueprint Sec 5):
 *   IMPLEMENTATION_FEE = 5500, MONTHLY_RETAINER = 1625 → ANNUAL_RETAINER = 19500
 *   AUTOMATION_COST_YEAR_1 = 25000
 *   RECOVERY_RATE_ASSUMPTION = 0.8 (labeled assumption, not from source docs)
 *   WORKING_HOURS_PER_YEAR = 2080
 */

test.describe("calculateROI — math correctness", () => {
  test("constants match the documented blueprint values", () => {
    expect(AUTOMATION_COST_YEAR_1).toBe(25000); // 5500 + (1625 * 12)
    expect(RECOVERY_RATE_ASSUMPTION).toBe(0.8);
  });

  test("default inputs (team=10, salary=55000, hrs=10) produce expected result", () => {
    const r = calculateROI({
      teamSize: ROI_BOUNDS.teamSize.default,
      averageSalary: ROI_BOUNDS.averageSalary.default,
      hoursLostPerWeek: ROI_BOUNDS.hoursLostPerWeek.default,
    });
    // hourly = 55000/2080 = 26.4423; weekly waste = 10*10*26.4423 = 2644.23
    // annual waste = 2644.23 * 52 = 137500; recovery = 110000; net = 110000-25000 = 85000
    // roi = 85000/25000*100 = 340; payback = 25000/(2644.23*0.8) = 11.8
    expect(r.annualWaste).toBe(137500);
    expect(r.automationCost).toBe(25000);
    expect(r.netRecoveryYear1).toBe(85000);
    expect(r.roiPercentage).toBe(340);
    expect(r.paybackWeeks).toBe(11.8);
  });

  test("small team produces NEGATIVE net recovery (honest, not hidden)", () => {
    // team=1, salary=30000, hrs=1: annual waste tiny → net recovery < cost
    const r = calculateROI({ teamSize: 1, averageSalary: 30000, hoursLostPerWeek: 1 });
    expect(r.annualWaste).toBe(750);
    expect(r.netRecoveryYear1).toBe(-24400); // honest negative — UI must display this
    expect(r.roiPercentage).toBeLessThan(0);
  });

  test("large inputs produce sensible large numbers (no overflow/NaN)", () => {
    const r = calculateROI({ teamSize: 100, averageSalary: 150000, hoursLostPerWeek: 40 });
    expect(Number.isFinite(r.annualWaste)).toBe(true);
    expect(Number.isFinite(r.netRecoveryYear1)).toBe(true);
    expect(Number.isFinite(r.roiPercentage)).toBe(true);
    expect(r.netRecoveryYear1).toBeGreaterThan(0);
    expect(r.paybackWeeks).toBeGreaterThan(0);
  });

  test("monotonicity: increasing team size increases annual waste", () => {
    const base = calculateROI({ teamSize: 5, averageSalary: 60000, hoursLostPerWeek: 8 });
    const bigger = calculateROI({ teamSize: 50, averageSalary: 60000, hoursLostPerWeek: 8 });
    expect(bigger.annualWaste).toBeGreaterThan(base.annualWaste);
    expect(bigger.netRecoveryYear1).toBeGreaterThan(base.netRecoveryYear1);
  });

  test("monotonicity: more hours lost → more waste → higher ROI", () => {
    const low = calculateROI({ teamSize: 10, averageSalary: 60000, hoursLostPerWeek: 2 });
    const high = calculateROI({ teamSize: 10, averageSalary: 60000, hoursLostPerWeek: 20 });
    expect(high.annualWaste).toBeGreaterThan(low.annualWaste);
    expect(high.roiPercentage).toBeGreaterThan(low.roiPercentage);
  });

  test("automation cost is constant regardless of inputs", () => {
    const a = calculateROI({ teamSize: 1, averageSalary: 30000, hoursLostPerWeek: 1 });
    const b = calculateROI({ teamSize: 99, averageSalary: 150000, hoursLostPerWeek: 40 });
    expect(a.automationCost).toBe(b.automationCost);
    expect(a.automationCost).toBe(25000);
  });

  test("results are integers (rounded) except paybackWeeks (1 decimal)", () => {
    const r = calculateROI({ teamSize: 7, averageSalary: 72000, hoursLostPerWeek: 6 });
    expect(Number.isInteger(r.annualWaste)).toBe(true);
    expect(Number.isInteger(r.netRecoveryYear1)).toBe(true);
    expect(Number.isInteger(r.roiPercentage)).toBe(true);
    // paybackWeeks rounded to 1 decimal place
    expect(r.paybackWeeks).toBe(Math.round(r.paybackWeeks * 10) / 10);
  });
});
