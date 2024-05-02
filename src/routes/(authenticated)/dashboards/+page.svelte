<script context="module" lang="ts">
  import { createTree, getDashboards, type Dashboards } from "$lib/api/tree";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
</script>

<script lang="ts">
  import DashboardGrid from "./_components/dashboardGrid.svelte";

  import Plus from "lucide-svelte/icons/plus";
  import { Card, Content } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Tree } from "$lib/genealogee";

  const { data } = $props();
  const queryClient = data.queryClient;

  const dashboardsQuery = createQuery({
    queryKey: ["trees"],
    queryFn: () => getDashboards(fetch),
    // FIXME: PERPFORMANCE ISSUE = SKILL ISSUE
    select: (data) => data.trees.map((tree) => new Tree(tree)),
  });

  const createDashboardMutation = createMutation({
    mutationFn: (name: string | undefined) => createTree(name),
    onMutate: async (name) => {
      await queryClient.cancelQueries({ queryKey: ["trees"] });

      const previousTrees =
        queryClient.getQueryData<Dashboards>(["trees"])?.trees ?? [];

      const temporaryID = `temp-${crypto.randomUUID()}`;

      const temporaryTree = {
        id: temporaryID,
        creatorID: crypto.randomUUID(), // FIXME: get from auth (login and use svelte-query)
        name: name ?? "",
        people: [],
        families: [],
        snapshotIDs: [],
      };

      queryClient.setQueryData<Dashboards>(["trees"], (old) => ({
        trees: [...(old?.trees ?? []), temporaryTree],
      }));

      return { previousTrees, temporaryID };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTrees) {
        queryClient.setQueryData<Dashboards>(["trees"], {
          trees: context.previousTrees,
        });
      }
    },
    onSettled: async (newTree, _err, _variables, context) => {
      if (newTree == null) {
        return await queryClient.invalidateQueries({ queryKey: ["trees"] });
      }

      // Use the response => save a potentially expensive request
      queryClient.setQueryData<Dashboards>(["trees"], (old) => ({
        trees: [
          ...(old?.trees.filter((tree) => tree.id != context?.temporaryID) ??
            []),
          newTree,
        ],
      }));
    },
  });
</script>

{#if $dashboardsQuery.isPending}
  <span>Loading...</span>
{:else if $dashboardsQuery.isError}
  <span>Error: {$dashboardsQuery.error.message}</span>
{:else if $dashboardsQuery.data?.length === 0}
  <Card class="border border-solid border-amber-500 border-amber-500/50">
    <Content>
      <p>No dashboards found</p>
    </Content>
  </Card>
{:else}
  <DashboardGrid trees={$dashboardsQuery.data} />
{/if}

<Button
  variant="outline"
  class="flex gap-2"
  disabled={$createDashboardMutation.isPending}
  on:click={() => $createDashboardMutation.mutate(undefined)}
>
  <Plus class="h-5 w-5" />
  New dashboard
</Button>
