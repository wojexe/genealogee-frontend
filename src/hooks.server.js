import { sequence } from "@sveltejs/kit/hooks";

import { i18n } from "$lib/i18n";
import { logger } from "$lib/server/logger";

/// SvelteKit server error handling

/** @type {import("@sveltejs/kit").HandleServerError } */
export function handleError({ status, error, message }) {
  const id = crypto.randomUUID();

  switch (status) {
    case 404:
      logger.warn({ id, status, error }, message);
      break;
    default:
      logger.error({ id, status, error }, message);
      break;
  }

  return { id, message };
}

/// Middleware

/** @type {import("@sveltejs/kit").Handle} */
const handleI18n = i18n.handle();

/** @type {import("@sveltejs/kit").Handle} */
const handleAuth = async ({ event, resolve }) => {
  const route = event.route.id;

  if (route === null) {
    return await resolve(event);
  }

  if (route.startsWith("/(authenticated)")) {
    logger.debug({ route }, "Checking user authentication");

    // TODO: Check for authentication
  } else {
    logger.debug({ route }, "No authentication required");
  }

  return await resolve(event);
};

export const handle = sequence(handleI18n, handleAuth);
