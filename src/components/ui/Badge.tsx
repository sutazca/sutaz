import { cn } from "@/lib/utils";

/**
 * Badge — small pill label. Tints map to the palette.
 */
type Tone = "teal" | "navy" | "success" | "muted";

const tones: Record<Tone, string> = {
  teal: "bg-teal-50 text-teal-700 border-teal-200",
  navy: "bg-navy-50 text-navy-500 border-navy-200",
  success: "bg-cure-bg text-cure-text border-emerald-200",
  muted: "bg-slate-100 text-muted border-slate-200",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "teal", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}
