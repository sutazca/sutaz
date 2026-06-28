import { test, expect } from "@playwright/test";

/**
 * Mobile E2E (Pixel 7 viewport). Verifies the mobile nav drawer works and
 * touch targets are large enough, and the hero/sections reflow without
 * horizontal overflow.
 */

test.describe("Mobile layout", () => {
  test("no horizontal scroll on homepage", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hasHScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    });
    expect(hasHScroll, "Homepage has horizontal overflow on mobile").toBeFalsy();
  });

  test("mobile menu opens and navigates", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Hamburger button
    const toggle = page.getByRole("button", { name: /open menu|close menu/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
    // Drawer appears with nav links
    const drawer = page.getByRole("dialog", { name: /mobile navigation/i });
    await expect(drawer).toBeVisible();
    // Services link in drawer
    const servicesLink = drawer.getByRole("link", { name: /^Services$/ });
    await expect(servicesLink).toBeVisible();
    await servicesLink.click();
    await expect(page).toHaveURL(/\/services/);
  });

  test("primary CTA touch target >= 44px height", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const cta = page.getByRole("link", { name: /schedule system audit/i }).first();
    const box = await cta.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height, "Primary CTA too small for touch").toBeGreaterThanOrEqual(44);
  });
});
