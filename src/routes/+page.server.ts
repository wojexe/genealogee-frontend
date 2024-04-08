import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { me } from "$lib/api/auth.svelte";

export const load: PageServerLoad = async ({ fetch }) => {
  const { authenticated } = await me(fetch);

  if (authenticated) {
    return redirect(302, "/dashboards");
  }
};
