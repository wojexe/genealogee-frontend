<script context="module" lang="ts">
  import type { Tree } from "$lib/genealogee";

  type Props = {
    class?: string;
    tree: Tree;
  };
</script>

<script lang="ts">
  import AddPerson from "./tree-add-person.svelte";

  const { tree, class: className }: Props = $props();
</script>

<AddPerson who="first person" {tree} class={className} />
