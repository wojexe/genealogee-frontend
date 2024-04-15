<script lang="ts">
  import DashboardList from "./_components/dashboardList.svelte";

  import { dashboards } from "$lib/api/tree";
  import { createQuery } from "@tanstack/svelte-query";

  const query = createQuery({
    queryKey: ["trees"],
    queryFn: () => dashboards(fetch),
    select: (data) => data.trees,
  });
</script>

<h1>Dashboards</h1>

{#if $query.isPending}
  <span>Loading...</span>
{:else if $query.isError}
  <span>Error: {$query.error.message}</span>
{:else}
  <DashboardList dashboards={$query.data} />
{/if}
