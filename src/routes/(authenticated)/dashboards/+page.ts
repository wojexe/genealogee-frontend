import { getDashboards } from "$lib/api/tree";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { queryClient } = await parent();

  await queryClient.prefetchQuery({
    queryKey: ["trees"],
    queryFn: () => getDashboards(fetch),
  });
};
