<script context="module" lang="ts">
import type { Tree } from "$lib/genealogee";

type Props = {
  tree: Tree;
};
</script>

<script lang="ts">
import Family from "./tree-family.svelte";
import AddPerson from "./tree-add-person.svelte";

const { tree }: Props = $props();
</script>

{#if tree.people.size === 0}
  <AddPerson />
{:else}
  <Family familyID={tree.rootFamilyID!} {tree} />
{/if}
