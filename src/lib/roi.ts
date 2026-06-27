/**
 * ROI calculation logic — isomorphic (runs on client for live preview AND on
 * the server in /api/roi-calculate for the persisted result).
 *
 * Source: blueprint Section 10.3.
 *
 * IMPORTANT — ASSUMPTIONS (not from the source documents, flagged):
 *   - recoveryRate = 0.80 (automation recovers 80% of wasted time).
 *     The documents imply near-complete elimination but give NO specific
 *     percentage. 80% is a conservative choice and is surfaced to the user
 *     as a labeled assumption in the UI. Do not present it as verified fact.
 *   - implementationFee / monthlyRetainer are mid-points of the ranges in
 *     Master Blueprint Doc Section 5 (Appendix A): $3,500-$7,500+ and
 *     $750-$2,500+/mo. These ARE sourced.
 */
import type { ROIInputs, ROIResult } from "@/types/roi";

/** Constants sourced from Master Blueprint Doc Section 5 (Appendix A). */
const IMPLEMENTATION_FEE = 5500; // mid-point of $3,500-$7,500+
const MONTHLY_RETAINER = 1625; // mid-point of $750-$2,500+/mo
const ANNUAL_RETAINER = MONTHLY_RETAINER * 12;
const WORKING_HOURS_PER_YEAR = 2080; // 52 weeks × 40 hours

/**
 * ASSUMPTION (not in source docs): fraction of wasted time recovered by
 * automation. Surfaced to the user as a labeled assumption.
 */
export const RECOVERY_RATE_ASSUMPTION = 0.8;

/**
 * Total Year-1 cost of the automation build + retainer.
 * (Sourced ranges, mid-point values.)
 */
export const AUTOMATION_COST_YEAR_1 = IMPLEMENTATION_FEE + ANNUAL_RETAINER;

/**
 * Pure calculation. No side effects, no I/O — deterministic & testable.
 * Inputs are assumed already clamped to ROI_BOUNDS (validation lives in the
 * zod schema at the API boundary).
 */
export function calculateROI(inputs: ROIInputs): ROIResult {
  const { teamSize, averageSalary, hoursLostPerWeek } = inputs;

  const hourlyRate = averageSalary / WORKING_HOURS_PER_YEAR;
  const weeklyWaste = teamSize * hoursLostPerWeek * hourlyRate;
  const annualWaste = weeklyWaste * 52;

  const automationCost = AUTOMATION_COST_YEAR_1;
  const annualRecovery = annualWaste * RECOVERY_RATE_ASSUMPTION;

  const netRecoveryYear1 = annualRecovery - automationCost;
  const roiPercentage =
    automationCost > 0 ? (netRecoveryYear1 / automationCost) * 100 : 0;
  const weeklyRecovery = weeklyWaste * RECOVERY_RATE_ASSUMPTION;
  const paybackWeeks = weeklyRecovery > 0 ? automationCost / weeklyRecovery : 0;

  return {
    annualWaste: Math.round(annualWaste),
    automationCost,
    netRecoveryYear1: Math.round(netRecoveryYear1),
    roiPercentage: Math.round(roiPercentage),
    paybackWeeks: Math.round(paybackWeeks * 10) / 10,
  };
}
