<script>
  import * as m from "$paraglide/messages";

  let links = [
    { href: "/", text: m.aboutUs() },
    { href: "/", text: m.sourceCode() },
    { href: "/", text: m.madeWith() }
  ]
</script>

<div class="text-primary bg-secondary w-fit flex flex-row gap-6 self-center content-center p-4 rounded-full">
{#each links as link}
    <a class="hover:underline" href={link.href}>{link.text}</a>
  {/each}
</div>
