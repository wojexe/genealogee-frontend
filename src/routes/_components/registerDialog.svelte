<script lang="ts">
  import * as m from "$paraglide/messages";

  import { goto } from "$app/navigation";

  import { defaults, superForm } from "sveltekit-superforms";
  import { valibot } from "sveltekit-superforms/adapters";

  import { register } from "$lib/api/auth";

  import { registerSchema } from "./registerSchema";

  import { Content, Header, Title, Footer } from "$lib/components/ui/dialog";
  import {
    Button,
    Control,
    Label,
    Field,
    FieldErrors,
  } from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import FormErrors from "$lib/components/ui/form/form-errors.svelte";

  const data = defaults(valibot(registerSchema));

  const form = superForm(data, {
    SPA: true,
    resetForm: false,
    validators: valibot(registerSchema),
    onUpdate: async ({ form }) => {
      if (!form.valid) return;

      const { registered, response, error } = await register(
        form.data.email,
        form.data.name.trim(),
        form.data.password
      );

      if (registered) {
        return goto("/dashboards");
      }

      if (error) {
        form.message = {
          error: "Unable to send request to server",
          verbose: (error as TypeError).message,
        };
      } else {
        // TODO: pass translation keys from the backend OR pass proper accept-language header
        // TODO: pass the error to the email field of the form
        const reason = (await response?.json())?.reason;

        form.message = {
          error:
            reason === "A user with that email already exists"
              ? m.email_already_exists()
              : reason,
          verbose: response?.statusText,
        };
      }

      console.error(error);
    },
  });

  let { form: formData, message, enhance, submitting } = form;
</script>

<Content class="sm:max-w-[425px]">
  <Header>
    <Title>{m.register()}</Title>
  </Header>

  <form method="POST" use:enhance class="flex flex-col gap-3">
    <Field {form} name="name" class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
      <Control let:attrs>
        <Label>{m.name()}</Label>
        <Input
          {...attrs}
          autocomplete="name"
          placeholder={m.exampleName()}
          class="col-span-3"
          bind:value={$formData.name}
        />
      </Control>
      <FieldErrors class="col-span-full" />
    </Field>

    <Field {form} name="email" class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
      <Control let:attrs>
        <Label>{m.email()}</Label>
        <Input
          {...attrs}
          type="email"
          placeholder={m.exampleEmail()}
          class="col-span-3"
          bind:value={$formData.email}
        />
      </Control>
      <FieldErrors class="col-span-full" />
    </Field>

    <Field {form} name="password" class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
      <Control let:attrs>
        <Label>{m.password()}</Label>
        <Input
          {...attrs}
          type="password"
          autocomplete="new-password"
          placeholder={m.examplePassword()}
          class="col-span-3"
          bind:value={$formData.password}
        />
      </Control>
      <FieldErrors class="col-span-4" />
    </Field>

    <FormErrors error={$message?.error} />

    <Footer>
      <Button type="submit" pending={$submitting}>{m.register()}</Button>
    </Footer>
  </form>
</Content>
