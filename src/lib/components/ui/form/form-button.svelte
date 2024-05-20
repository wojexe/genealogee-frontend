<script lang="ts">
  import Spinner from "lucide-svelte/icons/rotate-cw";

  import * as Button from "$lib/components/ui/button";

  type $$Props = Button.Props & {
    disabled?: boolean;
    pending?: boolean;
  };
  type $$Events = Button.Events;

  export let disabled: $$Props["disabled"] = undefined;
  export let pending: $$Props["pending"] = undefined;
</script>

<Button.Root
  type="submit"
  on:click
  on:keydown
  class="flex gap-1"
  disabled={disabled || pending}
  {...$$restProps}
>
  <Spinner
    class="max-h-full -ml-1 place-self-center animate-spin transition-all duration-300 {pending
      ? 'w-4'
      : 'w-0'}"
  />
  <slot />
</Button.Root>
