import type { HandleClientError } from "@sveltejs/kit";

/// SvelteKit client error handling

export function handleError({ status, error, message }): HandleClientError {
  const id = crypto.randomUUID();

  switch (status) {
    case 404:
      console.warn({ id, status, error }, message);
      break;
    default:
      console.error({ id, status, error }, message);
      break;
  }

  // @ts-ignore
  // TODO: why is it not properly typed?
  return { id, message };
}
