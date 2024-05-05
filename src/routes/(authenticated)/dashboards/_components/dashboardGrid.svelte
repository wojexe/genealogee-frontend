<script lang="ts">
  import type { Tree } from "$lib/api/tree";
  import DashboardElement from "./dashboardElement.svelte";

  type Props = {
    trees: Array<Tree>;
  };

  let { trees }: Props = $props();
</script>

<div class="w-full max-w-5xl place-self-center grid grid-flow-row grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
  {#each trees as tree (tree.id)}
    <DashboardElement {tree} />
  {/each}
</div>
