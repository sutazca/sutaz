import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility audit (WCAG 2.2 AA) via axe-core on every page.
 * Fails on any critical or serious violation. Moderate/minor are reported but
 * do not fail the suite (surfaced for awareness).
 *
 * Tags: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa (best practice excluded to
 * keep signal high).
 */
const PAGES = ["/", "/services", "/ecosystems", "/lab", "/contact", "/privacy", "/terms"];

for (const path of PAGES) {
  test.describe(`${path} — axe accessibility`, () => {
    test("no critical/serious WCAG 2.2 AA violations", async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      // Wait for content to hydrate (client components render post-DCL)
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      // Pretty-print any violations for diagnosis
      if (blocking.length > 0) {
        const summary = blocking
          .map(
            (v) =>
              `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))\n` +
              v.nodes
                .slice(0, 3)
                .map((n) => `      → ${n.html.replace(/\s+/g, " ").slice(0, 120)}`)
                .join("\n"),
          )
          .join("\n");
        console.log(`\nAXE violations on ${path}:\n${summary}\n`);
      }

      expect(blocking, `${path}: ${blocking.length} critical/serious a11y violations`).toEqual([]);
    });
  });
}
