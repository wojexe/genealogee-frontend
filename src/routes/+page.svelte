<script lang="ts" context="module">
  import * as m from "$paraglide/messages";

  import { Root as Dialog, Trigger } from "$lib/components/ui/dialog";
  import { buttonVariants } from "$lib/components/ui/button";

  import LoginDialog from "./_components/loginDialog.svelte";
  import RegisterDialog from "./_components/registerDialog.svelte";
</script>

<!-- FIXME: content shift in dialogs -->
<div class="flex flex-col gap-3">
  <Dialog>
    <Trigger class={buttonVariants({ variant: "default" })}>
      {m.login()}
    </Trigger>

    <LoginDialog />
  </Dialog>

  <Dialog>
    <Trigger class={buttonVariants({ variant: "secondary" })}>
      {m.register()}
    </Trigger>

    <RegisterDialog />
  </Dialog>
</div>
