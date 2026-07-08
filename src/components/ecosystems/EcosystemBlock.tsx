import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WorkflowWireframe } from "@/components/ecosystems/WorkflowWireframe";

/**
 * EcosystemBlock — shared layout for each vertical on /ecosystems.
 * Dark Engineering-Luxury: glass cards, teal accents, alternating layout.
 */
interface EcosystemBlockProps {
  id: string;
  eyebrow: string;
  body: string;
  features: readonly string[];
  workflowSteps: readonly string[];
  ctaLabel: string;
  reverse?: boolean;
}

export function EcosystemBlock({
  id, eyebrow, body, features, workflowSteps, ctaLabel, reverse = false,
}: EcosystemBlockProps) {
  return (
    <section id={id} className="section-pad scroll-mt-24 border-t border-white/5 first:border-t-0">
      <div className="container-content grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className={reverse ? "md:order-2" : ""}>
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-teal-500" />
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-400">{eyebrow}</p>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">{body}</p>
          <ul className="mt-7 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/20">
                  <Check className="text-teal-300" size={13} aria-hidden />
                </span>
                <span className="text-slate-200">{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9">
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
