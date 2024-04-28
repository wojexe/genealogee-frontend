import type { Family as FamilyType } from "$lib/api/family";
import type { Person as PersonType } from "$lib/api/person";
import type { Tree as TreeType } from "$lib/api/tree";

import { Family } from "$lib/genealogee/family.svelte";
import { Person } from "$lib/genealogee/person.svelte";

// biome-ignore lint/suspicious/noShadowRestrictedNames: Reactive map
import { Map } from "svelte/reactivity";

class Tree implements Omit<TreeType, "people" | "families"> {
  #id;
  #creatorID;

  #name = $state<TreeType["name"]>("");

  #people = new Map<PersonType["id"], Person>();
  #families = new Map<FamilyType["id"], Family>();
  #parents = new Map<PersonType["id"], FamilyType["id"]>();

  #rootFamilyID = $state<TreeType["rootFamilyID"]>(undefined);
  #snapshotIDs = $state<TreeType["snapshotIDs"]>([]);

  constructor(tree: TreeType) {
    console.warn("NEW TREE CONSTRUCTED", tree.id);

    this.#id = tree.id;
    this.#creatorID = tree.creatorID;
    this.#name = tree.name;

    this.#rootFamilyID = tree.rootFamilyID;
    this.#snapshotIDs = tree.snapshotIDs;

    for (let person of tree.people) {
      this.#people.set(person.id, new Person(person));
    }

    for (const family of tree.families) {
      this.#families.set(family.id, new Family(family));

      for (let parentID of family.parents) {
        this.#parents.set(parentID, family.id);
      }
    }
  }

  get id() {
    return this.#id;
  }

  get creatorID() {
    return this.#creatorID;
  }

  get name() {
    if (this.#name) {
      return this.#name;
    }

    let name: string;
    if (this.#rootFamilyID) {
      name = "rootFamilyID's";
    } else {
      name = "Untitled";
    }

    return `${name} family`;
  }

  get people() {
    return this.#people;
  }

  get families() {
    return this.#families;
  }

  get parents() {
    return this.#parents;
  }

  get rootFamilyID() {
    return this.#rootFamilyID;
  }

  get snapshotIDs() {
    return this.#snapshotIDs;
  }
}

export { Tree };
