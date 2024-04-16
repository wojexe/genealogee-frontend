import { getDashboard } from "$lib/api/tree";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch, parent }) => {
  const { queryClient } = await parent();

  await queryClient.prefetchQuery({
    queryKey: ["tree", params.id],
    queryFn: () => getDashboard(params.id, fetch),
  });
};
