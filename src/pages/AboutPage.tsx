import { type ReactNode } from "react";
import { useLang, useT } from "../lang-context";
import { PILL, Reveal, STUDIO_MAPS_URL, TextRing, withAddressLink } from "../ui";
import { getAbout } from "../content";

export default function AboutPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ABOUT = getAbout(useLang());
  const t = useT();

  // Section headings are centred; body copy stays left. Transport & parking
  // sub-headings match the size of "How to find us".
  const subHead =
    "mt-10 border-t border-white/10 pt-10 text-center font-serif text-[2rem] leading-[1] tracking-tight md:text-[2.6rem]";
  const para = "mt-5 text-[15px] leading-relaxed text-white/60";

  const renderIntro = () =>
    ABOUT.intro.map((p, i) => (
      <p key={i} className="mt-6 text-[15px] leading-relaxed text-white/60">
        {p}
      </p>
    ));

  const renderFindUs = () => (
    <>
      <h2 className="text-center font-serif text-[2rem] leading-[1] tracking-tight md:text-[2.6rem]">
        {ABOUT.locationTitle}
      </h2>
      {ABOUT.location.map((p, i) => (
        <p key={`loc-${i}`} className="mt-5 text-[15px] leading-relaxed text-white/60">
          {withAddressLink(p)}
        </p>
      ))}
      <div className="mt-8 flex justify-center">
        <a href={STUDIO_MAPS_URL} target="_blank" rel="noopener noreferrer" data-cursor="pointer" className={PILL(false)}>
          {t("about.navigate")}
        </a>
      </div>
      <p className={subHead}>{ABOUT.transportTitle}</p>
      {ABOUT.transport.map((p, i) => (
        <p key={`tr-${i}`} className={para}>
          {p}
        </p>
      ))}
      <p className={subHead}>{ABOUT.parkingTitle}</p>
      {ABOUT.parking.map((p, i) => (
        <p key={`pk-${i}`} className={para}>
          {p}
        </p>
      ))}
    </>
  );

  // One cell of the desktop 2×2 grid: centred heading + left body copy.
  const cell = (
    title: string,
    paras: string[],
    mapper?: (s: string) => ReactNode,
  ) => (
    <>
      <h2 className="text-center font-serif text-[2rem] leading-[1] tracking-tight md:text-[2.6rem]">
        {title}
      </h2>
      {paras.map((p, i) => (
        <p key={i} className="mt-4 text-[15px] leading-relaxed text-white/60">
          {mapper ? mapper(p) : p}
        </p>
      ))}
    </>
  );

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        {/* Title */}
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {ABOUT.kicker}
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            The Four <span className="italic">Deuces</span>
          </h1>
        </Reveal>

        {/* Why clients choose us — rings, desktop only, directly under the
            title. */}
        <Reveal className="hidden md:block">
          <div className="mt-14 grid justify-items-center gap-10 sm:grid-cols-3">
            {ABOUT.why.map((w, i) => (
              <TextRing
                key={w.h}
                text={w.h}
                diameter={260}
                reverse={i % 2 === 1}
                spinSeconds={30 + i * 4}
                color="rgba(255,255,255,0.3)"
              >
                <p className="text-[12.5px] leading-relaxed text-white/70">
                  {w.p}
                </p>
              </TextRing>
            ))}
          </div>
        </Reveal>

        {/* ===== MOBILE: stacked — story, then How to find us ===== */}
        <div className="md:hidden">
          <Reveal>{renderIntro()}</Reveal>
          <Reveal>
            <section className="mt-12 border-t border-white/10 pt-12">
              {renderFindUs()}
            </section>
          </Reveal>
        </div>

        {/* ===== DESKTOP: the four sections in a 2×2 grid (About · How to find
            us / Public transport · Car & parking), split by an interior cross
            of divider lines. ===== */}
        <Reveal className="hidden md:block">
          <div className="mt-16 grid grid-cols-2 border-t border-white/10 pt-14">
            <div className="border-b border-r border-white/10 pb-14 pr-14">
              {cell(t("nav.about"), ABOUT.intro)}
            </div>
            <div className="border-b border-white/10 pb-14 pl-14">
              {cell(ABOUT.locationTitle, ABOUT.location, withAddressLink)}
            </div>
            <div className="border-r border-white/10 pt-14 pr-14">
              {cell(ABOUT.transportTitle, ABOUT.transport)}
            </div>
            <div className="pt-14 pl-14">
              {cell(ABOUT.parkingTitle, ABOUT.parking)}
            </div>
          </div>
        </Reveal>

        {/* Guests & Careers — unchanged, Apply is now a button. */}
        <Reveal>
          <section className="mt-16 border-t border-white/10 pt-8 text-center">
            <h2 className="font-serif text-[1.8rem] leading-tight tracking-tight md:text-[2.2rem]">
              {(() => {
                const parts = t("contact.careers.link").split(" ");
                const last = parts.pop();
                return (
                  <>
                    {parts.length ? `${parts.join(" ")} ` : ""}
                    <span className="italic">{last}</span>
                  </>
                );
              })()}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">
              {t("about.careersText")}
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => onNavigate("/guests")}
                data-cursor="pointer"
                className={PILL(false)}
              >
                {t("about.apply")}
              </button>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* STYLES INDEX — /styles: a grid of every tattoo style, each linking out to   */
/* its own landing page.                                                        */
/* -------------------------------------------------------------------------- */

