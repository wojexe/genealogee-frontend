<script context="module" lang="ts">
  import { dateProxy, defaults, superForm } from "sveltekit-superforms";
  import { valibot } from "sveltekit-superforms/adapters";

  import {
    createPerson,
    createPersonSchema,
    type CreatePersonInput,
  } from "$lib/api/person";

  import { createMutation, useQueryClient } from "@tanstack/svelte-query";

  import { Button } from "$lib/components/ui/button";
  import { Content, Header, Title, Footer } from "$lib/components/ui/dialog";
  import {
    Control,
    Label,
    Field,
    Fieldset,
    FieldErrors,
  } from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";

  import type { Dashboard } from "$lib/api/tree";
  import type { Tree } from "$lib/genealogee";

  type Props = {
    who: "first person" | "partner" | "child";
    tree: Tree;
    treeID: string;
    familyID?: string;
    personID?: string;
  };
</script>

<script lang="ts">
  let { who, tree, treeID, familyID, personID }: Props = $props();

  if (familyID != null && personID != null) {
    throw new Error("One of familyID and personID must be provided");
  }

  const queryClient = useQueryClient();

  const addPersonMutation = createMutation({
    mutationFn: async (personData: CreatePersonInput) =>
      createPerson(personData),
    onMutate: async (personData) => {
      await queryClient.cancelQueries({ queryKey: ["tree", treeID] });

      const previousTree = queryClient.getQueryData<Dashboard>([
        "tree",
        treeID,
      ]);

      // TODO: create person element from personData to display before response

      queryClient.setQueryData<Dashboard>(["tree", treeID], (old) => old);

      return { previousTree };
    },
    onError: (_err, _personData, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData<Dashboard>(
          ["tree", treeID],
          context.previousTree
        );
      }
    },
    onSettled: async (_data, _error, _personData, _context) => {
      // load from response

      await queryClient.invalidateQueries({ queryKey: ["tree", treeID] });
    },
  });

  let formID;
  if (personID == null && familyID == null) {
    formID = "add-first-person";
  } else if (personID != null && familyID == null) {
    formID = `add-partner-${personID}`;
  } else {
    formID = `add-child-${familyID}`;
  }

  const form = superForm(defaults(valibot(createPersonSchema)), {
    id: formID,
    SPA: true,
    resetForm: false,
    dataType: "json",
    validators: valibot(createPersonSchema),
    onUpdate: async ({ form }) => {
      if (!form.valid) return;

      $addPersonMutation.mutate(form.data);
    },
  });

  const { form: formData, message, enhance } = form;

  const createDateProxy = (fieldName: any) =>
    dateProxy(form, fieldName, { format: "date", empty: "null" });

  const dateOfBirthProxy = createDateProxy("dateOf.birth");
  const dateOfDeathProxy = createDateProxy("dateOf.death");

  $formData.treeID = treeID;

  if (personID != null) {
    $formData.partnerOf = personID;
  } else if (familyID != null) {
    const parentID = tree.families.get(familyID)!.parents[0];

    $formData.childOf = parentID;
  }
</script>

<Content class="sm:max-w-[425px]">
  <Header>
    <Title>Create {who}</Title>
  </Header>

  <form method="POST" use:enhance class="flex flex-col">
    <Field {form} name="givenNames">
      <Control let:attrs>
        <Label>Given names</Label>
        <Input
          {...attrs}
          placeholder="John"
          bind:value={$formData.givenNames}
        />
      </Control>
      <FieldErrors class="col-span-full" />
    </Field>

    <Field {form} name="familyName">
      <Control let:attrs>
        <Label>Family name</Label>
        <Input
          {...attrs}
          placeholder="Smith"
          bind:value={$formData.familyName}
        />
      </Control>
      <FieldErrors class="col-span-full" />
    </Field>

    <Field {form} name="birthName">
      <Control let:attrs>
        <Label>Birth name</Label>
        <Input
          {...attrs}
          placeholder="Waters"
          bind:value={$formData.birthName}
        />
      </Control>
      <FieldErrors class="col-span-full" />
    </Field>

    <Fieldset {form} name="dateOf" class="grid grid-cols-2 gap-12 space-y-0">
      <Field {form} name="dateOf.birth">
        <Control let:attrs>
          <Label>Birth date</Label>
          <Input {...attrs} type="date" bind:value={$dateOfBirthProxy} />
        </Control>
        <FieldErrors class="col-span-full" />
      </Field>

      <Field {form} name="dateOf.death">
        <Control let:attrs>
          <Label>Death date</Label>
          <Input {...attrs} type="date" bind:value={$dateOfDeathProxy} />
        </Control>
        <FieldErrors class="col-span-full" />
      </Field>
    </Fieldset>

    {#if $message && $message.error}
      <div class="flex flex-col gap-y-2 mb-2">
        <div class="text-[0.8rem] font-medium text-center text-destructive">
          {$message.error}
        </div>
      </div>
    {/if}

    <Footer>
      <Button type="submit">Create person</Button>
    </Footer>
  </form>
</Content>
