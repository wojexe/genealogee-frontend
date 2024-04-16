<script>
  import { page } from "$app/stores";

  import { getDashboard } from "$lib/api/tree";
  import { createQuery } from "@tanstack/svelte-query";

  const treeID = $page.params.id;

  const query = createQuery({
    queryKey: ["tree", treeID],
    queryFn: () => getDashboard(treeID, fetch),
  });
</script>

<span class="text-xs">Dashboard#{treeID}</span>

{#if $query.isPending}
  <span>Loading...</span>
{:else if $query.isError}
  <span>Error: {$query.error.message}</span>
{:else}
  <h1>{$query.data?.name}</h1>
  <h3>Dashboard</h3>

  {#each $query.data.people as person}
    <p>{person.givenNames} {person.familyName} {person.birthName}</p>
  {/each}
{/if}
