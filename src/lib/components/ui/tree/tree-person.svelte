<script context="module" lang="ts">
  import type { Tree } from "$lib/genealogee";
  import { Card, Content } from "$lib/components/ui/card";
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
  import * as Dialog from "$lib/components/ui/dialog";

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

  type DialogContentState = "edit" | "delete";
  let dialogContent: DialogContentState = $state("edit");
</script>

<Dialog.Root>
  <ContextMenu.Root>
    <ContextMenu.Trigger>
      <Card class="min-w-48 max-w-82 break-words flex flex-col">
        <Content>
          {person.givenNames} <b>{person.familyName}-{person.birthName}</b>
        </Content>
      </Card>
    </ContextMenu.Trigger>

    <ContextMenu.Content>
      <Dialog.Trigger
        class="block w-[100%]"
        onclick={() => (dialogContent = "edit")}
      >
        <ContextMenu.Item>
          <Pencil />
          Edit
        </ContextMenu.Item>
      </Dialog.Trigger>

      <Dialog.Trigger
        class="block w-[100%]"
        onclick={() => (dialogContent = "delete")}
      >
        <ContextMenu.Item
          class="data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground"
        >
          <Trash />
          Delete
        </ContextMenu.Item>
      </Dialog.Trigger>
    </ContextMenu.Content>
  </ContextMenu.Root>

  <Dialog.Content>
    {#if dialogContent == "edit"}
      Edit Dialog
    {:else if dialogContent == "delete"}
      Delete Dialog
    {/if}
  </Dialog.Content>
</Dialog.Root>
