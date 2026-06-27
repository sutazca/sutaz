/**
 * Zod validation schemas for all API request bodies.
 * Single source of truth — routes import from here so validation can't drift
 * from the documented contract.
 */
import { z } from "zod";
import { ROI_BOUNDS } from "@/types/roi";

/** Lead capture — POST /api/leads (inbound contact form). */
export const leadSchema = z.object({
  company_name: z.string().min(2).max(200),
  contact_name: z.string().min(1).max(200),
  contact_email: z.string().email().max(320),
  contact_phone: z.string().max(40).optional(),
  industry: z.string().min(2).max(80),
  automation_interest: z.string().min(2).max(80),
  message: z.string().max(5000).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** ROI calculation — POST /api/roi-calculate. Bounds match the sliders. */
export const roiSchema = z.object({
  team_size: z
    .number()
    .int()
    .min(ROI_BOUNDS.teamSize.min)
    .max(ROI_BOUNDS.teamSize.max),
  average_salary: z
    .number()
    .int()
    .min(ROI_BOUNDS.averageSalary.min)
    .max(ROI_BOUNDS.averageSalary.max),
  hours_lost_per_week: z
    .number()
    .int()
    .min(ROI_BOUNDS.hoursLostPerWeek.min)
    .max(ROI_BOUNDS.hoursLostPerWeek.max),
  source: z.string().max(100).optional(),
});

export type RoiInput = z.infer<typeof roiSchema>;
