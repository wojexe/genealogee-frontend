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
  import { tick } from "svelte";

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

  const strokeWidth = 2;
  const paddingStart = 6;
  const paddingEnd = 8;

  $effect(() => {
    if (parentElement == null || from == null || to == null) {
      console.log("elements not yet there");
      return;
    }

    const resizeObserver = new ResizeObserver(() =>
      calculateArrow(parentElement, from, to)
    );

    resizeObserver.observe(parentElement);
    resizeObserver.observe(from);
    resizeObserver.observe(to);

    return () => {
      resizeObserver.disconnect();
    };
  });

  const calculateArrow = async (parent: any, from: any, to: any) => {
    await tick();

    const parentRect = parent.getBoundingClientRect();
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    sX = fromRect.left + fromRect.width / 2 - parentRect.left;
    sY = fromRect.top - parentRect.top - paddingStart;

    eX = toRect.left + toRect.width / 2 - parentRect.left;
    eY = toRect.bottom - parentRect.top + paddingEnd;

    const verticalDistance = sY - eY;

    c1X = sX;
    c1Y = eY + verticalDistance / 2;

    c2X = eX;
    c2Y = sY;
  };
</script>

<svg
  class={cn(
    "absolute overflow-visible pointer-events-none stroke-foreground fill-foreground filter",
    className ?? ""
  )}
  style="--tw-drop-shadow:drop-shadow(--tw-shadow);width:100%;height:100%;top:0;left:0;"
  stroke-width={strokeWidth}
>
  <polygon
    stroke-linejoin="round"
    points="0,8 0,-8"
    transform={`translate(${sX}, ${sY + strokeWidth / 2}) rotate(${sA})`}
  />

  <path
    d={`M ${sX} ${sY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${eX} ${eY}`}
    fill="none"
  />

  <polygon
    stroke-linejoin="round"
    points="0,-16 1,-12, 1,12 0,16"
    transform={`translate(${eX}, ${eY - strokeWidth / 2}) rotate(${eA})`}
  />
</svg>
