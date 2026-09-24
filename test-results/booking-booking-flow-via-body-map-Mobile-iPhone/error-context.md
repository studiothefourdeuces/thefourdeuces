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
    - link "@the.four.deuces" [ref=e6]:
      - /url: https://instagram.com/the.four.deuces
  - button "Search" [ref=e12]
  - button "Change language" [ref=e16]
  - button "Open menu" [ref=e20]
  - main [ref=e23]:
    - generic [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e26]:
          - heading "Tap a body area" [level=2] [ref=e27]
          - paragraph [ref=e28]: Select any part of the body to see how much it typically hurts and how long a session tends to take. Switch between front and back with the toggle.
        - generic [ref=e31]:
          - generic [ref=e32]:
            - button "Front" [ref=e33]
            - button "Back" [ref=e34]
          - img "body pain map" [ref=e37]:
            - generic [ref=e38] [cursor=pointer]
            - generic [ref=e39] [cursor=pointer]
            - generic [ref=e40] [cursor=pointer]
            - generic [ref=e41] [cursor=pointer]
            - generic [ref=e42] [cursor=pointer]
            - generic [ref=e43] [cursor=pointer]
            - generic [ref=e44] [cursor=pointer]
            - generic [ref=e45] [cursor=pointer]
            - generic [ref=e46] [cursor=pointer]
            - generic [ref=e47] [cursor=pointer]
            - generic [ref=e48] [cursor=pointer]
            - generic [ref=e49] [cursor=pointer]
            - generic [ref=e50] [cursor=pointer]
            - generic [ref=e51] [cursor=pointer]
            - generic [ref=e52] [cursor=pointer]
            - generic [ref=e53] [cursor=pointer]
            - generic [ref=e54] [cursor=pointer]
            - generic [ref=e55] [cursor=pointer]
            - generic [ref=e56] [cursor=pointer]
            - generic [ref=e57] [cursor=pointer]
            - generic [ref=e58] [cursor=pointer]
            - generic [ref=e59] [cursor=pointer]
            - generic [ref=e60] [cursor=pointer]
            - generic [ref=e61] [cursor=pointer]
            - generic [ref=e62] [cursor=pointer]
            - generic [ref=e63] [cursor=pointer]
            - generic [ref=e64] [cursor=pointer]
            - generic [ref=e65] [cursor=pointer]
            - generic [ref=e66] [cursor=pointer]
            - generic [ref=e67] [cursor=pointer]
            - generic [ref=e68] [cursor=pointer]
      - generic [ref=e70]:
        - paragraph [ref=e71]: Not sure yet? No commitment.
        - link "Request free consultation" [ref=e72]:
          - /url: https://wa.me/31645052222
  - contentinfo [ref=e73]:
    - generic [ref=e74]:
      - generic [ref=e75]:
        - generic [ref=e76]:
          - paragraph [ref=e77]: Discover
          - list [ref=e78]:
            - listitem [ref=e79]:
              - button "Home" [ref=e80]
            - listitem [ref=e81]:
              - button "Artists" [ref=e82]
            - listitem [ref=e83]:
              - button "Reviews" [ref=e84]
            - listitem [ref=e85]:
              - button "Sponsors" [ref=e86]
        - generic [ref=e87]:
          - paragraph [ref=e88]: Studio
          - list [ref=e89]:
            - listitem [ref=e90]:
              - button "About" [ref=e91]
            - listitem [ref=e92]:
              - button "FAQ" [ref=e93]
            - listitem [ref=e94]:
              - button "Guests & Careers" [ref=e95]
            - listitem [ref=e96]:
              - button "Contact" [ref=e97]
        - generic [ref=e98]:
          - paragraph [ref=e99]: Tattoo styles
          - list [ref=e100]:
            - listitem [ref=e101]:
              - button "All styles" [ref=e102]
            - listitem [ref=e103]:
              - button "Realism" [ref=e104]
            - listitem [ref=e105]:
              - button "Chicano" [ref=e106]
            - listitem [ref=e107]:
              - button "Fine Line" [ref=e108]
            - listitem [ref=e109]:
              - button "Anime" [ref=e110]
        - list [ref=e112]:
          - listitem [ref=e113]:
            - button "Fluid Line" [ref=e114]
          - listitem [ref=e115]:
            - button "Ornamental" [ref=e116]
          - listitem [ref=e117]:
            - button "Freehand" [ref=e118]
          - listitem [ref=e119]:
            - button "Minimal" [ref=e120]
          - listitem [ref=e121]:
            - button "Botanical" [ref=e122]
      - generic [ref=e123]:
        - paragraph [ref=e124]: The Four Deuces
        - paragraph [ref=e125]:
          - text: Designed & developed by
          - link "aerdt" [ref=e126]:
            - /url: https://aerdt.xyz/
        - generic [ref=e127]:
          - button "Terms & Privacy" [ref=e128]
          - generic [ref=e129]: © 2020–2026 The Four Deuces
  - generic [ref=e131]:
    - paragraph [ref=e135]:
      - text: We use cookies to understand how you use our site. Accept to help us improve.
      - button "Privacy Policy" [ref=e136]
    - button "Decline" [ref=e137]
    - button "Accept" [ref=e138]
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