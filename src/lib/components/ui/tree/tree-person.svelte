<script context="module" lang="ts">
  import type { Tree } from "$lib/genealogee";
  import { Card, Content } from "$lib/components/ui/card";
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";

  type Props = {
    personID: string;
    tree: Tree;
  };
</script>

<script lang="ts">
  import { Pencil, Trash } from "lucide-svelte";

  let { personID, tree }: Props = $props();

  // TODO: error handling
  let person = $derived(tree.people.get(personID)!);
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>
    <Card class="min-w-48 max-w-82 break-words flex flex-col">
      <Content>
        {person.givenNames} <b>{person.familyName}-{person.birthName}</b>
      </Content>
    </Card>
  </ContextMenu.Trigger>

  <!-- TODO: make editable and deletable -->
  <ContextMenu.Content>
    <ContextMenu.Item>
      <Pencil />
      Edit
    </ContextMenu.Item>
    <ContextMenu.Item
      class="data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground"
    >
      <Trash />
      Delete
    </ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
