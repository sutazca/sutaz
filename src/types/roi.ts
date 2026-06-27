/**
 * Shared types for the ROI calculator.
 * Used by the client component, the calculation module, and the API route.
 */

export interface ROIInputs {
  teamSize: number;
  averageSalary: number;
  hoursLostPerWeek: number;
}

export interface ROIResult {
  annualWaste: number;
  automationCost: number;
  netRecoveryYear1: number;
  roiPercentage: number;
  paybackWeeks: number;
}

/** Slider bounds (blueprint Section 10.2). */
export const ROI_BOUNDS = {
  teamSize: { min: 1, max: 100, step: 1, default: 10 },
  averageSalary: { min: 30000, max: 150000, step: 5000, default: 55000 },
  hoursLostPerWeek: { min: 1, max: 40, step: 1, default: 10 },
} as const;
