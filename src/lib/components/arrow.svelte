<script lang="ts" context="module">
  type Props = {
    class?: string;
    parentElement?: any;
    from?: any;
    to?: any;
    options?: null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils";

  const { class: className, parentElement, from, to }: Props = $props();

  let sX: number = $state(0);
  let sY: number = $state(0);
  let c1X: number = $state(0);
  let c1Y: number = $state(0);
  let c2X: number = $state(0);
  let c2Y: number = $state(0);
  let eX: number = $state(0);
  let eY: number = $state(0);

  let eA: number = 270;
  let sA: number = 90;

  const paddingEnd = 8;

  $effect(() => {
    if (parentElement == null || from == null || to == null) {
      console.log("elements not yet there");
      return;
    }

    const parentRect = parentElement.getBoundingClientRect();
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    sX = fromRect.left + fromRect.width / 2 - parentRect.left;
    sY = fromRect.top - parentRect.top;

    eX = toRect.left + toRect.width / 2 - parentRect.left;
    eY = toRect.bottom - parentRect.top + paddingEnd;

    const verticalDistance = sY - eY;

    c1X = sX;
    c1Y = eY + verticalDistance / 2;

    c2X = eX;
    c2Y = sY;
  });
</script>

<svg
  class={cn(
    "absolute overflow-visible pointer-events-none stroke-foreground fill-foreground filter",
    className ?? ""
  )}
  style="--tw-drop-shadow:drop-shadow(--tw-shadow);width:100%;height:100%;top:0;left:0;"
  stroke-width="2"
>
  <circle cx={sX} cy={sY} r="2" />
  <path
    d={`M ${sX} ${sY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${eX} ${eY}`}
    fill="none"
  />
  <polygon
    stroke-linejoin="round"
    points="0,-16 2,-8, 2,8 0,16"
    transform={`translate(${eX}, ${eY}) rotate(${eA})`}
  />
</svg>
