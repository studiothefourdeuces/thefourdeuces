import { ChevronDown } from "lucide-react";
import { useLang, useT } from "../lang-context";
import { FadeImg, Reveal } from "../ui";
import { ARTISTS, styleImage } from "../artists-data";
import { STYLES, getStyles } from "../content";

export default function StylePage({
  style,
  onNavigate,
  onOpenArtist,
}: {
  style: (typeof STYLES)[number];
  onNavigate: (path: string) => void;
  onOpenArtist: (i: number) => void;
}) {
  const t = useT();
  const lang = useLang();
  // Title with its last word in italic (matching the /terms heading style).
  const words = style.title.trim().split(" ");
  const lastWord = words.pop();
  const leadWords = words.join(" ");

  // Artists mapped to this style (explicit list), and a representative work to
  // use as the style's photo (in black & white).
  const styleArtistIdxs = style.artists
    .map((name) => ARTISTS.findIndex((a) => a.name === name))
    .filter((i) => i >= 0);
  const photo = styleImage(style);

  // Artist avatars — shown to the left of the photo on desktop, and again (with
  // a heading) below the copy on mobile.
  const artistAvatars = styleArtistIdxs.map((i) => (
    <button
      key={i}
      type="button"
      onClick={() => onOpenArtist(i)}
      data-cursor="pointer"
      aria-label={ARTISTS[i].name}
      className="group flex flex-col items-center gap-1.5"
    >
      <span className="h-14 w-14 overflow-hidden rounded-full ring-1 ring-white/20 transition group-hover:ring-white/60">
        <img
          src={ARTISTS[i].img}
          alt={ARTISTS[i].name}
          draggable={false}
          className="h-full w-full object-cover"
        />
      </span>
      <span className="text-[11px] text-white/50 transition group-hover:text-white">
        {ARTISTS[i].name}
      </span>
    </button>
  ));

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("ui.ourStyles")}
          </p>
        </Reveal>

        {/* Showcase — mirrors the /artists layout: artist avatars + photo + text */}
        <div className="mt-10 flex w-full flex-col items-center gap-8 md:flex-row md:justify-center md:gap-14">
          {styleArtistIdxs.length > 0 && (
            <Reveal className="hidden shrink-0 md:block">
              <div className="flex flex-col items-center justify-center gap-4">
                {artistAvatars}
              </div>
            </Reveal>
          )}

          <Reveal className="w-full max-w-[300px] shrink-0 md:max-w-md">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl ring-1 ring-white/10">
              {photo ? (
                <FadeImg
                  src={photo}
                  alt={`${style.name} tattoo — The Four Deuces Amsterdam`}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                />
              ) : null}
            </div>
          </Reveal>

          <Reveal className="flex-1" y={24}>
            <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40 md:text-left">
              {style.kicker}
            </p>
            <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-left md:text-[4rem]">
              {leadWords ? leadWords + " " : ""}
              <span className="italic">{lastWord}</span>
            </h1>
            {style.lead.map((p, i) => (
              <p
                key={i}
                className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60"
              >
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        {/* Mobile-only: artists who work in this style, below the copy */}
        {styleArtistIdxs.length > 0 && (
          <Reveal className="md:hidden">
            <section className="mt-14">
              <h2 className="mb-5 text-center text-[12px] uppercase tracking-[0.25em] text-white/40">
                {t("ui.madeByArtists")}
              </h2>
              <div className="flex flex-row flex-wrap items-start justify-center gap-6">
                {artistAvatars}
              </div>
            </section>
          </Reveal>
        )}

        {/* Other styles — All styles first, then the rest. */}
        <Reveal>
          <section className="mt-16">
            <h2 className="mb-5 text-center text-[12px] uppercase tracking-[0.25em] text-white/40">
              {t("ui.otherStyles")}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate("/styles")}
                data-cursor="pointer"
                className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/75 transition hover:border-white/40 hover:bg-white/5"
              >
                {t("nav.styles")}
              </button>
              {getStyles(lang)
                .filter((s) => s.slug !== style.slug)
                .map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => onNavigate(s.slug)}
                    data-cursor="pointer"
                    className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/75 transition hover:border-white/40 hover:bg-white/5"
                  >
                    {s.nav}
                  </button>
                ))}
            </div>
          </section>
        </Reveal>

        {/* FAQ (also emitted as FAQPage structured data at build time) */}
        <Reveal>
          <section className="mx-auto mt-20 max-w-3xl">
            <h2 className="text-center font-serif text-[1.9rem] leading-[1] tracking-tight md:text-[2.4rem]">
              {t("ui.qa")}
            </h2>
            <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {style.faq.map((item, i) => (
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
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Hidden SEO copy — keyword-rich text for search engines (e.g.
            "realism tattoo Amsterdam"); visually hidden (sr-only) so it has no
            effect on the layout. */}
        <section className="sr-only">
          <h2>{style.name} Tattoo in Amsterdam — The Four Deuces</h2>
          <p>
            The Four Deuces is a tattoo studio in Amsterdam's Museum Quarter
            (Amsterdam Zuid), at Van Baerlestraat 126H, 1071 BD Amsterdam,
            specialising in {style.name.toLowerCase()} tattoos. We create
            fully custom, highly detailed work and welcome clients from across
            Amsterdam, the Netherlands and abroad.
          </p>
          <p>
            {style.aliases
              .map((a) => `${a} tattoo Amsterdam`)
              .join(" · ")}
          </p>
          <p>
            Book a {style.nav.toLowerCase()} tattoo in Amsterdam, or a free
            consultation, at The Four Deuces — Van Baerlestraat 126H, near
            Museumplein, the Van Gogh Museum and Vondelpark.
          </p>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* APP                                                                        */
/* -------------------------------------------------------------------------- */

// Eased scroll to a section — a longer, gentler glide than the browser's
// native smooth scroll (easeInOutCubic).
