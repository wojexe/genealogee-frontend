<script lang="ts">
import { page } from "$app/stores";

import { spring } from "svelte/motion";

import ArrowLeft from "lucide-svelte/icons/arrow-left";
import { Root as Card, Content } from "$lib/components/ui/card";
import { Button } from "./ui/button";

const scale = spring(1);

const navigateBack = () => window.history.back();

const isBaseRoute = () => {
  const route = $page.route.id;

  if (!route) return false;

  const base = "/";
  const baseAuthenticated = "/(authenticated)/dashboards";

  return [base, baseAuthenticated].includes(route);
};
</script>

<header class="w-full grid grid-cols-[1fr_fit-content(100%)_1fr] gap-3">
  {#if !isBaseRoute()}
    <Button
      variant="outline"
      size="icon"
      class="place-self-end self-center rounded-full"
      style={`transform: scale(${$scale});`}
      on:click={() => navigateBack()}
    >
      <ArrowLeft />
    </Button>
  {/if}

  <Card
    class="col-start-2 bg-secondary w-fit block flex-row self-center rounded-full"
  >
    <Content class="p-4 px-8">Genealogee 🌳</Content>
  </Card>
</header>
