<script context="module" lang="ts">
  import type { Person } from "$lib/genealogee";

  type Props = {
    person: Person;
    onSubmit: () => void;
  };

  import { Content, Header, Title, Footer } from "$lib/components/ui/dialog";
</script>

<script lang="ts">
  let { person, onSubmit }: Props = $props();
</script>

<Content class="sm:max-w-[425px]">
  <Header>
    <Title>Delete {person.fullName}</Title>
  </Header>
</Content>
