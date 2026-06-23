import { expect, test } from "@playwright/test";

async function dismissCookieBanner(page: import("@playwright/test").Page) {
  const dialog = page.getByRole("dialog", { name: "Cookie preferences" });
  if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
    await dialog.getByRole("button", { name: "Necessary only" }).click();
    await expect(dialog).toBeHidden({ timeout: 5000 });
  }
}

test("checkout happy path — physical product", async ({ page }) => {
  await page.goto("/products/prod_1");
  await dismissCookieBanner(page);

  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.goto("/checkout");
  await dismissCookieBanner(page);

  await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();

  await page.getByLabel("Email *").fill("buyer-physical@example.com");
  await page.getByRole("button", { name: "Continue to shipping" }).click();

  await page.getByLabel("Full name *").fill("Test Buyer");
  await page.getByLabel("Address line 1 *").fill("123 Main St");
  await page.getByLabel("City *").fill("Austin");
  await page.getByLabel("Postal code *").fill("78701");
  await page.getByRole("button", { name: "Continue to payment" }).click();

  await page.getByRole("checkbox", { name: /Terms of Service/i }).check();
  const payButton = page.getByRole("button", { name: /Pay / });
  await expect(payButton).toBeEnabled({ timeout: 15_000 });
  await payButton.click();

  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible({
    timeout: 30_000,
  });
});
