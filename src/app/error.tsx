"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Root error boundary — catches unhandled runtime errors in any route,
 * logs them, and offers recovery. Must be a client component.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In prod this would also surface to Sentry once configured.
    console.error("[sutaz.ca] route error:", error);
  }, [error]);

  return (
    <section className="container-content relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden py-20 text-center">
      {/* Atmospheric imagery (Phase 3 §6 special states) — graded deep-space nebula */}
      <img
        src="/sections/deep-space-graded.jpg"
        alt=""
        aria-hidden
        className="section-media pointer-events-none absolute inset-0 h-full w-full"
      />
      <div className="section-scrim absolute inset-0" aria-hidden />
      <div className="relative">
        <h1 className="font-display text-2xl font-bold text-white">
          Something went wrong.
        </h1>
        <p className="mt-3 max-w-md text-slate-300">
          An unexpected error occurred. You can try again, or head back to safety.
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-xs text-slate-400">
            ref: {error.digest}
          </p>
        ) : null}
        <div className="mt-8 flex gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button href="/" variant="secondary">
            Home
          </Button>
        </div>
      </div>
    </section>
  );
}
