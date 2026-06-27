import { cn } from "@/lib/utils";

/**
 * SectionHeading — editorial section title with monospace eyebrow + teal rule.
 * Fraunces headline, slate-400 subtitle.
 */
interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <div className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
          <span className="h-px w-6 bg-teal-500" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-400">
            {eyebrow}
          </p>
        </div>
      ) : null}
      <Tag
        className={cn(
          "mt-4 text-white text-balance",
          Tag === "h1"
            ? "text-display text-4xl md:text-6xl"
            : "font-display text-3xl font-bold tracking-tight md:text-4xl",
        )}
      >
        {title}
      </Tag>
      {subtitle ? (
        <p className="mt-4 text-lg leading-relaxed text-slate-400 text-pretty">{subtitle}</p>
      ) : null}
    </div>
  );
}
