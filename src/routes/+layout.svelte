<script>
  import "../app.pcss";

  import { i18n } from "$lib/i18n";
  import { ParaglideJS } from "@inlang/paraglide-js-adapter-sveltekit";

  import { ModeWatcher } from "mode-watcher";

  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";

  let { children } = $props();
</script>

<ModeWatcher />

<Badge variant="destructive" class="absolute top-5 right-5">Alpha</Badge>

<ParaglideJS {i18n}>
  <Header />

  <div
    class="p-6 gap-6 flex flex-col items-center justify-items-center"
  >
    {@render children()}
  </div>

  <Footer />
</ParaglideJS>


<style>
  :global(body) {
    @apply text-primary-foreground bg-background min-h-screen p-6 flex flex-col;
  }
</style>
