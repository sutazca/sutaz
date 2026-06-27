import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sutaz.ca";

/**
 * robots.ts — Next generates /robots.txt from this. All crawlers allowed;
 * the /contact booking page is disallowed (it's a conversion surface, not
 * SEO content, and carries the Calendly embed).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/contact", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
