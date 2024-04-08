import pino, { type LoggerOptions } from "pino";

import { dev } from "$app/environment";

const options: LoggerOptions = {
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
