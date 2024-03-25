import pino from "pino";

import { dev } from "$app/environment";

/** @type {import('pino').LoggerOptions} */
const options = {
  mixin() {
    return {
      id: crypto.randomUUID(),
    };
  },
};

if (dev) {
  options.level = "debug";
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  };
}

export const logger = pino(options);
