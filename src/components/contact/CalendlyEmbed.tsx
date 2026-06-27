"use client";

import { InlineWidget } from "react-calendly";

/**
 * CalendlyEmbed — client-only wrapper around react-calendly's InlineWidget.
 *
 * react-calendly relies on browser DOM + Calendly's external script injection,
 * so it cannot render during SSR. This component is loaded via next/dynamic
 * with { ssr: false } from the contact page.
 *
 * The Calendly URL comes from NEXT_PUBLIC_CALENDLY_URL. Until that env var is
 * set, the widget shows a graceful placeholder (no crash).
 */
interface CalendlyEmbedProps {
  url: string;
}

export function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  if (!url) {
    return (
      <div className="flex min-h-[600px] items-center justify-center rounded-card border border-navy-100 bg-background-soft p-8 text-center">
        <div>
          <p className="font-display text-lg font-bold text-navy-500">
            Booking module loading
          </p>
          <p className="mt-2 text-sm text-muted">
            The calendar will appear here once the scheduling link is configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-navy-100">
      <InlineWidget
        url={url}
        styles={{ height: "700px", width: "100%" }}
      />
    </div>
  );
}
