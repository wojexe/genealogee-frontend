<script lang="ts">
import DashboardList from "./_components/dashboardList.svelte";

import {
  createTree,
  getDashboards,
  type Dashboards,
  type Tree,
} from "$lib/api/tree";
import { createMutation, createQuery } from "@tanstack/svelte-query";

import { Card, Content } from "$lib/components/ui/card";
import { Button } from "$lib/components/ui/button";

import { Plus } from "svelte-radix";

const { data } = $props();
const queryClient = data.queryClient;

const dashboardsQuery = createQuery({
  queryKey: ["trees"],
  queryFn: () => getDashboards(fetch),
  select: (data) => data.trees,
});

const dashboardMutation = createMutation({
  mutationFn: () => createTree(),
  onMutate: async () => {
    await queryClient.cancelQueries({ queryKey: ["trees"] });

    const previousTrees = queryClient.getQueryData<Array<Tree>>(["trees"]);

    // FIXME
    queryClient.setQueryData<Dashboards>(["trees"], (old) => {
      trees: [
        ...(old?.trees ?? []),
        {
          // TODO: use more sensible values for new trees
          id: crypto.randomUUID(),
          creatorID: crypto.randomUUID(), // TODO: get from auth (login and use svelte-query)
          name: "temporary",
          people: [],
          families: [],
          snapshotIDs: [],
        },
      ];
    });

    return { previousTrees };
  },
  onError: (err: any, variables: any, context: any) => {
    console.log(err);
    if (context?.previousTrees) {
      queryClient.setQueryData<Array<Tree>>(["trees"], context.previousTrees);
    }
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["trees"] });
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
  <DashboardList dashboards={$dashboardsQuery.data} />
{/if}

<Button
  variant="outline"
  class="flex gap-2"
  disabled={$dashboardMutation.isPending}
  onclick={() => $dashboardMutation.mutate("")}
>
  <Plus class="h-5 w-5" />
  New dashboard
</Button>
