<script context="module" lang="ts">
  import type { Tree } from "$lib/genealogee";

  import { buttonVariants } from "$lib/components/ui/button";
  import { Dialog, Trigger } from "$lib/components/ui/dialog";

  import { PlusCircled } from "svelte-radix";

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
</script>

<!-- TODO: replace text with tooltip -->

<Dialog>
  <Trigger
    class="{buttonVariants({
      variant: 'outline',
      size: 'content',
    })} flex flex-col gap-1 px-6 py-3 text-sm self-center"
  >
    <PlusCircled />
    {`Add ${who}`}
  </Trigger>

  <AddPersonDialog {who} treeID={tree.id} {familyID} {personID} />
</Dialog>
