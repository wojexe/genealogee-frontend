import { type Handle, type HandleServerError, redirect } from "@sveltejs/kit";

import { error as svelteError } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { me } from "$lib/api/auth";
import { i18n } from "$lib/i18n";
import { logger } from "$lib/server/logger";

/// SvelteKit server error handling

export function handleError({
  event,
  status,
  error,
  message,
}): HandleServerError {
  const id = crypto.randomUUID();

  switch (status) {
    case 401:
    case 404:
      event.locals.logger.warn({ id, status, error }, message);
      break;
    default:
      event.locals.logger.error({ id, status, error }, message);
      break;
  }

  // @ts-ignore
  // TODO: why is it not properly typed?
  return { id, message };
}

/// Middleware

const handleRequestLogger: Handle = async ({ event, resolve }) => {
  const requestID = crypto.randomUUID();
  event.locals.requestID = requestID;
  event.locals.logger = logger.child({ requestID });

  const response = await resolve(event);

  if (response.status >= 500) {
    event.locals.logger.error(
      { status: response.status, event },
      "Failed to handle request",
    );
  } else {
    event.locals.logger.debug({ status: response.status, event });
  }

  return response;
};

const handleI18n: Handle = i18n.handle();

const handleAuth: Handle = async ({ event, resolve }) => {
  const route = event.route.id;

  if (route === null) {
    return await resolve(event);
  }

  if (route.startsWith("/(authenticated)")) {
    event.locals.logger.debug({ route }, "Checking user authentication");

    const { authenticated, response, error } = await me(event.fetch);

    if (authenticated) {
      event.locals.logger.debug({ route }, "Authentication successful");

      const responseJSON = await response?.json();
      event.locals.userID = responseJSON?.id;
    } else if (response != null) {
      event.locals.logger.debug({ route, response }, "Authentication failed");

      redirect(302, "/");
    } else if (error != null) {
      event.locals.logger.fatal(
        { route, error },
        "Authentication failed - fetch error",
      );

      // TODO: inform the user about the error
      redirect(302, "/");

      svelteError(500, {
        id: crypto.randomUUID(),
        message: "Internal server error",
      });
    }
  }

  return await resolve(event);
};

export const handle = sequence(handleRequestLogger, handleI18n, handleAuth);
