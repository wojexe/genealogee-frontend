<script context="module" lang="ts">
  import type { Person, Tree } from "$lib/genealogee";
  import { Card, Content, Footer, Header } from "$lib/components/ui/card";
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
  import * as Dialog from "$lib/components/ui/dialog";

  import { Pencil, Trash } from "lucide-svelte";
  import EditPersonDialog from "./dialogs/edit-person-dialog.svelte";
  import DeletePersonDialog from "./dialogs/delete-person-dialog.svelte";
  import { languageTag } from "$paraglide/runtime";

  type Props = {
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
  let { personID, tree }: Props = $props();

  // TODO: error handling
  let person: Person = $derived(tree.people.get(personID)!);

  type DialogContentState = "edit" | "delete";
  let dialogContent: DialogContentState = $state("edit");
</script>

{#snippet personCardContent()}
  <Header class="p-0 pt-3 {person.dateOf?.hasAnyDate() ? 'pb-1' : 'pb-3' } px-5 flex-col -space-y-1 [&>*]:text-center">
    <span class="text-sm text-center opacity-60 group-hover:opacity-100 print:opacity-100 transition-opacity">{person.givenNames}</span>
    <span class="text-lg font-bold">{person.familyName}</span>

    {#if person.birthName}
      <div class="flex flex-row items-baseline text-sm place-self-center">
        <span class="whitespace-nowrap ml-[1ch]">z d.</span>
        &nbsp;
        <span class="text-sm font-semibold">{person.birthName}</span>
      </div>
    {/if}
  </Header>

  {#if person.dateOf?.hasAnyDate()}
    <Content class="py-0 pb-3 px-5 flex flex-col text-nowrap text-sm opacity-60 group-hover:opacity-100 print:opacity-100 transition-opacity">
      {#if person.dateOf?.birth}
        <div class="flex flex-row justify-between">
          ur. <span>{dateFormatter.format(person.dateOf.birth)}</span>
        </div>
      {/if}

      {#if person.dateOf?.death}
        <div class="flex flex-row justify-between">
          zm. <span>{dateFormatter.format(person.dateOf.death)}</span>
        </div>
      {/if}
    </Content>
  {/if}

  <!-- <Footer class="py-3 px-5">
    footer
  </Footer> -->
{/snippet}

<Dialog.Root>
  <ContextMenu.Root>
    <ContextMenu.Trigger>
      <Card class="min-w-48 max-w-82 break-words flex flex-col">
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
          Edit
        </ContextMenu.Item>
      </Dialog.Trigger>

      <Dialog.Trigger
        class="block w-[100%]"
        onclick={() => (dialogContent = "delete")}
      >
        <ContextMenu.Item
          class="data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground"
        >
          <Trash />
          Delete
        </ContextMenu.Item>
      </Dialog.Trigger>
    </ContextMenu.Content>
  </ContextMenu.Root>

  <Dialog.Content>
    {#if dialogContent == "edit"}
      <EditPersonDialog />
    {:else if dialogContent == "delete"}
      <DeletePersonDialog />
    {/if}
  </Dialog.Content>
</Dialog.Root>
