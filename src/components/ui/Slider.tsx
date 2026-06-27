"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Formats the displayed value (e.g. currency). */
  formatValue?: (n: number) => string;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * Slider — accessible range input with label + live value readout.
 * Styled via Tailwind `[&::-webkit-slider-thumb]` arbitrary variants and the
 * accent-color property for cross-browser support.
 */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue = (n) => n.toLocaleString("en-CA"),
  onChange,
  className,
}: SliderProps) {
  const id = useId();
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-navy-400">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-lg font-bold text-navy-500 tabular-nums">
          {formatValue(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={formatValue(value)}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-navy-100 accent-teal-600 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-600 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-teal-600"
      />
    </div>
  );
}
