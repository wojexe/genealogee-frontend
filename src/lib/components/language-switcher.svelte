<script>
  import { availableLanguageTags, languageTag } from "$paraglide/runtime";
  import { i18n } from "$lib/i18n.js";
  import { page } from "$app/stores";

  //  TODO: make this component make sense :p
  const languages = availableLanguageTags.filter((el) => el !== languageTag());
</script>

<div class="fixed bottom-4 left-4 overflow-visible">
  {#each languages as lang}
    <a
    class="overflow-visible"
      href={i18n.route($page.url.pathname)}
      hreflang={lang}
      aria-current={lang === languageTag() ? "page" : undefined}
    >
      <span class="fi fi-{lang === 'en' ? 'us' : 'pl'} rounded-xl shadow"></span>
    </a>
  {/each}
</div>
