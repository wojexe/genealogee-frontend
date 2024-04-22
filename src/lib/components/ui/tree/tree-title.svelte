<script lang="ts">
import { Card, Content } from "$lib/components/ui/card";

const { title } = $props();
</script>

<Card class="bg-secondary rounded-full">
  <Content class=" py-1">{title}</Content>
</Card>
