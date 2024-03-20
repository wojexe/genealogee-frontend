/// SvelteKit client error handling

/** @type {import("@sveltejs/kit").HandleClientError } */
export function handleError({ status, error, message }) {
  const id = crypto.randomUUID();

  switch (status) {
    case 404:
      console.warn({ id, status, error }, message);
      break;
    default:
      console.error({ id, status, error }, message);
      break;
  }

  return { id, message };
}
