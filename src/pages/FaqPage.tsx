import { ChevronDown } from "lucide-react";
import { useLang, useT } from "../lang-context";
import { DownloadCard, Reveal } from "../ui";
import { getFaq } from "../faq";

export default function FaqPage({
  onNavigate,
  onConsult,
}: {
  onNavigate: (path: string) => void;
  onConsult: () => void;
}) {
  const t = useT();
  const lang = useLang();
  // Answers may contain [[BOOK]] / [[CONSULT]] tokens that render as links.
  const renderAnswer = (text: string) =>
    text.split(/(\[\[BOOK\]\]|\[\[CONSULT\]\])/).map((part, i) => {
      if (part === "[[BOOK]]")
        return (
          <button
            key={i}
            type="button"
            onClick={() => onNavigate("/book")}
            data-cursor="pointer"
            className="text-white underline underline-offset-4 transition hover:text-white/70"
          >
            {t("faq.bookLink")}
          </button>
        );
      if (part === "[[CONSULT]]")
        return (
          <button
            key={i}
            type="button"
            onClick={onConsult}
            data-cursor="pointer"
            className="text-white underline underline-offset-4 transition hover:text-white/70"
          >
            {t("faq.consultCta")}
          </button>
        );
      return part;
    });
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("faq.kicker")}
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            FAQ
          </h1>
        </Reveal>

        <Reveal>
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 border-y border-white/10">
          {getFaq(lang).map((item, i) => (
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
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/55">
                {renderAnswer(item.a)}
              </p>
            </details>
          ))}
        </div>
        </Reveal>

        <Reveal>
        <div className="mt-14">
          <h2 className="mb-1 text-center text-[12px] uppercase tracking-[0.25em] text-white/40">
            {t("faq.downloads")}
          </h2>
          <p className="mb-5 text-center text-[13px] text-white/40">{t("faq.dutchOnly")}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <DownloadCard
              href="/docs/nazorginstructie-tatoeage.pdf"
              title={t("faq.dl.aftercare")}
              sub="Nazorginstructie · PDF · NL"
            />
            <DownloadCard
              href="/docs/informatie-risicos-tatoeage-pmu.pdf"
              title={t("faq.dl.risks")}
              sub="Risico-informatie (PMU) · PDF · NL"
            />
          </div>
        </div>
        </Reveal>

        <Reveal>
          <p className="mt-14 border-t border-white/10 pt-6 text-[14px] text-white/50">
            {t("faq.foot.pre")}
            <button
              onClick={() => onNavigate("/terms")}
              data-cursor="pointer"
              className="text-white underline underline-offset-4 transition hover:text-white/70"
            >
              {t("legal.terms")}
            </button>
            {t("faq.foot.lang")}.
          </p>
        </Reveal>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* TERMS & CONDITIONS PAGE — /terms route (not in the menu)                   */
/* -------------------------------------------------------------------------- */

