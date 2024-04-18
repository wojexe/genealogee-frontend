<script lang="ts">
  import type { Tree } from "$lib/api/tree";
  import DashboardElement from "./dashboardElement.svelte";

  type Props = {
    dashboards: Array<Tree>;
  };

  let { dashboards }: Props = $props();

  $inspect(dashboards)
</script>

{#each dashboards as dashboard (dashboard.id)}
  <DashboardElement {dashboard} />
{/each}
