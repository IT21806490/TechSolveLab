import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: '2025-11-30',

  modules: ["@nuxtjs/tailwindcss"],

  css: ["~/assets/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  nitro: {
    preset: "github_pages",
  },

  app: {
    baseURL: "/TechSolveLab/",  // MUST match your GitHub repo name
    buildAssetsDir: "assets",
  }
});
