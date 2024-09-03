import { readFile } from "node:fs/promises";
import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig(async ({ mode }) => {
  let extraOptions = {};

  switch (mode) {
    case "development":
      extraOptions = {
        ...extraOptions,
        server: await getHTTPSAndProxy(),
      };
      break;
    case "staging":
      extraOptions = {
        ...extraOptions,
        preview: await getHTTPSAndProxy(),
      };
      break;
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
