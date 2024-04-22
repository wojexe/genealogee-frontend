<script context="module" lang="ts">
import type { Tree } from "$lib/genealogee";

type Props = {
  personID: string;
  tree: Tree;
};
</script>

<script lang="ts">
  let { personID, tree }: Props = $props();

  // TODO: error handling
  let person = $derived(tree.people.get(personID)!);

  // if person has a family, render family
  // if not, that's a leaf so render only the person
</script>

<div class="person-${personID}">
  <div>{person.givenNames} {person.familyName}-{person.birthName}</div>
</div>
