// Cloudflare Worker — receives hero-form leads from the static site and fans
// them out to Telegram (instant alert), email (Resend), and a Google Sheet
// (durable record). Secrets live here, never in the public frontend/repo.
//
// Secrets (set with `wrangler secret put NAME`):
//   TG_TOKEN     Telegram bot token from @BotFather
//   TG_CHAT_ID   your chat / group id
//   RESEND_KEY   Resend API key            (optional — email skipped if unset)
//   SHEET_URL    Apps Script web-app URL   (optional — sheet skipped if unset)
//
// Plain vars (in wrangler.toml [vars]):
//   ALLOWED_ORIGIN   e.g. https://thefourdeuces.nl   ("*" allows any origin)
//   MAIL_TO          inbox that receives the email copy
//   MAIL_FROM        verified Resend sender, e.g. leads@thefourdeuces.nl
//   NOTIFY_HANDLE    Telegram @handle to greet in the alert

const corsHeaders = (origin) => ({
  "access-control-allow-origin": origin || "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
});

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "content-type": "application/json" },
  });

export default {
  async fetch(req, env) {
    const allow = env.ALLOWED_ORIGIN || "*";

    if (req.method === "OPTIONS")
      return new Response(null, { headers: corsHeaders(allow) });
    if (req.method !== "POST")
      return json({ ok: false, error: "method not allowed" }, 405, allow);

    let data;
    try {
      data = await req.json();
    } catch {
      return json({ ok: false, error: "bad request" }, 400, allow);
    }

    // Honeypot — a real user never fills this. Pretend success, do nothing.
    if (data.hp) return json({ ok: true }, 200, allow);

    const budget = String(data.budget || "").replace(/\D/g, "").slice(0, 20);
    const email = String(data.email || "").slice(0, 120);
    const instagram = String(data.instagram || "")
      .replace(/^@+/, "")
      .slice(0, 60);
    const source = String(data.source || "hero").slice(0, 40);
    const name = String(data.name || "").slice(0, 120);
    const message = String(data.message || "").slice(0, 2000);
    // Optional booking context: a chosen artist and/or a chosen body area.
    const artist = String(data.artist || "").slice(0, 60);
    const bodyPart = String(data.bodyPart || "").slice(0, 60);
    // The contact form collects an email; the hero and Book-page bookings
    // collect an Instagram handle (+ optional artist / body area / message).
    const isContact = source === "contact";

    // Which kind of booking is this? Drives the notification wording.
    const bookingKind = artist
      ? `with ${artist}`
      : bodyPart
        ? `placement: ${bodyPart}`
        : "general";

    if (isContact) {
      if (!/.+@.+\..+/.test(email))
        return json({ ok: false, error: "invalid email" }, 422, allow);
    } else if (!instagram) {
      return json({ ok: false, error: "missing instagram" }, 422, allow);
    }

    const when = new Date().toISOString();

    // Fan out. Promise.allSettled so one dead channel never breaks the others
    // and every failure still surfaces in `wrangler tail` logs.
    const tasks = [];

    if (env.TG_TOKEN && env.TG_CHAT_ID) {
      const handle = env.NOTIFY_HANDLE || "@sashamolchanova02";
      // Booking heading reflects the kind: a specific artist, a body area, or
      // a general request.
      const bookingHeading = artist
        ? `New Booking Request — with ${artist}`
        : bodyPart
          ? `New Booking Request — ${bodyPart}`
          : "New Booking Request";
      const text = isContact
        ? `Hi ${handle} 🖤 New Contact Message:\n\n` +
          (name ? `🙂 Name: ${name}\n` : "") +
          `📧 Email: ${email}` +
          (message ? `\n\n💬 ${message}` : "")
        : `Hi ${handle} 🖤 ${bookingHeading}:\n\n` +
          (budget ? `💸 Budget: €${budget}\n` : "") +
          `📸 Instagram: https://instagram.com/${instagram}` +
          (artist ? `\n🎨 Artist: ${artist}` : "") +
          (bodyPart ? `\n📍 Placement: ${bodyPart}` : "") +
          (message ? `\n\n💬 ${message}` : "");

      const body = {
        chat_id: env.TG_CHAT_ID,
        text,
        disable_web_page_preview: true,
      };
      // One-tap button that opens the DM thread with the client in Instagram
      // (Meta's official click-to-chat link). Bookings only — contact has no
      // Instagram handle.
      if (!isContact && instagram) {
        body.reply_markup = {
          inline_keyboard: [
            [
              {
                text: `💬 Message @${instagram} on Instagram`,
                url: `https://ig.me/m/${instagram}`,
              },
            ],
          ],
        };
      }
      tasks.push(
        fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
      );
    }

    if (env.RESEND_KEY && env.MAIL_TO && env.MAIL_FROM) {
      tasks.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            authorization: `Bearer ${env.RESEND_KEY}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            from: env.MAIL_FROM,
            to: env.MAIL_TO,
            reply_to: email || undefined,
            subject: isContact
              ? `New contact message${name ? ` — ${name}` : ""}`
              : `New booking (${bookingKind}) — €${budget || "—"}`,
            text: isContact
              ? `Name: ${name}\nEmail: ${email}\nMessage:\n${message}\nTime: ${when}`
              : `Budget: €${budget || "—"}\nInstagram: @${instagram} (https://instagram.com/${instagram})` +
                (artist ? `\nArtist: ${artist}` : "") +
                (bodyPart ? `\nPlacement: ${bodyPart}` : "") +
                (message ? `\nMessage:\n${message}` : "") +
                `\nSource: ${source}\nTime: ${when}`,
          }),
        }),
      );
    }

    if (env.SHEET_URL) {
      tasks.push(
        fetch(env.SHEET_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            when,
            budget,
            email,
            instagram,
            artist,
            bodyPart,
            message,
            source,
          }),
        }),
      );
    }

    await Promise.allSettled(tasks);
    return json({ ok: true }, 200, allow);
  },
};
