<script context="module" lang="ts">
  import * as m from "$paraglide/messages";
  import { cn } from "$lib/utils";

  import type { Tree } from "$lib/genealogee";

  import { buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Tooltip from "$lib/components/ui/tooltip";

  import PlusCircle from "lucide-svelte/icons/circle-plus";

  type Props = {
    class?: string;
    who: "first person" | "partner" | "child";
    tree: Tree;
    familyID?: string;
    personID?: string;
  };
</script>

<script lang="ts">
  import AddPersonDialog from "./dialogs/add-person-dialog.svelte";

  let { class: className, who, tree, familyID, personID }: Props = $props();

  let dialogOpen: boolean = $state(false);

  const translatedWho = {
    "first person": m.first_person(),
    partner: m.partner(),
    child: m.child(),
  };
</script>

<Tooltip.Root>
  <Dialog.Root bind:open={dialogOpen}>
    <Tooltip.Trigger
      class={cn(
        buttonVariants({
          variant: "outline",
          size: "content",
        }),
        "flex flex-row gap-2 p-3 text-sm self-center opacity-40 hover:bg-background hover:opacity-100 transition-opacity",
        className ?? ""
      )}
      onclick={() => (dialogOpen = true)}
    >
      <PlusCircle />
    </Tooltip.Trigger>

    <AddPersonDialog {tree} {who} treeID={tree.id} {familyID} {personID} />
  </Dialog.Root>

  <Tooltip.Content>{m.add_person({ who: translatedWho[who] })}</Tooltip.Content>
</Tooltip.Root>
