import { expect, test } from "@playwright/test";

test.describe("Catalogue Exploration & Search", () => {
  test("filters and searches products interactively", async ({ page }) => {
    await page.goto("/catalogue");

    // Verify catalogue heading
    await expect(page.locator("h1")).toContainText(/Hardware|Catalogue/i);

    // Test search filter
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill("POS");
      await page.waitForTimeout(500); // debounce
      await expect(page).toHaveURL(/query=POS/);
    }

    // Verify product cards are displayed
    const productCards = page.locator(
      "article, [data-testid='product-card'], a[href^='/catalogue/']",
    );
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    // Navigate to a product detail page via View Details
    const viewDetailsLink = page.getByRole("link", { name: "View Details" }).first();
    await expect(viewDetailsLink).toBeVisible({ timeout: 5000 });
    const href = (await viewDetailsLink.getAttribute("href")) || "";
    expect(href).toBeTruthy();

    await Promise.all([page.waitForURL(new RegExp(href)), viewDetailsLink.click()]);

    // Verify product detail page elements
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("button:has-text('Request Quote')")).toBeVisible();
  });
});
