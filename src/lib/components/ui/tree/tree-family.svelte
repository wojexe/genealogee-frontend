<script context="module" lang="ts">
import type { Tree, Family } from "$lib/genealogee";

type Props = {
  familyID: Family["id"];
  tree: Tree;
};
</script>

<script lang="ts">
  import { AddPerson } from ".";
  import Person from "./tree-person.svelte";

  let { familyID, tree }: Props = $props();

  // TODO: error handling

  const family = $derived(tree.families.get(familyID));

  const parents = $derived(family?.parents ?? []);
  const children = $derived(family?.children ?? []);
</script>

<div class="grid auto-cols-auto grid-flow-row">
  <div class="row-start-2">
    parents:
    {#each parents as personID}
      <Person {personID} {tree} />
    {/each}
    <AddPerson />
  </div>

  <div class="row-start-1">
    children:
    {#each children as personID}
      <Person {personID} {tree} />
    {/each}
    <AddPerson />
  </div>
</div>
