<script lang="ts">
  import * as m from "$paraglide/messages";

  import { goto } from "$app/navigation";

  import { defaults, superForm } from "sveltekit-superforms";
  import { valibot } from "sveltekit-superforms/adapters";

  import { login } from "$lib/api/auth";

  import { loginSchema } from "./loginSchema";

  import Spinner from "lucide-svelte/icons/rotate-cw";
  import { Button } from "$lib/components/ui/button";
  import { Content, Header, Title, Footer } from "$lib/components/ui/dialog";
  import { Control, Label, Field, FieldErrors } from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";

  const data = defaults(valibot(loginSchema));

  const form = superForm(data, {
    SPA: true,
    resetForm: false,
    validators: valibot(loginSchema),
    onUpdate: async ({ form }) => {
      if (!form.valid) return;

      const { loggedIn, response, error } = await login(
        form.data.email,
        form.data.password
      );

      if (loggedIn) {
        return goto("/dashboards");
      }

      if (error) {
        form.message = {
          error: "Unable to send request to server",
          verbose: (error as TypeError).message,
        };
      } else {
        form.message = {
          error: (await response?.json())?.reason,
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
    <Title>Login</Title>
  </Header>

  <form method="POST" use:enhance class="flex flex-col">
    <Field {form} name="email" class="grid grid-cols-4 items-center gap-x-4">
      <Control let:attrs>
        <Label>Email</Label>
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

    <Field {form} name="password" class="grid grid-cols-4 items-center gap-x-4">
      <Control let:attrs>
        <Label>Password</Label>
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

    {#if $message && $message.error}
      <div class="flex flex-col gap-y-2 mb-2">
        <div class="text-[0.8rem] font-medium text-center text-destructive">
          {$message.error}
        </div>

        <!--
          {#if $message.verbose != null}
            <pre
              class="text-[0.8rem] text-primary bg-secondary rounded-lg flex justify-center
                    place-self-center px-2 py-1 border-red-700 border-solid border">{$message.verbose}</pre>
          {/if}
        -->
      </div>
    {/if}

    <Footer>
      <Spinner
        class="place-self-center animate-spin transition-all {$submitting
          ? 'opacity-100'
          : 'opacity-0'}"
      />
      <Button type="submit" disabled={$submitting}>Log in</Button>
    </Footer>
  </form>
</Content>
