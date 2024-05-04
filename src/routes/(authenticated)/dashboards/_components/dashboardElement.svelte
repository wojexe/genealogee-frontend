<script context="module" lang="ts">
  import * as m from "$paraglide/messages";

  import Trash from "lucide-svelte/icons/trash";
  import { Button } from "$lib/components/ui/button";
  import { Card, Footer, Header, Title } from "$lib/components/ui/card";

  import type { Tree } from "$lib/genealogee";
  import { deleteTree, type Dashboards } from "$lib/api/tree";
  import { useQueryClient, createMutation } from "@tanstack/svelte-query";

  type Props = {
    tree: Tree;
  };
</script>

<script lang="ts">
  let { tree }: Props = $props();

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
      await queryClient.invalidateQueries({ queryKey: ["tree", id] });
    },
  });
</script>

<Card class="min-w-64 flex flex-col justify-between">
  <Header>
    <Title>🌳 {tree.name}</Title>
  </Header>
  <Footer class="gap-3 place-content-end">
    <Button
      variant="destructive_outline"
      size="icon"
      on:click={() => $deleteDashboardMutation.mutate(tree.id)}
    >
      <Trash />
    </Button>
    <Button href={`/dashboards/${tree.id}`}>{m.view_dashboard()}</Button>
  </Footer>
</Card>
