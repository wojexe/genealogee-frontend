<script>
  import { page } from "$app/stores";

  import { getDashboard } from "$lib/api/tree";
  import { Root, Title } from "$lib/components/ui/tree";
  import { Tree } from "$lib/genealogee/tree.svelte";
  import { createQuery } from "@tanstack/svelte-query";

  const treeID = $page.params.id;

  const query = createQuery({
    queryKey: ["tree", treeID],
    queryFn: () => getDashboard(treeID, fetch),
    select: (tree) => new Tree(tree),
  });
</script>

<!-- <div class="text-xs absolute top-2 left-2 pointer-events-none">
  <div>Dashboard#{treeID}</div>
  <div>People count: {$query.data?.people.size}</div>
  <div class="relative left-4">
    {#each [...($query.data?.people.values() ?? [])] as person}
      <div class="relative">
        {person.givenNames}
        {person.familyName}-{person.birthName}
      </div>
    {/each}
  </div>
  <div>Families count: {$query.data?.families.size}</div>
</div> -->

{#if $query.isPending}
  <span>Loading...</span>
{:else if $query.isError}
  <span>Error: {$query.error.message}</span>
{:else}
  <main class="flex flex-col items-center justify-items-center gap-8">
    <Title title={$query.data.name} />
    <Root tree={$query.data} />
  </main>
{/if}
