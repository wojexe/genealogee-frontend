<script context="module" lang="ts">
  import * as m from "$paraglide/messages";

  import { assets } from "$app/paths";

  import { Dialog, Trigger } from "$lib/components/ui/dialog";
  import { buttonVariants } from "$lib/components/ui/button";

  import LoginDialog from "./_components/loginDialog.svelte";
  import RegisterDialog from "./_components/registerDialog.svelte";

  const title = "Genealogee";
  const description =
    "Craft your family tree effortlessly with our free service featuring a user-friendly interface. Rest easy knowing your data is securely backed up on the cloud. Dive into your family history with ease, focusing solely on your own lineage.";
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="description" content={description} />

  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="{assets}/skywalkers.png" />
  <meta property="og:url" content="https://genealogee.app" />
</svelte:head>

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
