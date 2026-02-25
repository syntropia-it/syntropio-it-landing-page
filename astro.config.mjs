// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://www.samanatransformaciones.com",
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-three": ["three"],
            "vendor-gsap": ["gsap", "gsap/ScrollTrigger"],
            "vendor-lenis": ["lenis"],
          },
        },
      },
    },
  },

  integrations: [sitemap({
    filter: (page) => !page.includes("/404"),
  }), mdx()],
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
});