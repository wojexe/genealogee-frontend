<script context="module" lang="ts">
  import type { Tree } from "$lib/genealogee";

  type Props = {
    tree: Tree;
  };
</script>

<script lang="ts">
  import AddPerson from "./tree-add-person.svelte";

  const { tree }: Props = $props();
</script>

<AddPerson who="first person" {tree} />
