"use client";

import dynamic from "next/dynamic";

/**
 * CalendlyPanel — client wrapper that dynamically loads the Calendly embed
 * with ssr:false. In Next.js 16, next/dynamic with { ssr: false } is only
 * permitted inside a Client Component, so this wrapper isolates that
 * constraint from the server-rendered contact page.
 */
const CalendlyEmbed = dynamic(
  () => import("@/components/contact/CalendlyEmbed").then((m) => m.CalendlyEmbed),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[600px] animate-pulse rounded-card bg-background-soft" />
    ),
  },
);

export function CalendlyPanel({ url }: { url: string }) {
  return <CalendlyEmbed url={url} />;
}
