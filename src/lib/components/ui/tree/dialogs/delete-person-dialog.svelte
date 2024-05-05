<script context="module" lang="ts">
  import type { Person } from "$lib/genealogee";

  type Props = {
    person: Person;
    isChild: boolean;
  };

  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { buttonVariants } from "$lib/components/ui/button";

  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { deletePerson } from "$lib/api/person";
</script>

<script lang="ts">
  let { person, isChild }: Props = $props();

  const queryClient = useQueryClient();

  const deletePersonMutation = createMutation({
    mutationFn: async () => deletePerson(person.id),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tree", person.treeID],
      });
      await queryClient.invalidateQueries({ queryKey: ["trees"] });
    },
  });

  const title = $derived.by(() => {
    let title = `Delete ${person.fullName}`;

    // if (isChild) title += " and their whole branch";

    return title + "?";
  });
</script>

<AlertDialog.Content>
  <AlertDialog.Header>
    <AlertDialog.Title>{title}</AlertDialog.Title>
    <AlertDialog.Description>
      {#if isChild}
        <b>This will also delete this person's whole branch</b> - all partners and
        children.
      {/if}

      This action cannot be undone.
    </AlertDialog.Description>
  </AlertDialog.Header>

  <AlertDialog.Footer>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action
      class={buttonVariants({ variant: "destructive" })}
      onclick={() => $deletePersonMutation.mutate()}>Delete</AlertDialog.Action
    >
  </AlertDialog.Footer>
</AlertDialog.Content>
