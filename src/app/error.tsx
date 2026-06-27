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
    <section className="container-content flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-navy-500">
        Something went wrong.
      </h1>
      <p className="mt-3 max-w-md text-muted">
        An unexpected error occurred. You can try again, or head back to safety.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-muted">
          ref: {error.digest}
        </p>
      ) : null}
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Home
        </Button>
      </div>
    </section>
  );
}
