<script lang="ts">
import { goto } from "$app/navigation";
import { page } from "$app/stores";

import { logout as requestLogout } from "$lib/api/auth";
import * as m from "$paraglide/messages";
import Button from "./ui/button/button.svelte";
import { Root as Card, Content } from "./ui/card";

let links = [
  { href: "/about", text: m.aboutUs() },
  {
    href: "https://github.com/wojexe/genealogee-frontend",
    text: m.sourceCode(),
  },
];

const authenticatedRoute = (routeID: string | null) => routeID?.startsWith("/(authenticated)");

async function logout() {
  const { loggedOut, response, error } = await requestLogout();

  if (loggedOut) {
    return goto("/");
  }

  // TODO: send a toasts for below
  if (response) {
    console.error(response);
  }

  if (error) {
    console.error(error);
  }
}
</script>

<Card class="bg-secondary w-fit flex flex-row self-center rounded-full">
  <Content class="p-2">
    {#each links as link}
      <Button variant="link" href={link.href}>{link.text}</Button>
    {/each}

    {#if authenticatedRoute($page.route.id)}
      <Button variant="link" on:click={() => logout()}>{m.log_out()}</Button>
    {/if}
  </Content>
</Card>
