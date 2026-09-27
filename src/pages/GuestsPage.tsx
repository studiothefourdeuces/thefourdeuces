import { ChevronDown } from "lucide-react";
import { useT } from "../lang-context";
import { DownloadCard, Reveal } from "../ui";

export default function GuestsPage() {
  const t = useT();
  const faq = [
    { q: t("guests.faq.supplies.q"), a: t("guests.faq.supplies.a") },
    { q: t("guests.faq.q1"), a: t("guests.faq.a1") },
    { q: t("guests.faq.q2"), a: t("guests.faq.a2") },
    { q: t("guests.faq.q3"), a: t("guests.faq.a3") },
    { q: t("guests.faq.q4"), a: t("guests.faq.a4") },
    { q: t("guests.faq.q5"), a: t("guests.faq.a5") },
    { q: t("guests.faq.q6"), a: t("guests.faq.a6") },
    { q: t("guests.faq.q7"), a: t("guests.faq.a7") },
    { q: t("guests.faq.q8"), a: t("guests.faq.a8") },
  ];
  // Title with the last word italicised (works across languages).
  const titleParts = t("guests.title").split(" ");
  const titleLast = titleParts.pop();
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("guests.kicker")}
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            {titleParts.length ? `${titleParts.join(" ")} ` : ""}
            <span className="italic">{titleLast}</span>
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-white/60">
            {t("guests.intro")}
          </p>
        </Reveal>

        {/* Join our team — sits directly under the studio intro. */}
        <Reveal>
          <div className="mt-12 border-y border-white/10 py-6 text-center">
            <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-white/40">
              {t("guests.emailLabel")}
            </p>
            <p className="text-[15px] leading-relaxed text-white/60">
              {t("guests.emailIntro")}
              <a
                href="mailto:studio@thefourdeuces.nl"
                data-cursor="pointer"
                className="text-white/90 underline underline-offset-4 transition hover:text-white"
              >
                studio@thefourdeuces.nl
              </a>
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12">
            <h2 className="text-center font-serif text-[1.6rem] leading-tight md:text-[2rem]">
              {t("guests.guest.title")}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/60">
              {t("guests.guest.text")}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 border-t border-white/10 pt-12">
            <h2 className="text-center font-serif text-[1.6rem] leading-tight md:text-[2rem]">
              {t("guests.careers.title")}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/60">
              {t("guests.careers.text")}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-12 max-w-3xl">
            <p className="mb-2 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
              {t("guests.faq.title")}
            </p>
            <div className="divide-y divide-white/10 border-t border-white/10">
              {faq.map((item, i) => (
                <details key={i} className="group py-5">
                  <summary
                    data-cursor="pointer"
                    className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] text-white/90 md:text-[18px] [&::-webkit-details-marker]:hidden"
                  >
                    {item.q}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 group-open:rotate-180"
                      strokeWidth={2}
                    />
                  </summary>
                  <p className="mt-3 max-w-4xl text-[15px] leading-relaxed text-white/55">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Downloadable documents (like the FAQ page). */}
        <Reveal>
          <div className="mt-14 border-t border-white/10 pt-14">
            <h2 className="mb-5 text-center text-[12px] uppercase tracking-[0.25em] text-white/40">
              {t("guests.docs.title")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <DownloadCard
                href="/docs/first-aid-guide.pdf"
                title={t("guests.docs.firstaid")}
                sub="PDF · EN"
              />
              <DownloadCard
                href="/docs/hygiene-disinfection-guidelines.pdf"
                title={t("guests.docs.hygiene")}
                sub="PDF · EN"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ PAGE — /faq route                                                      */
/* -------------------------------------------------------------------------- */

// FAQ content lives in ./faq (shared with the build-time schema generator).

