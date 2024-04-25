<script context="module" lang="ts">
  import type { Tree } from "$lib/genealogee";

  type Props = {
    tree: Tree;
    familyID: string;
  };
</script>

<script lang="ts">
  import AddPerson from "./tree-add-person.svelte";

  const { tree, familyID }: Props = $props();
</script>

<AddPerson who="child" {tree} {familyID} />
