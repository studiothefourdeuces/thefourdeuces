import { test, expect } from "@playwright/test";

test("booking flow via body map", async ({ page }) => {
  await page.goto("/book");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

  const acceptCookies = page.getByRole("button", { name: /accept/i });
  if (await acceptCookies.isVisible().catch(() => false)) {
    await acceptCookies.click();
  }

  const bodyMap = page.getByRole("img", { name: /body pain map/i });
  await expect(bodyMap).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(500);
  const box = await bodyMap.boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 3);
  }

  const bookButton = page.getByRole("button", { name: /book this area/i });
  await expect(bookButton).toBeVisible({ timeout: 10000 });
  await bookButton.click();

  const budgetInput = page.getByPlaceholder(/budget/i);
  await expect(budgetInput).toBeVisible({ timeout: 10000 });
  await budgetInput.fill("500");
  await page.getByRole("button", { name: /next/i }).click();

  await expect(page.getByPlaceholder(/whatsapp/i)).toBeVisible({ timeout: 10000 });
});

test("language switcher changes URL prefix", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

  await page.getByRole("button", { name: "Change language" }).click();

  const nlDesktop = page.getByRole("button", { name: "NL", exact: true });
  const nlMobile = page.getByText("Nederlands");

  if (await nlDesktop.isVisible().catch(() => false)) {
    await nlDesktop.click();
  } else {
    await nlMobile.click();
  }

  await expect(page).toHaveURL(/\/nl/);
});