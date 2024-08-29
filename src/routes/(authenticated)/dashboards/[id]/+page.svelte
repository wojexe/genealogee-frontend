<script>
  import * as m from "$paraglide/messages"
  import { page } from "$app/stores";

  import { getDashboard } from "$lib/api/tree";
  import { Root, Title } from "$lib/components/ui/tree";
  import { Tree } from "$lib/genealogee/tree.svelte";
  import { createQuery } from "@tanstack/svelte-query";

  const treeID = $page.params.id;

  const query = createQuery(() => ({
    queryKey: ["tree", treeID],
    queryFn: () => getDashboard(treeID, fetch),
    select: (tree) => new Tree(tree),
  }));
</script>

<svelte:head>
  <title>{query?.data?.name ?? m.tree()} | Genealogee</title>
</svelte:head>

{#if query.isPending}
  <span>Loading...</span>
{:else if query.isError}
  <span>Error: {query.error.message}</span>
{:else}
  <main class="flex flex-col items-center justify-items-center gap-8">
    <Title title={query.data.name} />
    <Root tree={query.data} />
  </main>
{/if}
