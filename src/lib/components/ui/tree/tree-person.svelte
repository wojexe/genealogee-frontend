<script context="module" lang="ts">
  import type { Tree } from "$lib/genealogee";
  import { Card, Content, Footer } from "$lib/components/ui/card";

  type Props = {
    personID: string;
    tree: Tree;
  };
</script>

<script lang="ts">
  import { Pencil, Trash } from "lucide-svelte";
  import { Button } from "../button";

  let { personID, tree }: Props = $props();

  // TODO: error handling
  let person = $derived(tree.people.get(personID)!);
</script>

<Card class="min-w-48 max-w-82 break-words flex flex-col">
  <Content class="pb-2">
    {person.givenNames} <b>{person.familyName}-{person.birthName}</b>
  </Content>
  <Footer class="pt-0 flex gap-2 place-content-end">
    <!-- TODO: make editable and deletable -->
    <Button variant="ghost" size="icon" class="opacity-40 hover:opacity-100">
      <Pencil />
    </Button>
    <Button
      variant="destructive_ghost"
      size="icon"
      class="opacity-40 hover:opacity-100"
    >
      <Trash />
    </Button>
  </Footer>
</Card>
