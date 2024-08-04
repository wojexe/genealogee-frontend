import { readFile } from "node:fs/promises";
import { paraglide } from "@inlang/paraglide-js-adapter-sveltekit/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig(async ({ mode }) => {
  let extraOptions = {};

  if (mode === "development") {
    extraOptions = {
      ...extraOptions,
      server: {
        https: {
          key: await readFile("./certs/key.pem"),
          cert: await readFile("./certs/cert.pem"),
        },
        proxy: {},
      },
    };
  }

  return {
    plugins: [
      sveltekit(),
      paraglide({
        project: "./project.inlang",
        outdir: "./src/paraglide",
      }),
    ],
    test: {
      include: ["src/**/*.{test,spec}.{js,ts}"],
    },
    ...extraOptions,
  };
});
