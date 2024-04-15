<script lang="ts">
  import { type Tree } from "$lib/api/tree";
  import { Button } from "$lib/components/ui/button";
  import { Card, Footer, Header, Title } from "$lib/components/ui/card";

  type Props = {
    dashboards: Array<Tree>;
  };

  let { dashboards }: Props = $props();
</script>

{#each dashboards as dashboard}
  <Card class="min-w-64">
    <Header>
      <Title>🌳 {dashboard.name} family</Title>
    </Header>
    <Footer class="place-content-end">
      <Button href={`/dashboards/${dashboard.id}`}>View</Button>
    </Footer>
  </Card>
{/each}


