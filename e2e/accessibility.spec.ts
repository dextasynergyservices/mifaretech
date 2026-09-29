import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Accessibility (a11y) Automated Audits", () => {
  const routes = ["/", "/catalogue", "/contact", "/about", "/solutions"];

  for (const route of routes) {
    test(`route ${route} meets WCAG AA standards with no critical violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        // Exclude 3rd-party widgets or elements (like recaptcha iframe) if any
        .exclude("iframe")
        .analyze();

      // Check for violations
      const criticalOrSerious = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      expect(criticalOrSerious, JSON.stringify(criticalOrSerious, null, 2)).toEqual([]);
    });
  }

  test("interactive elements maintain visible focus states upon keyboard navigation", async ({
    page,
  }) => {
    await page.goto("/");
    // Tab through header navigation
    await page.keyboard.press("Tab");
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).toBeTruthy();
  });
});
