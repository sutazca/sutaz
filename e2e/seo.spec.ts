import { test, expect, type APIRequestContext } from "@playwright/test";

/**
 * SEO contract tests — verify the search-engine-facing surfaces are correct
 * and valid: sitemap.xml, robots.txt, and the JSON-LD structured data on each
 * page. A broken sitemap or invalid JSON-LD directly hurts ranking.
 */

// ─── sitemap.xml ───────────────────────────────────────────────────────────
test.describe("sitemap.xml", () => {
  test("is valid XML and references the flagship /services route", async ({
    request,
  }: { request: APIRequestContext }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/xml/);
    const xml = await res.text();
    expect(xml).toMatch(/<\?xml/);
    expect(xml).toContain("<urlset");
    // Critical: the flagship services page MUST be in the sitemap (was missing — fixed).
    expect(xml).toContain("/services");
    expect(xml).toContain("/ecosystems");
    expect(xml).toContain("/lab");
    // /contact is noindex and must NOT appear in the sitemap
    expect(xml).not.toMatch(/<loc>[^<]*\/contact<\/loc>/);
  });

  test("every url entry has the required priority + lastmod", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    // Each <url> should have <loc>, <lastmod>, <priority>
    const urlCount = (xml.match(/<url>/g) || []).length;
    const locCount = (xml.match(/<loc>/g) || []).length;
    const priorityCount = (xml.match(/<priority>/g) || []).length;
    expect(urlCount).toBeGreaterThan(0);
    expect(locCount).toBe(urlCount);
    expect(priorityCount).toBe(urlCount);
  });
});

// ─── robots.txt ────────────────────────────────────────────────────────────
test.describe("robots.txt", () => {
  test("allows all crawlers on / and disallows /contact + /api", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const txt = await res.text();
    expect(txt).toMatch(/User-agent:\s*\*/i);
    expect(txt).toMatch(/Allow:\s*\//i);
    expect(txt).toMatch(/Disallow:\s*\/contact/i);
    expect(txt).toMatch(/Disallow:\s*\/api\//i);
    // Must point to the sitemap
    expect(txt).toMatch(/Sitemap:\s*https?:\/\/[^\s]*\/sitemap\.xml/i);
  });
});

// ─── JSON-LD structured data ───────────────────────────────────────────────
test.describe("JSON-LD structured data", () => {
  test("homepage has valid Organization schema", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const orgs = scripts
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      })
      .filter((j) => j?.["@type"] === "Organization");
    expect(orgs.length, "homepage must have Organization JSON-LD").toBe(1);
    expect(orgs[0].name).toBeTruthy();
    expect(orgs[0].url).toMatch(/^https:\/\/sutaz\.ca/);
    expect(orgs[0].areaServed).toBe("CA");
  });

  test("homepage has valid FAQPage schema with questions", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const faqs = scripts
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      })
      .filter((j) => j?.["@type"] === "FAQPage");
    expect(faqs.length, "homepage must have FAQPage JSON-LD").toBe(1);
    expect(faqs[0].mainEntity.length).toBeGreaterThan(0);
    // Each QA must have question + acceptedAnswer
    for (const qa of faqs[0].mainEntity) {
      expect(qa["@type"]).toBe("Question");
      expect(qa.name).toBeTruthy();
      expect(qa.acceptedAnswer).toBeTruthy();
      expect(qa.acceptedAnswer.text).toBeTruthy();
    }
  });

  test("ecosystems page has Service / OfferCatalog schema", async ({ page }) => {
    await page.goto("/ecosystems", { waitUntil: "domcontentloaded" });
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = scripts
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    const service = parsed.find((j) => j?.["@type"] === "Service");
    expect(service, "ecosystems page must have Service JSON-LD").toBeTruthy();
    expect(service.hasOfferCatalog?.["@type"]).toBe("OfferCatalog");
    // All 5 verticals should be represented as offers
    expect(service.hasOfferCatalog.itemListElement.length).toBeGreaterThanOrEqual(5);
  });

  test("all JSON-LD blocks parse as valid JSON (no syntax errors)", async ({ page }) => {
    for (const path of ["/", "/ecosystems"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      for (const s of scripts) {
        expect(() => JSON.parse(s), `${path} has invalid JSON-LD`).not.toThrow();
      }
    }
  });
});
