import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { useLang, useT } from "../lang-context";
import { ArtistButtons, ArtistRow, FadeImg, FaqList, LazyVideo, PILL, Reveal, RoleLinks, WHATSAPP_URL } from "../ui";
import { ARTISTS, MAX_PORTFOLIO, WORKS_BY_ARTIST } from "../artists-data";
import { getArtistText, getStyles } from "../content";

export default function ArtistsPage({
  active,
  onSelect,
  onOpenWorks,
  onBook,
  onNavigate,
}: {
  active: number;
  onSelect: (i: number) => void;
  onOpenWorks: (artist: number, startIndex: number) => void;
  onBook: (ctx: { artist?: string; bodyPart?: string }) => void;
  onNavigate: (path: string) => void;
}) {
  const t = useT();
  const lang = useLang();
  const M = ARTISTS.length;
  const artist = ARTISTS[active];
  const at = getArtistText(lang, artist.name);
  const role = at?.role ?? artist.role;
  const bio = at?.bio ?? artist.bio;
  const works = (WORKS_BY_ARTIST[active] || []).slice(0, MAX_PORTFOLIO);

  // On mobile the works grid sits well below the fold, so the first two are
  // shown/loaded eagerly (they appear with the heading) instead of waiting for
  // a scroll-reveal. Desktop is unaffected.
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setIsMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Direction of the last switch → the photo slides in from that side (same as
  // the home artist showcase).
  const [dir, setDir] = useState(1);
  const prevRef = useRef(active);
  useEffect(() => {
    let d = active - prevRef.current;
    d = ((d % M) + M) % M;
    if (d > M / 2) d -= M;
    if (d !== 0) setDir(Math.sign(d));
    prevRef.current = active;
  }, [active, M]);

  // On mobile the works grid always shows an even number of tiles (a lone
  // trailing tile on the last row looks unbalanced) — drop the last if odd.
  const worksToShow =
    isMobile && works.length % 2 === 1 ? works.slice(0, -1) : works;

  // FAQ pulled from the style pages this artist works in (deduped by question).
  const artistFaq = useMemo(() => {
    // Order the FAQ by the artist's own listed specialities (their role line)
    // rather than the global style order, so e.g. Darya leads with Anime/Manga
    // and Eugene with Chicano. Styles not named in the role fall to the end.
    const enStyles = getStyles("en");
    const rolePos = (slug: string) => {
      const en = enStyles.find((s) => s.slug === slug);
      if (!en) return 999;
      const idx = artist.role.toLowerCase().indexOf(en.nav.toLowerCase());
      return idx === -1 ? 999 : idx;
    };
    const seen = new Set<string>();
    const out: { q: string; a: string }[] = [];
    const styles = getStyles(lang)
      .filter((s) => s.artists.includes(artist.name))
      .sort((a, b) => rolePos(a.slug) - rolePos(b.slug));
    for (const s of styles) {
      for (const item of s.faq) {
        if (seen.has(item.q)) continue;
        seen.add(item.q);
        out.push({ q: item.q, a: item.a });
      }
    }
    return out;
  }, [lang, artist.name, artist.role]);

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
          {t("ui.ourArtists")}
        </p>
        {/* Title — the artist's name on mobile (matches the profile layout),
            the generic "Artists" heading on desktop. */}
        <motion.h1
          key={`m-${active}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:hidden"
        >
          {artist.name}
        </motion.h1>
        <h1 className="hidden text-center font-serif leading-[0.95] tracking-tight md:block md:text-[4.5rem]">
          {t("ui.artists")}
        </h1>

        {/* ===== MOBILE: name-led text, then a horizontal artist picker ===== */}
        <motion.div
          key={`mt-${active}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 md:hidden"
        >
          <p className="mb-3 text-[12px] uppercase tracking-[0.3em] text-white/40">
            {String(active + 1).padStart(2, "0")} —{" "}
            <RoleLinks role={role} onNavigate={onNavigate} />
          </p>
          <p className="text-[15px] leading-relaxed text-white/60">{bio}</p>
          {artist.since && (
            <p className="mt-4 text-[12px] uppercase tracking-[0.25em] text-white/40">
              {t("ui.tattooingSince")} {artist.since}
            </p>
          )}
        </motion.div>
        {/* Artist picker — horizontal row of avatars, under the bio/since. */}
        <div className="mt-8 md:hidden">
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.25em] text-white/40">
            {t("ui.otherArtists")}
          </p>
          <ArtistRow active={active} onSelect={onSelect} />
        </div>

        {/* ===== DESKTOP showcase — mirrors the home page layout ===== */}
        <div className="mt-14 hidden w-full items-center gap-10 md:flex md:flex-row md:justify-center md:gap-14">
          <div className="shrink-0">
            <ArtistButtons active={active} onSelect={onSelect} />
          </div>

          <div className="w-full max-w-[300px] shrink-0 md:max-w-md">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl ring-1 ring-white/10">
              <motion.img
                key={active}
                src={artist.img}
                alt={artist.name}
                draggable={false}
                initial={{ opacity: 0, x: dir * 80, scale: 1.05 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>

          <motion.div
            key={active}
            className="flex-1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-white/40">
              {String(active + 1).padStart(2, "0")} —{" "}
              <RoleLinks role={role} onNavigate={onNavigate} />
            </p>
            <h2 className="font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4rem]">
              {artist.name}
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60">
              {bio}
            </p>
            {artist.since && (
              <p className="mt-4 text-[12px] uppercase tracking-[0.25em] text-white/40">
                {t("ui.tattooingSince")} {artist.since}
              </p>
            )}
            <div className="mt-8 flex flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onBook({ artist: artist.name })}
                data-cursor="pointer"
                className={PILL(true)}
              >
                {t("ui.bookWith")} {artist.name}
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
                className={PILL(false)}
              >
                {t("book.freeconsult")}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Works grid */}
        <section className="mt-16">
          <h2 className="text-center font-serif text-[1.7rem] leading-[1] tracking-tight md:text-[2.2rem]">
            {t("ui.worksBy")} {artist.name}
          </h2>
          {worksToShow.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {worksToShow.map((w, i) => {
                // First few images load eagerly; the rest lazily as they near
                // the viewport. The tile itself reveals via the shared cascade.
                const eagerImg = i < 4;
                return (
                  <Reveal key={`${active}-${i}`} y={24}>
                    <button
                      type="button"
                      onClick={() => onOpenWorks(active, i)}
                      data-cursor="pointer"
                      aria-label={`${artist.name} — work ${i + 1}`}
                      className="group relative block aspect-square w-full overflow-hidden rounded-xl ring-1 ring-white/10 outline-none"
                    >
                      {w.video ? (
                        <LazyVideo
                          src={w.video}
                          poster={w.img}
                          className="h-full w-full object-cover group-hover:scale-105"
                        />
                      ) : (
                        <FadeImg
                          src={w.img}
                          alt={`${artist.name} — work ${i + 1}`}
                          draggable={false}
                          loading={eagerImg ? "eager" : "lazy"}
                          className="h-full w-full object-cover group-hover:scale-105"
                        />
                      )}
                    </button>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <p className="mt-8 text-center text-[14px] text-white/40">
              {t("ui.portfolioSoon")}
            </p>
          )}

          {/* Book CTA — under the gallery on mobile (desktop shows it in the
              artist column, under "tattooing since"). */}
          <div className="mt-12 flex flex-col items-center gap-3 text-center md:hidden">
            <p className="text-[13px] text-white/45">{t("ui.bookLead")}</p>
            <button
              type="button"
              onClick={() => onBook({ artist: artist.name })}
              data-cursor="pointer"
              className={PILL(true)}
            >
              {t("ui.bookWith")} {artist.name}
            </button>
            <p className="mt-2 text-[13px] text-white/45">{t("book.notsure")}</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className={PILL(false)}
            >
              {t("book.freeconsult")}
            </a>
          </div>

          {/* Style FAQ — under the works on desktop, under the book CTA on
              mobile. Centred, same width as the FAQ page. */}
          {artistFaq.length > 0 && (
            <div className="mx-auto mt-16 max-w-3xl">
              <p className="mb-5 text-center text-[12px] uppercase tracking-[0.25em] text-white/40">
                {t("guests.faq.title")}
              </p>
              <FaqList items={artistFaq} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* REVIEWS — real client DMs floating in two auto-scrolling columns            */
/* -------------------------------------------------------------------------- */

