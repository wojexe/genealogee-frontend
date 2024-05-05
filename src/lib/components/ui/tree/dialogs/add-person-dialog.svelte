<script context="module" lang="ts">
  import * as m from "$paraglide/messages";

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

  import type { Tree } from "$lib/genealogee";

  type Props = {
    who: "first person" | "partner" | "child";
    tree: Tree;
    treeID: string;
    familyID?: string;
    personID?: string;
    onSubmit: () => void;
  };
</script>

<script lang="ts">
  let { who, tree, treeID, familyID, personID, onSubmit }: Props = $props();

  if (familyID != null && personID != null) {
    throw new Error("One of familyID and personID must be provided");
  }

  const queryClient = useQueryClient();

  // TODO: optimistic update
  const addPersonMutation = createMutation({
    mutationFn: async (personData: CreatePersonInput) =>
      createPerson(personData),
    onSettled: async () => {
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

  const translatedWho = {
    "first person": m.first_person(),
    partner: m.partner(),
    child: m.child(),
  } as const;
</script>

<Content class="sm:max-w-[425px]">
  <Header>
    <Title>{m.addPersonDialog_title({ who: translatedWho[who] })}</Title>
  </Header>

  <form
    method="POST"
    use:enhance
    class="flex flex-col gap-3"
    onsubmit={() => onSubmit()}
  >
    <Field {form} name="givenNames">
      <Control let:attrs>
        <Label>{m.person_givenNames()}</Label>
        <Input
          {...attrs}
          placeholder={m.person_exampleGivenNames()}
          bind:value={$formData.givenNames}
        />
      </Control>
      <FieldErrors class="col-span-full" />
    </Field>

    <Field {form} name="familyName">
      <Control let:attrs>
        <Label>{m.person_familyName()}</Label>
        <Input
          {...attrs}
          placeholder={m.person_exampleFamilyName()}
          bind:value={$formData.familyName}
        />
      </Control>
      <FieldErrors class="col-span-full" />
    </Field>

    <Field {form} name="birthName">
      <Control let:attrs>
        <Label>{m.person_birthName()}</Label>
        <Input
          {...attrs}
          placeholder={m.person_exampleBirthName()}
          bind:value={$formData.birthName}
        />
      </Control>
      <FieldErrors class="col-span-full" />
    </Field>

    <Fieldset {form} name="dateOf" class="grid grid-cols-2 gap-12 space-y-0">
      <Field {form} name="dateOf.birth">
        <Control let:attrs>
          <Label>{m.person_birthDate()}</Label>
          <Input {...attrs} type="date" bind:value={$dateOfBirthProxy} />
        </Control>
        <FieldErrors class="col-span-full" />
      </Field>

      <Field {form} name="dateOf.death">
        <Control let:attrs>
          <Label>{m.person_deathDate()}</Label>
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
      <Button type="submit">{m.addPersonDialog_addPerson()}</Button>
    </Footer>
  </form>
</Content>
