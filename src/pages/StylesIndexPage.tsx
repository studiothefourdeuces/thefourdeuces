import { ArrowUpRight } from "lucide-react";
import { useLang, useT } from "../lang-context";
import { FadeImg, Reveal } from "../ui";
import { styleImage } from "../artists-data";
import { STYLES, getStyles } from "../content";

export default function StylesIndexPage({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const t = useT();
  const lang = useLang();
  const styles = getStyles(lang);
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("ui.ourStyles")}
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            {(() => {
              const parts = t("styles.title").split(" ");
              const last = parts.pop();
              return (
                <>
                  {parts.length ? `${parts.join(" ")} ` : ""}
                  <span className="italic">{last}</span>
                </>
              );
            })()}
          </h1>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {styles.map((s) => {
            const base = STYLES.find((x) => x.slug === s.slug);
            const img = base ? styleImage(base) : "";
            return (
              <Reveal key={s.slug}>
                <button
                  type="button"
                  onClick={() => onNavigate(s.slug)}
                  data-cursor="pointer"
                  className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] text-left transition-colors hover:bg-white/[0.04]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {img && (
                      <FadeImg
                        src={img}
                        alt={`${s.name} tattoo — The Four Deuces Amsterdam`}
                        draggable={false}
                        className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="relative flex flex-1 flex-col justify-between gap-6 px-5 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-serif text-[1.35rem] leading-tight text-white">
                        {s.name}
                      </span>
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-white/45 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                        strokeWidth={1.75}
                      />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.15em] text-white/55 transition group-hover:text-white">
                      {t("ui.readMore")}
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* STYLE PAGE — /{style}-tattoo-amsterdam (SEO landing per style)            */
/* -------------------------------------------------------------------------- */

