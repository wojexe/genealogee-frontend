<script context="module" lang="ts">
import type { Tree, Family } from "$lib/genealogee";

type Props = {
  familyID: Family["id"];
  tree: Tree;
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

  // Add person:
  //   - as a partner for a person
  //      + isParent
  //          ? this adds the partner to partners in the family
  //          : this creates a new family for the person
  //      * NEEDED: treeID, personID
  //   - as a child for a family
  //      + this simply adds the person to the children of a family
  //      * NEEDED: treeID, familyID

  //   - to an empty tree (not this file)
  //      + this creates a new root family for the tree
  //      * NEEDED: treeID
</script>

<div class="grid auto-cols-auto grid-flow-row gap-24 place-items-center ">
  <div class="row-start-1 flex flex-row gap-16 place-items-end">
    {#each children as personID}
      {#if isParent(personID)}
        <svelte:self familyID={tree.parents.get(personID)!} {tree} />
      {:else}
        <div class="flex flex-row gap-2">
          <Person {personID} {tree} />

          <AddPartner {tree} {personID} />
        </div>
      {/if}
    {/each}

    <div class="relative bottom-[46px]">
      <AddChild {tree} familyID="{family!.id}" />
    </div>
  </div>

  <div class="row-start-2 grid grid-cols-[1fr_fit-content(100%)_1fr] gap-2">
    <div class="col-start-2 flex flex-row gap-2">
      {#each parents as personID}
        <Person {personID} {tree} />
      {/each}
    </div>

    <AddPartner {tree} personID={parents[0]} />
  </div>
</div>
