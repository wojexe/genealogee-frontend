<script context="module" lang="ts">
  import Trash from "lucide-svelte/icons/trash";
  import { Button } from "$lib/components/ui/button";
  import { Card, Footer, Header, Title } from "$lib/components/ui/card";

  import { deleteTree, type Dashboard, type Dashboards } from "$lib/api/tree";
  import { useQueryClient, createMutation } from "@tanstack/svelte-query";

  type Props = {
    dashboard: Dashboard;
  };
</script>

<script lang="ts">
  let { dashboard }: Props = $props();

  const queryClient = useQueryClient();

  const deleteDashboardMutation = createMutation({
    mutationFn: (id: string) => deleteTree(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["trees"] });
      await queryClient.cancelQueries({ queryKey: ["tree", id] });

      const previousTrees =
        queryClient.getQueryData<Dashboards>(["trees"])?.trees ?? [];

      queryClient.setQueryData<Dashboards>(["trees"], (old) => ({
        trees: old?.trees.filter((tree) => tree.id !== id) ?? [],
      }));

      return { previousTrees };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTrees) {
        queryClient.setQueryData<Dashboards>(["trees"], {
          trees: context.previousTrees,
        });
      }
    },
    onSettled: async (_data, _error, id, _context) => {
      await queryClient.invalidateQueries({ queryKey: ["trees"] });
      await queryClient.invalidateQueries({ queryKey: ["tree", id] });
    },
  });

  const dashboardName = $derived(
    dashboard.name.length === 0 ? "Untitled" : dashboard.name
  );
</script>

<Card class="min-w-64">
  <Header>
    <Title>🌳 {dashboardName} family</Title>
  </Header>
  <Footer class="gap-3 place-content-end">
    <Button
      variant="destructive_outline"
      size="icon"
      on:click={() => $deleteDashboardMutation.mutate(dashboard.id)}
    >
      <Trash />
    </Button>
    <Button href={`/dashboards/${dashboard.id}`}>View</Button>
  </Footer>
</Card>
