<script context="module" lang="ts">
import type { Tree } from "$lib/genealogee";

type Props = {
  tree: Tree;
};
</script>

<script lang="ts">
import Family from "./tree-family.svelte";
import { AddFirstPerson } from ".";
import { onMount } from "svelte";

const { tree }: Props = $props();

let container: HTMLDivElement;

onMount(()=> {
  container.scrollTo({
    top: Math.max(0, container.scrollHeight - container.clientHeight),
    left: Math.max(0, container.scrollWidth / 2 - container.clientWidth / 2),
    behavior: "instant",
  });
})
</script>

<div class="h-fit w-fit rounded-3xl overflow-hidden shadow-sm place-content-center">
  <div bind:this={container} class="flex h-fit w-max-[90vw] overflow-auto rounded-3xl border border-red p-8 [&>*]:mx-auto">
    {#if tree.rootFamilyID == null}
      <AddFirstPerson tree={tree} />
    {:else}
      <Family familyID={tree.rootFamilyID} {tree} />
    {/if}
  </div>
</div>
