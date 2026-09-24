# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> booking flow via body map
- Location: tests/booking.spec.ts:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /book this area/i })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - link "@the.four.deuces" [active] [ref=e6]:
        - /url: https://instagram.com/the.four.deuces
      - generic [ref=e12]: Follow @the.four.deuces on Instagram — Fresh ink, flash drops, and behind-the-chair moments — Tap through to see our latest work — Follow @the.four.deuces on Instagram — Fresh ink, flash drops, and behind-the-chair moments — Tap through to see our latest work — Follow @the.four.deuces on Instagram — Fresh ink, flash drops, and behind-the-chair moments — Tap through to see our latest work — Follow @the.four.deuces on Instagram — Fresh ink, flash drops, and behind-the-chair moments — Tap through to see our latest work —
  - button "Search" [ref=e14]
  - button "Change language" [ref=e19]: EN
  - button "Open menu" [ref=e22]
  - main [ref=e25]:
    - generic [ref=e26]:
      - generic [ref=e27]:
        - paragraph [ref=e28]: Book an appointment
        - heading "Book" [level=1] [ref=e29]
        - paragraph [ref=e30]: Start by choosing the area you'd like tattooed. Then add your budget and your WhatsApp. We'll be in touch to arrange the rest.
      - generic [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e35]:
            - button "Front" [ref=e36]
            - button "Back" [ref=e37]
          - img "body pain map" [ref=e40]
        - generic [ref=e73]:
          - heading "Tap a body area" [level=3] [ref=e74]
          - paragraph [ref=e75]: Select any part of the body to see how much it typically hurts and how long a session tends to take. Switch between front and back with the toggle.
      - generic [ref=e77]:
        - paragraph [ref=e78]: Not sure yet? No commitment.
        - link "Request free consultation" [ref=e79]:
          - /url: https://wa.me/31645052222
  - contentinfo [ref=e80]:
    - generic [ref=e81]:
      - generic [ref=e82]:
        - generic [ref=e83]:
          - paragraph [ref=e84]: Discover
          - list [ref=e85]:
            - listitem [ref=e86]:
              - button "Home" [ref=e87]
            - listitem [ref=e88]:
              - button "Artists" [ref=e89]
            - listitem [ref=e90]:
              - button "Reviews" [ref=e91]
            - listitem [ref=e92]:
              - button "Sponsors" [ref=e93]
        - generic [ref=e94]:
          - paragraph [ref=e95]: Studio
          - list [ref=e96]:
            - listitem [ref=e97]:
              - button "About" [ref=e98]
            - listitem [ref=e99]:
              - button "FAQ" [ref=e100]
            - listitem [ref=e101]:
              - button "Guests & Careers" [ref=e102]
            - listitem [ref=e103]:
              - button "Contact" [ref=e104]
        - generic [ref=e105]:
          - paragraph [ref=e106]: Tattoo styles
          - list [ref=e107]:
            - listitem [ref=e108]:
              - button "All styles" [ref=e109]
            - listitem [ref=e110]:
              - button "Realism" [ref=e111]
            - listitem [ref=e112]:
              - button "Chicano" [ref=e113]
            - listitem [ref=e114]:
              - button "Fine Line" [ref=e115]
            - listitem [ref=e116]:
              - button "Anime" [ref=e117]
        - list [ref=e119]:
          - listitem [ref=e120]:
            - button "Fluid Line" [ref=e121]
          - listitem [ref=e122]:
            - button "Ornamental" [ref=e123]
          - listitem [ref=e124]:
            - button "Freehand" [ref=e125]
          - listitem [ref=e126]:
            - button "Minimal" [ref=e127]
          - listitem [ref=e128]:
            - button "Botanical" [ref=e129]
      - generic [ref=e130]:
        - paragraph [ref=e131]: The Four Deuces
        - paragraph [ref=e132]:
          - text: Designed & developed by
          - link "aerdt" [ref=e133]:
            - /url: https://aerdt.xyz/
        - generic [ref=e134]:
          - button "Terms & Privacy" [ref=e135]
          - generic [ref=e136]: ·
          - generic [ref=e137]: © 2020–2026 The Four Deuces
  - generic [ref=e139]:
    - paragraph [ref=e143]:
      - text: We use cookies to understand how you use our site. Accept to help us improve.
      - button "Privacy Policy" [ref=e144]
    - button "Decline" [ref=e145]
    - button "Accept" [ref=e146]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("booking flow via body map", async ({ page }) => {
  4  |   await page.goto("/book");
  5  |   await page.waitForLoadState("networkidle");
  6  | 
  7  |   const bodyPath = page.locator("svg path").first();
  8  |   await bodyPath.click({ force: true });
  9  | 
> 10 |   await page.getByRole("button", { name: /book this area/i }).click();
     |                                                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  11 | 
  12 |   await expect(page.getByPlaceholder(/budget/i)).toBeVisible();
  13 |   await page.getByPlaceholder(/budget/i).fill("500");
  14 |   await page.getByRole("button", { name: /next/i }).click();
  15 | 
  16 |   await expect(page.getByPlaceholder(/whatsapp/i)).toBeVisible();
  17 |   await page.getByPlaceholder(/whatsapp/i).fill("+31612345678");
  18 | });
  19 | 
  20 | test("language switcher changes URL prefix", async ({ page }) => {
  21 |   await page.goto("/");
  22 |   await page.getByRole("button", { name: "NL" }).click();
  23 |   await page.getByText("Nederlands").click();
  24 |   await expect(page).toHaveURL(/\/nl/);
  25 | });
```