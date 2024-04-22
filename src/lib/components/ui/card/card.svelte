<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "$lib/utils.js";

type $$Props = HTMLAttributes<HTMLDivElement> & {
  as?: string;
};

let className: $$Props["class"] = undefined;
export { className as class };

let tagName = "div";
export { tagName as as };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
  this={tagName}
  class={cn(
    "rounded-xl border bg-card text-card-foreground shadow",
    className ?? ""
  )}
  {...$$restProps}
  on:click
  on:focusin
  on:focusout
  on:mouseenter
  on:mouseleave
>
  <slot />
</svelte:element>
