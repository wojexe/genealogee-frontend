<script>
import { page } from "$app/stores";
</script>

<h1 class="text-4xl uppercase">An error occured</h1>

<div class="text-2xl">
  <span class="text-xl text-left text-gray-700">Message:</span>
  {$page?.error?.message}
</div>

<div class="text-2xl">
  <span class="text-xl text-left text-gray-700">Identifier: </span>
  <pre class="inline-block">{$page?.error?.id}</pre>
</div>
