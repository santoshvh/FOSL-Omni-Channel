import { expect, test } from "@playwright/test";

test("hub role switcher updates navigation", async ({ page }) => {
  await page.goto("http://localhost:3000/vendor");

  await expect(page.getByRole("heading", { name: "Vendor dashboard" })).toBeVisible({
    timeout: 15_000,
  });

  await page.getByLabel("Switch role").selectOption("operator");
  await expect(page).toHaveURL(/\/operator/);
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();

  await page.getByLabel("Switch role").selectOption("creator");
  await expect(page).toHaveURL(/\/creator/);
  await expect(page.getByRole("link", { name: "Collections" })).toBeVisible();
});
