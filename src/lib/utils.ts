/**
 * Class-name combiner: merges Tailwind classes intelligently so later
 * classes win over earlier ones (e.g. `cn("px-4", "px-6")` -> "px-6").
 *
 * @packageDocumentation
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as CAD currency with no decimals.
 * Used by the ROI calculator and counters.
 */
export function formatCAD(value: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with thousands separators (no currency symbol).
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-CA").format(Math.round(value));
}
