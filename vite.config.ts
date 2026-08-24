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
import { FAQ_ITEMS } from "./src/faq";

const SITE = "https://thefourdeuces.nl";

// FAQPage structured data for Google rich results (built from the shared FAQ).
const faqSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

// Real HTML files per route so GitHub Pages serves them with a 200 status
// (not the SPA 404 fallback) and Google can index them with the right
// title / description / canonical. The SPA still hydrates and takes over.
const ROUTES: {
  slug: string;
  title: string;
  description: string;
  headExtra?: string;
}[] = [
  {
    slug: "book",
    title: "Book a Tattoo Appointment | The Four Deuces Amsterdam",
    description:
      "Book your tattoo at The Four Deuces in Amsterdam, plus answers to common tattoo questions — does it hurt, healing time, aftercare, pricing, age and more.",
    headExtra: `<script type="application/ld+json">${faqSchema}</script>`,
  },
  {
    slug: "artists",
    title: "Our Tattoo Artists | The Four Deuces Amsterdam",
    description:
      "Meet the resident and guest tattoo artists at The Four Deuces, Amsterdam — realism, chicano, fine line, anime, watercolour and blackwork. See their portfolios.",
  },
  {
    slug: "contact",
    title: "Contact | The Four Deuces Tattoo Studio Amsterdam",
    description:
      "Get in touch with The Four Deuces tattoo studio in Amsterdam — bookings, collaborations, press and general questions.",
  },
  {
    slug: "terms",
    title: "Terms & Privacy | The Four Deuces",
    description:
      "Terms & Conditions and Privacy Policy for The Four Deuces tattoo studio in Amsterdam.",
  },
];

function replaceTag(html: string, re: RegExp, replacement: string): string {
  return re.test(html) ? html.replace(re, replacement) : html;
}

function prerenderRoutes() {
  return {
    name: "prerender-routes",
    closeBundle() {
      const indexPath = resolve(__dirname, "dist/index.html");
      if (!existsSync(indexPath)) return;
      const base = readFileSync(indexPath, "utf8");

      for (const r of ROUTES) {
        const url = `${SITE}/${r.slug}`;
        let html = base;
        html = replaceTag(
          html,
          /<title>[\s\S]*?<\/title>/,
          `<title>${r.title}</title>`,
        );
        html = replaceTag(
          html,
          /<meta[^>]*name="description"[^>]*>/,
          `<meta name="description" content="${r.description}" />`,
        );
        html = replaceTag(
          html,
          /<link[^>]*rel="canonical"[^>]*>/,
          `<link rel="canonical" href="${url}" />`,
        );
        html = replaceTag(
          html,
          /<meta[^>]*property="og:title"[^>]*>/,
          `<meta property="og:title" content="${r.title}" />`,
        );
        html = replaceTag(
          html,
          /<meta[^>]*property="og:description"[^>]*>/,
          `<meta property="og:description" content="${r.description}" />`,
        );
        html = replaceTag(
          html,
          /<meta[^>]*property="og:url"[^>]*>/,
          `<meta property="og:url" content="${url}" />`,
        );
        if (r.headExtra)
          html = html.replace("</head>", `    ${r.headExtra}\n  </head>`);

        const outDir = resolve(__dirname, "dist", r.slug);
        mkdirSync(outDir, { recursive: true });
        writeFileSync(resolve(outDir, "index.html"), html);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // GitHub Pages has no server-side routing. Serving a copy of index.html
      // as 404.html lets any deep link (and page refreshes) still load the app,
      // which then renders the right route client-side.
      name: "spa-404-fallback",
      closeBundle() {
        if (existsSync("dist/index.html"))
          copyFileSync("dist/index.html", "dist/404.html");
      },
    },
    prerenderRoutes(),
  ],
});
