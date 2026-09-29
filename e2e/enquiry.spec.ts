import { expect, test } from "@playwright/test";

test.describe("Commercial Enquiry Workflow", () => {
  test("submits a valid commercial enquiry end-to-end and receives reference", async ({ page }) => {
    await page.goto("/contact");

    // Wait for the contact form to be interactive
    const nameInput = page.locator('input[id="contact-name"]');
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    // Fill out the formal quotation form
    await nameInput.fill("Alexander Hayes");
    await page.fill('input[id="contact-company"]', "Apex Retail Logistics");
    await page.fill('input[id="contact-email"]', "alex.hayes@apexlogistics.co.uk");
    await page.fill('input[id="contact-phone"]', "+44 7911 889900");
    await page.fill(
      'textarea[id="contact-message"]',
      "Looking to deploy 12 Fametech Android POS units across 3 sites.",
    );

    // Ensure consent checkbox is checked
    const consentCheckbox = page.locator('input[id="consent"]');
    if (!(await consentCheckbox.isChecked())) {
      await consentCheckbox.check();
    }

    // Submit the form
    const submitBtn = page.locator('button[type="submit"]:has-text("Send Formal Enquiry")');
    await submitBtn.click();

    // Verify submission success state and reference heading
    await expect(page.getByRole("heading", { name: "Enquiry Received" })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("Reference:")).toBeVisible();
  });

  test("rejects an invalid enquiry with validation errors", async ({ page }) => {
    await page.goto("/contact");

    const submitBtn = page.locator('button[type="submit"]:has-text("Send Formal Enquiry")');
    await expect(submitBtn).toBeVisible({ timeout: 10000 });

    // Attempt to submit empty form
    await submitBtn.click();

    // Verify validation error message appears
    await expect(page.getByText("Name must be at least 2 characters")).toBeVisible({
      timeout: 5000,
    });
  });
});
