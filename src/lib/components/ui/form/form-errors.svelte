<script lang="ts" context="module">
  type Props = {
    error?: string;
  };
</script>

<script lang="ts">
  const { error }: Props = $props();
</script>

{#if error}
  <div class="flex flex-col gap-y-2">
    <div class="text-[0.8rem] font-medium text-center text-destructive">
      {error}
    </div>
  </div>
{/if}
