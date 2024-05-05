<script context="module" lang="ts">
  import * as m from "$paraglide/messages"
  import { languageTag } from "$paraglide/runtime";

  import type { Person, Tree } from "$lib/genealogee";

  import { Card, Content, Header } from "$lib/components/ui/card";

  import * as Dialog from "$lib/components/ui/dialog";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import * as ContextMenu from "$lib/components/ui/context-menu";

  import { Pencil, Trash } from "lucide-svelte";

  import EditPersonDialog from "./dialogs/edit-person-dialog.svelte";
  import DeletePersonDialog from "./dialogs/delete-person-dialog.svelte";

  type Props = {
    isChild: boolean;
    personID: string;
    tree: Tree;
  };

  const dateFormatter = new Intl.DateTimeFormat(languageTag(), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

</script>

<script lang="ts">
  let { isChild, personID, tree }: Props = $props();

  // TODO: error handling
  let person: Person = $derived(tree.people.get(personID)!);

  type DialogContentState = "edit" | "delete";

  let dialogOpen: boolean = $state(false);
  let dialogContent: DialogContentState = $state("edit");

  const isComplexDelete = $derived.by(()=> {
    if (person.familyID == null) return false;

    const family = tree.families.get(person.familyID!)
    if (family == null) return false;

    return isChild ||
      (tree.rootFamilyID === person.familyID && family.parents.length === 1);
  })
</script>

{#snippet personCardContent()}
  <Header class="p-0 pt-3 {person.dateOf?.hasAnyDate() ? 'pb-1' : 'pb-3' } px-5 flex-col -space-y-1 [&>*]:text-center">
    <span class="text-sm text-center opacity-60 group-hover:opacity-100 print:opacity-100 transition-opacity">{person.givenNames}</span>
    <span class="text-lg font-bold">{person.familyName}</span>

    {#if person.birthName}
      <div class="flex flex-row items-baseline text-sm place-self-center">
        <span class="whitespace-nowrap ml-[1ch]">{m.person_nee()}</span>
        &nbsp;
        <span class="text-sm font-semibold">{person.birthName}</span>
      </div>
    {/if}
  </Header>

  {#if person.dateOf?.hasAnyDate()}
    <Content class="py-0 pb-3 px-5 flex flex-col text-nowrap text-sm opacity-60 group-hover:opacity-100 print:opacity-100 transition-opacity">
      {#if person.dateOf?.birth}
        <div class="flex flex-row justify-between">
          {m.person_born()}&nbsp;<span>{dateFormatter.format(person.dateOf.birth)}</span>
        </div>
      {/if}

      {#if person.dateOf?.death}
        <div class="flex flex-row justify-between">
          {m.person_died()}&nbsp;<span>{dateFormatter.format(person.dateOf.death)}</span>
        </div>
      {/if}
    </Content>
  {/if}
{/snippet}

<AlertDialog.Root>
<Dialog.Root bind:open={dialogOpen}>
  <ContextMenu.Root>
    <ContextMenu.Trigger>
      <Card id={person.id} class="min-w-48 max-w-82 break-words flex flex-col {isChild ? "border-[2px] border-solid border-green-600" : ""}">
        {@render personCardContent()}
      </Card>
    </ContextMenu.Trigger>

    <ContextMenu.Content>
      <Dialog.Trigger
        class="block w-[100%]"
        onclick={() => (dialogContent = "edit")}
      >
        <ContextMenu.Item>
          <Pencil />
          {m.edit()}
        </ContextMenu.Item>
      </Dialog.Trigger>

      <AlertDialog.Trigger
        class="block w-[100%]"
        onclick={() => (dialogContent = "delete")}
      >
        <ContextMenu.Item
          class="data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground"
        >
          <Trash />
          {m.delete_()}
        </ContextMenu.Item>
      </AlertDialog.Trigger>
    </ContextMenu.Content>
  </ContextMenu.Root>

  <EditPersonDialog {person} onSubmit={()=>(dialogOpen = false)} />
  <DeletePersonDialog {person} {isChild} {isComplexDelete} />
</Dialog.Root>
</AlertDialog.Root>
