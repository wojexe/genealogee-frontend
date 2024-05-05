<script context="module" lang="ts">
  import * as m from "$paraglide/messages";

  import {
    createTree,
    getDashboards,
    type Dashboard,
    type Dashboards,
  } from "$lib/api/tree";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
</script>

<script lang="ts">
  import DashboardGrid from "./_components/dashboardGrid.svelte";

  import Plus from "lucide-svelte/icons/plus";
  import { Card, Content } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";

  const { data } = $props();
  const queryClient = data.queryClient;

  const dashboardsQuery = createQuery({
    queryKey: ["trees"],
    queryFn: () => getDashboards(fetch),
  });

  const createDashboardMutation = createMutation({
    mutationFn: (name: string | undefined) => createTree(name),
    onMutate: async (name) => {
      await queryClient.cancelQueries({ queryKey: ["trees"] });

      const previousTrees =
        queryClient.getQueryData<Dashboards>(["trees"])?.trees ?? [];

      const newTreeObject: Dashboard = {
        id: `temp-${crypto.randomUUID()}`,
        creatorID: data.userID,
        name: name ?? "",
        people: [],
        families: [],
        snapshotIDs: [],
      };

      queryClient.setQueryData<Dashboards>(["trees"], (old) => ({
        trees: [...(old?.trees ?? []), newTreeObject],
      }));

      return { previousTrees, newTreeObject };
    },
    onError: (_err, _name, context) => {
      if (context?.previousTrees) {
        queryClient.setQueryData<Dashboards>(["trees"], {
          trees: context.previousTrees,
        });
      }
    },
    onSuccess: (newTree, _name, context) => {
      // Data in svelte-query is not reactive, thus we need to set it (causes re-render)
      // A better way would be to just utilize runes - https://github.com/TanStack/query/pull/6981
      context.previousTrees.push(newTree);
      queryClient.setQueryData<Dashboards>(["trees"], {
        trees: context.previousTrees,
      });
    },
  });
</script>

{#if $dashboardsQuery.isPending}
  <span>Loading...</span>
{:else if $dashboardsQuery.isError}
  <span>Error: {$dashboardsQuery.error.message}</span>
{:else if $dashboardsQuery.data?.trees.length === 0}
  <Card class="border border-solid border-amber-500 border-amber-500/50">
    <Content>
      <p>{m.no_dashboards_found()}</p>
    </Content>
  </Card>
{:else}
  <DashboardGrid trees={$dashboardsQuery.data.trees} />
{/if}

<Button
  variant="outline"
  class="flex gap-2"
  disabled={$createDashboardMutation.isPending}
  on:click={() => $createDashboardMutation.mutate(undefined)}
>
  <Plus class="h-5 w-5" />
  {m.create_dashboard()}
</Button>
