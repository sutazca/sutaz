import { cn } from "@/lib/utils";

/**
 * Card — bordered surface with the blueprint's card radius (12px) and shadow.
 * Use as a generic container; compose content inside.
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds hover lift + shadow transition. */
  interactive?: boolean;
}

export function Card({ interactive, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-white border border-navy-100 shadow-[var(--shadow-card)]",
        interactive &&
          "transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
      {...rest}
    />
  );
}

/** Card body padding wrapper. */
export function CardBody({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 md:p-8", className)} {...rest} />;
}
