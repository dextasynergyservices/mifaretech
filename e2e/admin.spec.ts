import { expect, test } from "@playwright/test";

test.describe("Admin Authentication & Role Guarding", () => {
  test("unauthenticated visitors are redirected to /admin/login from protected routes", async ({
    page,
  }) => {
    // Attempt to access protected admin dashboard directly
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);

    // Attempt to access protected users management
    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/admin\/login/);

    // Verify login page elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("rejects invalid login credentials gracefully", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill('input[type="email"]', "fakeadmin@mifaretech.co.uk");
    await page.fill('input[type="password"]', "WrongPassword123!");
    await page.click('button[type="submit"]');

    // Verify error notification or inline error
    await expect(
      page
        .locator("text=Invalid")
        .or(page.locator("text=failed"))
        .or(page.locator(".toast, [role='status']")),
    ).toBeVisible({ timeout: 10000 });
  });
});
