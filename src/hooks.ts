import type { Reroute } from "@sveltejs/kit";

import { i18n } from "$lib/i18n";

export const reroute: Reroute = i18n.reroute();
