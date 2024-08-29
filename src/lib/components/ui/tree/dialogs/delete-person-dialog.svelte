<script context="module" lang="ts">
  import * as m from "$paraglide/messages";
  import type { Person } from "$lib/genealogee";

  type Props = {
    person: Person;
    isChild: boolean;
    isComplexDelete: boolean;
  };

  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { buttonVariants } from "$lib/components/ui/button";

  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { deletePerson } from "$lib/api/person";
</script>

<script lang="ts">
  let { person, isComplexDelete }: Props = $props();

  const queryClient = useQueryClient();

  const deletePersonMutation = createMutation(() => ({
    mutationFn: async () => deletePerson(person.id),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tree", person.treeID],
      });
      await queryClient.invalidateQueries({ queryKey: ["trees"] });
    },
  }));
</script>

<AlertDialog.Content>
  <AlertDialog.Header>
    <AlertDialog.Title
      >{m.deletePersonDialog_title({
        fullName: person.fullName,
      })}</AlertDialog.Title
    >
    <AlertDialog.Description class="flex flex-col gap-3">
      <span>
        {#if isComplexDelete}
          {@html m.deletePersonDialog_complexDeleteMessage()}
        {/if}
      </span>

      <div class="font-bold text-center">{m.actionCannotBeUndone()}</div>
    </AlertDialog.Description>
  </AlertDialog.Header>

  <AlertDialog.Footer>
    <AlertDialog.Cancel>{m.cancel()}</AlertDialog.Cancel>
    <AlertDialog.Action
      class={buttonVariants({ variant: "destructive" })}
      onclick={() => deletePersonMutation.mutate()}
    >
      {m.delete_()}
    </AlertDialog.Action>
  </AlertDialog.Footer>
</AlertDialog.Content>
