import { type FormEvent, useState } from "react";
import { Check } from "lucide-react";
import { useT } from "../lang-context";
import { PILL, Reveal, STUDIO_MAPS_URL, withAddressLink } from "../ui";
import { trackLead } from "../analytics";

const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

export default function ContactPage({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const emailValid = /.+@.+\..+/.test(email);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !emailValid || !message.trim()) {
      setError(t("contact.error"));
      return;
    }
    setError("");
    setSent(true);
    trackLead({ source: "contact" });
    if (FORM_ENDPOINT) {
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message, hp, source: "contact" }),
      }).catch(() => {});
    }
  };

  const field =
    "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none transition focus:border-white/40";

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("contact.kicker")}
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            {t("contact.title")}
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-white/60">
            {t("contact.intro.pre")}
            <button
              onClick={() => onNavigate("/book")}
              data-cursor="pointer"
              className="text-white underline underline-offset-4 transition hover:text-white/70"
            >
              {t("contact.intro.link")}
            </button>
            {t("contact.intro.post")}
          </p>
        </Reveal>

        <Reveal>
        {sent ? (
          <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
              <Check className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <h2 className="font-serif text-[2rem] leading-[1.05] md:text-[2.6rem]">
              {t("contact.done.a")}{" "}
              <span className="italic">{t("contact.done.b")}</span>
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-white/40">
              {t("contact.done.note")}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("contact.ph.name")}
              data-cursor="text"
              className={field}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("contact.ph.email")}
              data-cursor="text"
              className={field}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("contact.ph.message")}
              rows={5}
              data-cursor="text"
              className={`${field} resize-none`}
            />
            {/* Honeypot — hidden from users; bots that fill it are dropped. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            {error && <p className="text-[13px] text-red-400">{error}</p>}
            <p className="mt-2 text-center text-[13px] text-white/40 md:text-left">
              {t("contact.agree.send")}
              <button
                type="button"
                onClick={() => onNavigate("/terms")}
                data-cursor="pointer"
                className="text-white/70 underline underline-offset-4 transition hover:text-white"
              >
                {t("legal.terms")}
              </button>
              .
            </p>
            <button
              type="submit"
              data-cursor="pointer"
              className={`${PILL(true)} self-center md:self-start`}
            >
              {t("contact.send")}
            </button>
          </form>
        )}

          <div className="mt-14 border-t border-white/10 pt-6 text-center md:text-left">
  <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-white/40">
    {t("contact.partnerships")}
  </p>
  <p className="text-[15px] leading-relaxed text-white/60">
    {t("contact.partnerships.note")}
  </p>
  <a
    href="mailto:studio@thefourdeuces.nl"
    data-cursor="pointer"
    className="mt-5 inline-block text-[15px] leading-relaxed text-white underline underline-offset-4 transition hover:text-white/70"
  >
    studio@thefourdeuces.nl
  </a>
</div>

<div className="mt-8 border-t border-white/10 pt-6 text-center md:text-left">
  <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-white/40">
    {t("contact.careers")}
  </p>
  <p className="mt-4 text-[15px] leading-relaxed text-white/60">
    {t("contact.careers.pre")}
    <button
      onClick={() => onNavigate("/guests")}
      data-cursor="pointer"
      className="text-white underline underline-offset-4 transition hover:text-white/70"
    >
      {t("contact.careers.link")}
    </button>
    {t("contact.careers.post")}
  </p>
</div>

<div className="mt-8 border-t border-white/10 pt-6 text-center md:text-left">
  <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-white/40">
    {t("contact.location")}
  </p>
  <p className="text-[15px] leading-relaxed text-white/60">
    {withAddressLink(t("contact.location.text"))}
  </p>
  <div className="mt-6 flex justify-center md:hidden">
    <a
      href={STUDIO_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="pointer"
      className={PILL(false)}
    >
      {t("about.navigate")}
    </a>
  </div>
</div>
        </Reveal>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* GUESTS PAGE — /guests route: guest-artist terms + careers / recruiting     */
/* -------------------------------------------------------------------------- */

