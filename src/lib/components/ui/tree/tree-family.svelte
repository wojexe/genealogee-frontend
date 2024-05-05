<script context="module" lang="ts">
import type { Tree, Family } from "$lib/genealogee";

import { AddPartner, AddChild } from ".";

import Person from "./tree-person.svelte";
import Arrow from "$lib/components/arrow.svelte";


type Props = {
  element?: HTMLElement;
  childID?: Person['id'];
  familyID: Family["id"];
  tree: Tree;
};
</script>

<script lang="ts">
  let { element = $bindable(), childID, familyID, tree }: Props = $props();

  const family = $derived(tree.families.get(familyID));

  $effect.pre(() => {
    if (family == null) {
      throw new Error("Family not found");
    }
  });

  const parents = $derived(family!.parents);
  const children = $derived(family!.children);

  const isParent = (personID: string) => tree.parents.has(personID);

  let parentsElement: HTMLDivElement | undefined = $state(undefined);
  let childElements: any[] = $state([]);
</script>

<div class="relative w-auto grid auto-cols-auto grid-flow-row gap-24 place-items-center" bind:this={element}>
  <div class="row-start-1 flex flex-row gap-16 place-items-end">
    {#each children as personID, index (personID)}
      {#if isParent(personID)}
        <svelte:self childID={personID} familyID={tree.parents.get(personID)!} {tree} bind:element={childElements[index]} />
      {:else}
        <div class="grid grid-cols-[1fr_fit-content(100%)_1fr] gap-2">
          <div class="col-start-2 flex flex-row gap-2 place-items-center" bind:this={childElements[index]}>
            <Person {personID} {tree} isChild={true} />
          </div>

          <AddPartner {personID} {tree} />
        </div>
      {/if}
    {/each}

    <div class="-mb-12 translate-y-[70%]">
      <AddChild {tree} familyID="{family!.id}" />
    </div>
  </div>

  <div id={familyID} class="row-start-2 grid grid-cols-[1fr_fit-content(100%)_1fr] gap-2" bind:this={parentsElement}>
    <div class="col-start-2 flex flex-row gap-2 place-items-center">
      {#each parents as personID (personID)}
        <Person {personID} {tree} isChild={personID === childID} />
      {/each}
    </div>

    <AddPartner {tree} personID={parents[0]} />
  </div>

  {#each children as _personID, index}
    <Arrow parentElement={element} from={parentsElement} to={childElements[index]} />
  {/each}
</div>
