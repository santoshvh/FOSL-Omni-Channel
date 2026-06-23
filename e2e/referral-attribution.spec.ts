import { expect, test } from "@playwright/test";

const ATTRIBUTION_COOKIE = "fosl_creator_ref";

async function acceptMarketingCookies(page: import("@playwright/test").Page) {
  const dialog = page.getByRole("dialog", { name: "Cookie preferences" });
  if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
    await dialog.getByRole("checkbox", { name: "Marketing" }).check();
    await dialog.getByRole("button", { name: "Save preferences" }).click();
    await expect(dialog).toBeHidden({ timeout: 5000 });
  }
}

test("referral attribution cookie is set from ?ref=", async ({ page }) => {
  await page.goto("/products/prod_1?ref=alex");
  await acceptMarketingCookies(page);

  await expect
    .poll(async () => {
      const cookies = await page.context().cookies();
      return cookies.find((cookie) => cookie.name === ATTRIBUTION_COOKIE)?.value;
    })
    .toBeTruthy();

  const cookies = await page.context().cookies();
  const value = cookies.find((cookie) => cookie.name === ATTRIBUTION_COOKIE)?.value ?? "";
  expect(decodeURIComponent(value)).toContain("alex");
});
