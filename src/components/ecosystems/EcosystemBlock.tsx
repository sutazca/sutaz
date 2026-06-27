import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WorkflowWireframe } from "@/components/ecosystems/WorkflowWireframe";

/**
 * EcosystemBlock — shared layout for each vertical on /ecosystems.
 * Left: eyebrow + verbatim body + features + CTA. Right: animated wireframe.
 * Alternates row direction by index for visual rhythm.
 */
interface EcosystemBlockProps {
  id: string;
  eyebrow: string;
  /** VERBATIM body copy (sourced in src/lib/content.ts). */
  body: string;
  features: readonly string[];
  workflowSteps: readonly string[];
  ctaLabel: string;
  /** 0 = image right, 1 = image left (for alternating layout). */
  reverse?: boolean;
}

export function EcosystemBlock({
  id,
  eyebrow,
  body,
  features,
  workflowSteps,
  ctaLabel,
  reverse = false,
}: EcosystemBlockProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-navy-100 py-16 md:py-20 first:border-t-0"
    >
      <div className="container-content grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className={reverse ? "md:order-2" : ""}>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-teal-600">
            {eyebrow}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-navy-400">{body}</p>

          <ul className="mt-6 space-y-2.5">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check
                  className="mt-0.5 shrink-0 text-teal-600"
                  size={20}
                  aria-hidden
                />
                <span className="text-navy-500">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href="/contact">{ctaLabel}</Button>
          </div>
        </div>

        <div className={reverse ? "md:order-1" : ""}>
          <WorkflowWireframe steps={workflowSteps} id={id} />
        </div>
      </div>
    </section>
  );
}
