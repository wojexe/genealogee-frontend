<script context="module" lang="ts">
  import type { Tree } from "$lib/genealogee";

  type Props = {
    tree: Tree;
    personID: string;
  };
</script>

<script lang="ts">
  import AddPerson from "./tree-add-person.svelte";

  const { tree, personID }: Props = $props();
</script>

<AddPerson who="partner" {tree} {personID} />
