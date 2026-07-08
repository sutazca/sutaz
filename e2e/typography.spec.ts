import { test, expect } from "@playwright/test";

/**
 * sutaz.ca — v3 typography contract tests.
 * Guards the cinematic type system: the Antonio condensed uppercase display,
 * a hero headline that never overflows 3 lines, and a mobile body ≥16px.
 * Runs against the real server (baseURL in playwright.config.ts). No mocks.
 */

test.describe("Typography (v3)", () => {
  test("hero h1 wraps to at most 3 lines at 1440×900", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();

    const lines = await h1.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      return Math.round(rect.height / lineHeight);
    });
    expect(lines).toBeLessThanOrEqual(3);
  });

  test("body font-size is at least 16px on mobile", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-chrome",
      "mobile body size asserted only on the mobile-chrome project",
    );
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const fontSize = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.body).fontSize),
    );
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });

  test("hero h1 renders in the Antonio display face", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const fontFamily = await h1.evaluate(
      (el) => getComputedStyle(el).fontFamily,
    );
    expect(fontFamily).toContain("Antonio");
  });
});
