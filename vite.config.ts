import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { type FaqItem, getFaq } from "./src/faq";
import { STYLES, getAbout, getStyles } from "./src/content";
import { LANGS, langPath, htmlLangFor, t } from "./src/i18n";

const SITE = "https://thefourdeuces.nl";
const LANG_CODES = LANGS.map((l) => l.code);

// FAQPage structured data for Google rich results. Strip the UI-only link
// tokens ([[BOOK]] / [[CONSULT]]) to plain text so the data stays clean.
const stripTokens = (s: string) =>
  s.replace(/\[\[BOOK\]\]/g, "Booking page").replace(/\s*\[\[CONSULT\]\]/g, "");

const faqSchemaFrom = (items: FaqItem[]) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: stripTokens(f.q),
      acceptedAnswer: { "@type": "Answer", text: stripTokens(f.a) },
    })),
  });

// Language-agnostic list of prerendered pages ("" = home). Per language, the
// title / description / FAQ schema are resolved from the localised data.
const STYLE_SLUGS = STYLES.map((s) => s.slug.replace(/^\//, ""));
const BASE_SLUGS = [
  "",
  "book",
  "faq",
  "artists",
  "contact",
  "terms",
  "about",
  "guests",
  "styles",
  ...STYLE_SLUGS,
];

type Meta = { title: string; description: string; faqSchema?: string };

function metaFor(slug: string, lang: string): Meta {
  switch (slug) {
    case "":
      return { title: t(lang, "title.home"), description: t(lang, "desc.home") };
    case "book":
      return { title: t(lang, "title.book"), description: t(lang, "desc.book") };
    case "artists":
      return {
        title: t(lang, "title.artists"),
        description: t(lang, "desc.artists"),
      };
    case "faq":
      return {
        title: t(lang, "title.faq"),
        description: t(lang, "desc.faq"),
        faqSchema: faqSchemaFrom(getFaq(lang)),
      };
    case "contact":
      return {
        title: t(lang, "title.contact"),
        description: t(lang, "desc.contact"),
      };
    case "terms":
      return {
        title: t(lang, "title.terms"),
        description: t(lang, "desc.terms"),
      };
    case "guests":
      return {
        title: t(lang, "title.guests"),
        description: t(lang, "desc.guests"),
      };
    case "styles":
      return {
        title: t(lang, "title.styles"),
        description: t(lang, "desc.styles"),
      };
    case "about": {
      const a = getAbout(lang);
      return { title: a.seoTitle, description: a.seoDescription };
    }
    default: {
      const st = getStyles(lang).find((s) => s.slug === `/${slug}`);
      if (st)
        return {
          title: st.seoTitle,
          description: st.seoDescription,
          faqSchema: faqSchemaFrom(st.faq),
        };
      return { title: t(lang, "title.home"), description: t(lang, "desc.home") };
    }
  }
}

// Absolute URL for a page in a language (English is un-prefixed).
const urlFor = (lang: string, slug: string) =>
  `${SITE}${langPath(lang, slug === "" ? "/" : `/${slug}`)}`;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s: string) => esc(s).replace(/"/g, "&quot;");

function replaceTag(html: string, re: RegExp, replacement: string): string {
  return re.test(html) ? html.replace(re, replacement) : html;
}

// hreflang alternates for a page (every language + x-default → English).
function hreflangLinks(slug: string): string {
  const links = LANG_CODES.map(
    (code) =>
      `<link rel="alternate" hreflang="${htmlLangFor(code)}" href="${urlFor(code, slug)}" />`,
  );
  links.push(
    `<link rel="alternate" hreflang="x-default" href="${urlFor("en", slug)}" />`,
  );
  return links.join("\n    ");
}

function prerenderRoutes() {
  return {
    name: "prerender-routes",
    closeBundle() {
      const indexPath = resolve(__dirname, "dist/index.html");
      if (!existsSync(indexPath)) return;
      const base = readFileSync(indexPath, "utf8");

      for (const lang of LANG_CODES) {
        for (const slug of BASE_SLUGS) {
          const { title, description, faqSchema } = metaFor(slug, lang);
          const url = urlFor(lang, slug);
          let html = base;

          html = replaceTag(html, /<html[^>]*>/, `<html lang="${htmlLangFor(lang)}">`);
          html = replaceTag(
            html,
            /<title>[\s\S]*?<\/title>/,
            `<title>${esc(title)}</title>`,
          );
          html = replaceTag(
            html,
            /<meta[^>]*name="description"[^>]*>/,
            `<meta name="description" content="${escAttr(description)}" />`,
          );
          html = replaceTag(
            html,
            /<link[^>]*rel="canonical"[^>]*>/,
            `<link rel="canonical" href="${url}" />`,
          );
          html = replaceTag(
            html,
            /<meta[^>]*property="og:title"[^>]*>/,
            `<meta property="og:title" content="${escAttr(title)}" />`,
          );
          html = replaceTag(
            html,
            /<meta[^>]*property="og:description"[^>]*>/,
            `<meta property="og:description" content="${escAttr(description)}" />`,
          );
          html = replaceTag(
            html,
            /<meta[^>]*property="og:url"[^>]*>/,
            `<meta property="og:url" content="${url}" />`,
          );

          const head =
            `    ${hreflangLinks(slug)}\n` +
            (faqSchema
              ? `    <script type="application/ld+json">${faqSchema}</script>\n`
              : "");
          html = html.replace("</head>", `${head}  </head>`);

          // English home is the base dist/index.html itself.
          const rel = langPath(lang, slug === "" ? "/" : `/${slug}`);
          const outDir = resolve(__dirname, "dist", rel.replace(/^\//, ""));
          mkdirSync(outDir, { recursive: true });
          writeFileSync(resolve(outDir, "index.html"), html);
        }
      }

      // SPA fallback: 404.html mirrors the (English) home shell.
      copyFileSync(
        resolve(__dirname, "dist/index.html"),
        resolve(__dirname, "dist/404.html"),
      );

      // sitemap.xml — every page in every language, cross-linked with hreflang.
      const today = new Date().toISOString().slice(0, 10);
      const urls = LANG_CODES.flatMap((lang) =>
        BASE_SLUGS.map((slug) => {
          const alts = [...LANG_CODES, "x-default"]
            .map((code) => {
              const hl = code === "x-default" ? "x-default" : htmlLangFor(code);
              const href = urlFor(code === "x-default" ? "en" : code, slug);
              return `    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}" />`;
            })
            .join("\n");
          return (
            `  <url>\n    <loc>${urlFor(lang, slug)}</loc>\n    <lastmod>${today}</lastmod>\n` +
            `${alts}\n  </url>`
          );
        }),
      ).join("\n");
      writeFileSync(
        resolve(__dirname, "dist/sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
          `${urls}\n</urlset>\n`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderRoutes()],
});
