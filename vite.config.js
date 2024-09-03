import { readFile } from "node:fs/promises";
import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig(async ({ mode, isPreview }) => {
  let extraOptions = {};

  if (mode === "development") {
    extraOptions = {
      ...extraOptions,
      server: await getHTTPSAndProxy(),
    };
  }

  if (isPreview) {
    extraOptions = {
      ...extraOptions,
      preview: await getHTTPSAndProxy(),
    };
  }

  return {
    ...extraOptions,
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
  };
});

const getHTTPSAndProxy = async () => ({
  https: {
    key: await readFile("./certs/key.pem"),
    cert: await readFile("./certs/cert.pem"),
  },
  proxy: {},
});
