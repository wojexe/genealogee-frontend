/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  return {
    dashboard: {
      id: params.id,
    },
  };
}
