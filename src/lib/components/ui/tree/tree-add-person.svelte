<script context="module" lang="ts">
  import type { Tree } from "$lib/genealogee";

  import { buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";

  import PlusCircle from "lucide-svelte/icons/circle-plus";

  import * as Tooltip from "$lib/components/ui/tooltip";

  // TODO: handle custom styles?
  type Props = {
    who: "first person" | "partner" | "child";
    tree: Tree;
    familyID?: string;
    personID?: string;
  };
</script>

<script lang="ts">
  import AddPersonDialog from "./dialogs/add-person-dialog.svelte";

  let { who, tree, familyID, personID }: Props = $props();

  let dialogOpen: boolean = $state(false);
</script>

<Tooltip.Root>
  <Dialog.Root bind:open={dialogOpen}>
    <Tooltip.Trigger
      class="{buttonVariants({
        variant: 'outline',
        size: 'content',
      })} flex flex-row gap-2 p-3 text-sm self-center opacity-40 hover:bg-background hover:opacity-100 transition-opacity"
      onclick={() => (dialogOpen = true)}
    >
      <PlusCircle />
    </Tooltip.Trigger>

    <AddPersonDialog {tree} {who} treeID={tree.id} {familyID} {personID} />
  </Dialog.Root>

  <Tooltip.Content>Add {who}</Tooltip.Content>
</Tooltip.Root>
