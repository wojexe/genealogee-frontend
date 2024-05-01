<script context="module" lang="ts">
import type { Tree, Family } from "$lib/genealogee";

type Props = {
  familyID: Family["id"];
  tree: Tree;
  rootFamilyElement?: any;
};
</script>

<script lang="ts">
  import { AddPartner, AddChild } from ".";
  import Person from "./tree-person.svelte";

  let { familyID, tree }: Props = $props();

  const family = $derived(tree.families.get(familyID));

  $effect.pre(() => {
    if (family == null) {
      throw new Error("Family not found");
    }
  });

  const parents = $derived(family!.parents);
  const children = $derived(family!.children);

  const isParent = (personID: string) => tree.parents.has(personID);
</script>

<div class="w-auto grid auto-cols-auto grid-flow-row gap-24 place-items-center mx-auto">
  <div class="row-start-1 flex flex-row gap-16 place-items-end">
    {#each children as personID}
      {#if isParent(personID)}
        <svelte:self familyID={tree.parents.get(personID)!} {tree} />
      {:else}
        <div class="grid grid-cols-[1fr_fit-content(100%)_1fr] gap-2">
          <div class="col-start-2 flex flex-row gap-2 place-items-center">
            <Person {personID} {tree} />
          </div>

          <AddPartner {tree} personID={parents[0]} />
        </div>
      {/if}
    {/each}

    <div class="-mb-12 translate-y-[70%]">
      <AddChild {tree} familyID="{family!.id}" />
    </div>
  </div>

  <div class="row-start-2 grid grid-cols-[1fr_fit-content(100%)_1fr] gap-2">
    <div class="col-start-2 flex flex-row gap-2 place-items-center">
      {#each parents as personID}
        <Person {personID} {tree} />
      {/each}
    </div>

    <AddPartner {tree} personID={parents[0]} />
  </div>
</div>
