<script context="module" lang="ts">
  import * as m from "$paraglide/messages";

  import { dateProxy, defaults, superForm } from "sveltekit-superforms";
  import { valibot } from "sveltekit-superforms/adapters";

  import {
    editPersonSchema,
    type EditPersonInput,
    editPerson,
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

  import type { Person, Tree } from "$lib/genealogee";

  type Props = {
    person: Person;
    onSubmit: () => void;
  };
</script>

<script lang="ts">
  let { person, onSubmit }: Props = $props();

  const queryClient = useQueryClient();

  // TODO: optimistic update
  const editPersonMutation = createMutation(() => ({
    mutationFn: async (personData: EditPersonInput) =>
      editPerson(person.id, personData),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tree", person.treeID],
      });
    },
  }));

  const initialData: EditPersonInput = {
    treeID: person.treeID,
    givenNames: person.givenNames,
    familyName: person.familyName,
    birthName: person.birthName,
    dateOf: {
      birth: person.dateOf?.birth ?? null,
      birthCustom: person.dateOf?.birthCustom ?? null,
      death: person.dateOf?.death ?? null,
      deathCustom: person.dateOf?.deathCustom ?? null,
    },
  };

  const form = superForm(defaults(initialData, valibot(editPersonSchema)), {
    id: `edit-${person.id}`,
    SPA: true,
    resetForm: false,
    dataType: "json",
    validators: valibot(editPersonSchema),
    onUpdate: async ({ form }) => {
      if (!form.valid) return;

      editPersonMutation.mutate(form.data);
    },
    onResult(event) {
      if (event.result.type == "success") onSubmit();
    },
  });

  const { form: formData, message, enhance, validateForm } = form;

  const createDateProxy = (fieldName: any) =>
    dateProxy(form, fieldName, { format: "date", empty: "null" });

  const dateOfBirthProxy = createDateProxy("dateOf.birth");
  const dateOfDeathProxy = createDateProxy("dateOf.death");

  validateForm({ update: true });
</script>

<Content class="sm:max-w-[425px]">
  <Header>
    <Title>{m.editPersonDialog_title({ fullName: person.fullName })}</Title>
  </Header>

  <form method="POST" use:enhance class="flex flex-col gap-3">
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
      <Button type="submit">{m.editPersonDialog_saveChanges()}</Button>
    </Footer>
  </form>
</Content>
