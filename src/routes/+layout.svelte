<script lang="ts">
  import "../app.pcss";

  import { i18n } from "$lib/i18n";
  import { ParaglideJS } from "@inlang/paraglide-js-adapter-sveltekit";

  import { QueryClientProvider } from '@tanstack/svelte-query'
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools'

  import { ModeWatcher } from "mode-watcher";

  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";

  const { children, data } = $props();
  const { queryClient } = data;
</script>

<ModeWatcher />

<Badge variant="destructive" class="absolute top-5 right-5">Alpha</Badge>

<ParaglideJS {i18n}>
  <QueryClientProvider client={queryClient}>
    <Header />

    <div
      class="p-6 gap-6 flex flex-col items-center justify-items-center"
    >
      {@render children()}
    </div>

    <Footer />

    <SvelteQueryDevtools />
  </QueryClientProvider>
</ParaglideJS>


<style>
  :global(body) {
    @apply min-h-screen p-6 flex flex-col;
  }
</style>
