import pino from "pino";

import { dev } from "$app/environment";

/** @type {import('pino').LoggerOptions} */
const options = {
  base: {
    id: crypto.randomUUID(),
    pid: process.pid,
    hostname: process.env.HOSTNAME,
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
