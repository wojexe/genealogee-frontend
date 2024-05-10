import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      $paraglide: "./src/paraglide",
    },
  },

  preprocess: [vitePreprocess({})],
};

export default config;
