# The Four Deuces — lead capture + WhatsApp automation

The booking / consultation form POSTs the lead to this Cloudflare Worker, which:

1. fans it out to **Telegram** (instant alert), **email** (Resend, optional) and a
   **Google Sheet** (durable record, optional); and
2. (optional) starts a **WhatsApp** conversation from the business number via the
   Meta WhatsApp Cloud API. Secrets stay in the Worker — never in the site/repo.

```
[Form] --fetch--> [Cloudflare Worker] --> Telegram + Email + Google Sheet
                          |
                          +--> WhatsApp: template #1 (welcome) + #2 (ask idea/size/refs)
[Client replies] --webhook--> [Worker] --> WhatsApp: "I'll check with the artists…" + Telegram ping
```

**WhatsApp conversation flow**

1. Client submits the form → **template #1** (instant thank-you / welcome) is sent.
2. Immediately after → **template #2** asks them to describe the idea, size, and
   send 1–4 inspiration images.
3. The client's **first reply** (idea / inspirations) → a free-form thank-you tells
   them we'll consult the artists and come back shortly, and Telegram is pinged.

Steps 1–2 are business-initiated, so WhatsApp **requires approved message
templates** for them. Step 3 is inside the 24-hour window (the client messaged
us), so it's a normal free-form message.

---

## 1. Telegram bot (required — the instant alert)

1. In Telegram, open **@BotFather** → `/newbot` → follow prompts.
   Copy the **bot token** it gives you (looks like `123456:ABC-...`).
2. Send any message to your new bot (so it's allowed to message you back).
3. Get your **chat id**: open
   `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser after messaging
   the bot, and read `result[0].message.chat.id`.
   *(For a group: add the bot to the group, post a message, use the group's
   negative chat id.)*

## 2. Google Sheet (optional — the record)

1. Create a Google Sheet.
2. **Extensions ▸ Apps Script**, paste [`apps-script.gs`](./apps-script.gs), Save.
3. **Deploy ▸ New deployment ▸ Web app** — *Execute as: Me*, *Access: Anyone*.
4. Copy the `/exec` URL → that's your `SHEET_URL`.

## 3. Email (optional — the backup copy)

1. Sign up at [resend.com](https://resend.com), verify your domain
   (`thefourdeuces.nl`), create an **API key** → that's `RESEND_KEY`.
2. Set `MAIL_FROM` to a sender on the verified domain (e.g. `leads@thefourdeuces.nl`)
   and `MAIL_TO` to where you want the copy (e.g. `booking@thefourdeuces.nl`) in
   `wrangler.toml`.

## 4. WhatsApp Cloud API (optional — the automation)

Leave `WHATSAPP_PHONE_NUMBER_ID` empty in `wrangler.toml` to skip WhatsApp
entirely. To enable it:

1. **Meta setup.** In [developers.facebook.com](https://developers.facebook.com)
   create an app (type *Business*), add the **WhatsApp** product, and attach a
   phone number. Note the **Phone number ID** and generate a **permanent access
   token** (System User token with `whatsapp_business_messaging`).
2. **Create two templates** in Meta Business Manager → *WhatsApp Manager ▸
   Message templates*, category **Marketing** or **Utility**, with **no
   variables** in the body:
   - one for the welcome / thank-you (e.g. name it `tfd_welcome`)
   - one asking for the idea, size and 1–4 inspirations (e.g. `tfd_ask_idea`)

   Wait for both to be **Approved**, then put their exact names + language code
   into `wrangler.toml` (`WA_TEMPLATE_WELCOME`, `WA_TEMPLATE_ASK`,
   `WA_TEMPLATE_LANG`).
3. **KV** (needed for step 3 of the flow — the after-reply message):
   ```bash
   npx wrangler kv namespace create WA_STATE
   ```
   Paste the printed `id` into the `[[kv_namespaces]]` block in `wrangler.toml`
   and uncomment it.
4. **Secrets:**
   ```bash
   npx wrangler secret put WHATSAPP_TOKEN         # Meta permanent token
   npx wrangler secret put WHATSAPP_VERIFY_TOKEN  # any string you choose
   ```
   Set `WHATSAPP_PHONE_NUMBER_ID` in `wrangler.toml [vars]`.
5. **Webhook.** After deploying (step 5 below), in the Meta app → *WhatsApp ▸
   Configuration ▸ Webhook*, set:
   - **Callback URL:** your Worker URL (e.g. `https://tfd-leads.<sub>.workers.dev`)
   - **Verify token:** the same string you used for `WHATSAPP_VERIFY_TOKEN`

   Click *Verify and save*, then **Subscribe** to the `messages` field.

## 5. Deploy the Worker

```bash
cd worker
npm install
npx wrangler login

# secrets (paste each value when prompted)
npx wrangler secret put TG_TOKEN
npx wrangler secret put TG_CHAT_ID
npx wrangler secret put RESEND_KEY             # skip if not using email
npx wrangler secret put SHEET_URL              # skip if not using the sheet
npx wrangler secret put WHATSAPP_TOKEN         # skip if not using WhatsApp
npx wrangler secret put WHATSAPP_VERIFY_TOKEN  # skip if not using WhatsApp

# edit wrangler.toml [vars] first (ALLOWED_ORIGIN / MAIL_* / WHATSAPP_*), then:
npm run deploy
```

`wrangler deploy` prints your Worker URL, e.g.
`https://tfd-leads.<your-subdomain>.workers.dev`.

## 6. Point the site at the Worker

In the **frontend** project root, set the build-time env var to that URL:

```bash
# .env  (project root — see .env.example)
VITE_FORM_ENDPOINT=https://tfd-leads.<your-subdomain>.workers.dev
```

Then rebuild/redeploy the site. If you build via GitHub Actions, add
`VITE_FORM_ENDPOINT` as a repository **variable** and pass it to the build step.

## Test

```bash
curl -X POST https://tfd-leads.<sub>.workers.dev \
  -H "content-type: application/json" \
  -d '{"budget":"350","email":"you@example.com","source":"test"}'
```

You should get a Telegram ping, an email (if enabled), and a new sheet row.
Watch live logs with `npm run tail`.

## Notes

- **Honeypot:** the form ships a hidden `hp` field; the Worker silently drops any
  submission where it's filled (kills most bots). No CAPTCHA needed at this scale.
- **GDPR (EU/.nl):** you're storing a personal email. Keep the privacy note by the
  form, use a business inbox, and don't repurpose the data.
- Lock `ALLOWED_ORIGIN` to your real domain once live to cut casual cross-site
  spam (it's not security, just hygiene).
