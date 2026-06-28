import type { MetadataRoute } from "next";

/**
 * sitemap.ts — Next generates /sitemap.xml from this at build/request time.
 * All public marketing routes (excludes /contact — noindex booking page, and
 * /privacy /terms are legal pages, low crawl priority).
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sutaz.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ecosystems`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/lab`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
