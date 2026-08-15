import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync, existsSync } from "node:fs";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // GitHub Pages has no server-side routing. Serving a copy of index.html
      // as 404.html lets deep links like /contact (and page refreshes) still
      // load the app, which then renders the right route client-side.
      name: "spa-404-fallback",
      closeBundle() {
        if (existsSync("dist/index.html"))
          copyFileSync("dist/index.html", "dist/404.html");
      },
    },
  ],
});
