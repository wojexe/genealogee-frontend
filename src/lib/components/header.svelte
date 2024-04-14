<script lang="ts">
  import { page } from "$app/stores";

  import { ArrowLeft } from "svelte-radix";
  import { Root as Card, Content } from "$lib/components/ui/card";
  import { Button } from "./ui/button";

  const navigateBack = () => window.history.back();

  const isBaseRoute = () => {
    const route = $page.route.id;

    return route === "/(authenticated)/dashboards" || route === "/";
  };
</script>

<header class="w-full grid grid-cols-[1fr_fit-content(100%)_1fr] gap-3">
  {#if !isBaseRoute()}
    <Button
      variant="secondary"
      size="icon"
      class="place-self-end self-center rounded-full"
      on:click={() => navigateBack()}
    >
      <ArrowLeft />
    </Button>
  {/if}

  <Card class="col-start-2 bg-accent w-fit block flex-row self-center rounded-full">
    <Content class="p-4 px-8">Genealogee 🌳</Content>
  </Card>
</header>
