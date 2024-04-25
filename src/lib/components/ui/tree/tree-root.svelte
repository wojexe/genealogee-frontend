<script context="module" lang="ts">
import type { Tree } from "$lib/genealogee";

type Props = {
  tree: Tree;
};
</script>

<script lang="ts">
import Family from "./tree-family.svelte";
import { AddFirstPerson } from ".";

const { tree }: Props = $props();
</script>

{#if tree.people.size === 0}
  <AddFirstPerson tree={tree} />
{:else}
  <Family familyID={tree.rootFamilyID!} {tree} />
{/if}
