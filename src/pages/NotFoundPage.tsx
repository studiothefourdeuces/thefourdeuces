import { useT } from "../lang-context";
import { CtaBar } from "../ui";
import AsciiFire from "../AsciiFire";

export default function NotFoundPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const t = useT();
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <AsciiFire />
      {/* Vignette so the text stays legible over the flames */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.25) 42%, rgba(5,5,5,0.8) 100%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-white/50">
          {t("nf.kicker")}
        </p>
        <h1 className="font-serif text-[6rem] leading-[0.9] tracking-tight md:text-[10rem]">
          404
        </h1>
        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/70">
          {t("nf.msg")}
        </p>
        <CtaBar
          className="mt-8"
          items={[{ label: t("nf.back"), onClick: () => onNavigate("/") }]}
        />
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* LOADER — preloads the gallery images before revealing the site             */
/* -------------------------------------------------------------------------- */

