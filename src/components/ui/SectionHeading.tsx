import { cn } from "@/lib/utils";

/**
 * SectionHeading — consistent section title + optional subtitle/eyebrow.
 * Eyebrow uses the display font in teal; title is display font, navy.
 */
interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  /** Renders title inside an <h1> instead of <h2> (use once per page, in hero). */
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
        <p className="font-display text-sm font-bold uppercase tracking-widest text-teal-600">
          {eyebrow}
        </p>
      ) : null}
      <Tag
        className={cn(
          "mt-3 font-display font-extrabold tracking-tight text-navy-500",
          Tag === "h1" ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl",
        )}
      >
        {title}
      </Tag>
      {subtitle ? (
        <p className="mt-4 text-lg text-muted leading-relaxed">{subtitle}</p>
      ) : null}
    </div>
  );
}
