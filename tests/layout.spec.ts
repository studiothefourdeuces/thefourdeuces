import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "narrow (320px)", width: 320, height: 720 },
  { name: "wide (2560px)", width: 2560, height: 1440 },
];

for (const vp of VIEWPORTS) {
  test(`no horizontal overflow at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow, `Page has horizontal scroll at ${vp.width}px`).toBe(false);
  });

  test(`/faq no horizontal overflow at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/faq");
    await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow, `Page has horizontal scroll at ${vp.width}px`).toBe(false);
  });

  test(`/book no horizontal overflow at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/book");
    await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow, `Page has horizontal scroll at ${vp.width}px`).toBe(false);
  });
}

test("images have no broken sources", async ({ page }) => {
  const failed: string[] = [];
  page.on("requestfailed", (req) => {
    if (req.resourceType() === "image") failed.push(req.url());
  });

  await page.goto("/artists");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(2000);

  expect(failed, `Failed image requests: ${failed.join(", ")}`).toEqual([]);
});

test("text does not overflow its container on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

  const overflowingElements = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("h1, h2, h3, p, button, a"));
    return all
      .filter((el) => !el.closest(".sr-only"))
      .filter((el) => !el.closest("#reviews"))
      .filter((el) => !el.closest("footer"))
      .filter((el) => el.scrollWidth > el.clientWidth + 4)
      .map((el) => el.textContent?.trim().slice(0, 50))
      .filter(Boolean);
  });

  expect(
    overflowingElements,
    `Overflowing text elements: ${overflowingElements.join(" | ")}`,
  ).toEqual([]);
});