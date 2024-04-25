<script context="module" lang="ts">
  import type { Tree } from "$lib/genealogee";
  import { Card, Content } from "../card";

  type Props = {
    personID: string;
    tree: Tree;
  };
</script>

<script lang="ts">
  let { personID, tree }: Props = $props();

  // TODO: error handling
  let person = $derived(tree.people.get(personID)!);
</script>

<Card class="person-${personID} max-w-48 break-words">
  <Content>
    <div>{person.givenNames} {person.familyName}-{person.birthName}</div>
  </Content>
</Card>
