<script lang="ts">
  import "../app.pcss";
  import "/node_modules/flag-icons/css/flag-icons.min.css";

  import { tick } from "svelte";
  import { browser, dev } from "$app/environment";

  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

  import { i18n } from "$lib/i18n";
  import { ParaglideJS } from "@inlang/paraglide-sveltekit";

  import { QueryClientProvider } from "@tanstack/svelte-query";

  import { ModeWatcher } from "mode-watcher";

  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import LanguageSwitcher from "$lib/components/language-switcher.svelte";

  const { children, data } = $props();
  const { queryClient } = data;

  (async () => {
    if (dev && browser) {
      await tick()
      document.title = `🔧 ${document.title}`
    }
  })()
</script>

<ModeWatcher />

{#if dev}
  <Badge variant="destructive" class="absolute top-5 right-5">Development</Badge>
{/if}

<ParaglideJS {i18n}>
  <QueryClientProvider client={queryClient}>
    <Header />

    <div
      class="p-6 gap-6 flex flex-col items-center justify-items-center"
    >
      {@render children()}
    </div>

    <Footer />

    {#if dev}
      <SvelteQueryDevtools />
    {/if}

    <LanguageSwitcher />
  </QueryClientProvider>
</ParaglideJS>

<style>
  :global(body) {
    @apply min-h-screen p-6 flex flex-col;
  }
</style>
