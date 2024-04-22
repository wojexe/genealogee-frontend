import type { Dates as DatesType, Person as PersonType } from "$lib/api/person";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { Date } from "svelte/reactivity";

class Person implements PersonType {
  id;
  creatorID;
  treeID;
  givenNames = $state<PersonType["givenNames"]>("");
  familyName = $state<PersonType["familyName"]>("");
  birthName = $state<PersonType["birthName"]>(undefined);
  dateOf = $state<PersonType["dateOf"]>(undefined);
  familyID = $state<PersonType["familyID"]>(undefined);
  parentFamilyID = $state<PersonType["parentFamilyID"]>(undefined);

  constructor(person: PersonType) {
    this.id = person.id;
    this.creatorID = person.creatorID;
    this.treeID = person.treeID;
    this.givenNames = person.givenNames;
    this.familyName = person.familyName;
    this.birthName = person.birthName;
    this.dateOf = new Dates(person.dateOf);
    this.familyID = person.familyID;
    this.parentFamilyID = person.parentFamilyID;
  }
}

class Dates implements DatesType {
  birth = $state<DatesType["birth"]>(null);
  birthCustom = $state<DatesType["birthCustom"]>(null);
  death = $state<DatesType["death"]>(null);
  deathCustom = $state<DatesType["deathCustom"]>(null);

  constructor(dates: DatesType | undefined) {
    this.birth = dates?.birth != null ? new Date(dates.birth) : null;
    this.birthCustom = dates?.birthCustom ?? null;
    this.death = dates?.death != null ? new Date(dates.death) : null;
    this.deathCustom = dates?.deathCustom ?? null;
  }
}

export { Person, Dates };
