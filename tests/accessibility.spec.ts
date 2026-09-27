import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/book", "/artists", "/faq", "/contact", "/about", "/guests"];

for (const path of PAGES) {
  test(`${path} has no critical accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
    const acceptCookies = page.getByRole("button", { name: /accept/i });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(["color-contrast"])
      .exclude(".tfd-marquee")
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    expect(
      critical,
      critical.map((v) => `${v.id}: ${v.description} (${v.nodes.length} nodes)`).join("\n"),
    ).toEqual([]);
  });
}