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

  ssr: false,

  nitro: {
    preset: "github_pages", // Preset for GitHub Pages
  },

  app: {
    baseURL: "/",  
    buildAssetsDir: "assets", 
  },
});
