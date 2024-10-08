import type { Dates as DatesType, Person as PersonType } from "$lib/api/person";

import { SvelteDate } from "svelte/reactivity";

class Person implements PersonType {
  id;
  creatorID;
  treeID;
  givenNames = $state<PersonType["givenNames"]>("");
  familyName = $state<PersonType["familyName"]>("");
  birthName = $state<PersonType["birthName"]>(undefined);
  dateOf = $state<Dates | undefined>(undefined);
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

  get fullName() {
    return Person.fullName(this);
  }

  public static fullName(person: PersonType) {
    return `${person.givenNames} ${person.familyName}${
      person.birthName != null ? `-${person.birthName}` : ""
    }`;
  }
}

class Dates implements DatesType {
  birth = $state<DatesType["birth"]>(null);
  birthCustom = $state<DatesType["birthCustom"]>(null);
  death = $state<DatesType["death"]>(null);
  deathCustom = $state<DatesType["deathCustom"]>(null);

  constructor(dates: DatesType | undefined) {
    this.birth = dates?.birth != null ? new SvelteDate(dates.birth) : null;
    this.birthCustom = dates?.birthCustom ?? null;
    this.death = dates?.death != null ? new SvelteDate(dates.death) : null;
    this.deathCustom = dates?.deathCustom ?? null;
  }

  public hasAnyDate() {
    return (
      this.birth != null ||
      this.birthCustom != null ||
      this.death != null ||
      this.deathCustom != null
    );
  }
}

export { Person, Dates };
