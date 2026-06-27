"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  formatValue?: (n: number) => string;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * Slider — dark-theme accessible range input.
 * Teal thumb on a navy track, mono value readout.
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
        <label htmlFor={id} className="text-sm font-medium text-slate-400">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-base font-bold text-white tabular-nums">
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
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-teal-500 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-400 [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgb(13_148_136_/_0.2)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-teal-400"
      />
    </div>
  );
}
