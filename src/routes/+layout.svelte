<script>
  import "../app.pcss";
  import { ParaglideJS } from "@inlang/paraglide-js-adapter-sveltekit";
  import { i18n } from "$lib/i18n";

</script>

<ParaglideJS {i18n}>
  <div class="p-6 gap-6 flex flex-col items-center justify-items-center">
    <slot />
  </div>
</ParaglideJS>
