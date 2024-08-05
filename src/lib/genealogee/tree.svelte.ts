import type { Family as FamilyType } from "$lib/api/family";
import type { Person as PersonType } from "$lib/api/person";
import type { Tree as TreeType } from "$lib/api/tree";

import { Family } from "$lib/genealogee/family.svelte";
import { Person } from "$lib/genealogee/person.svelte";

// biome-ignore lint/suspicious/noShadowRestrictedNames: Reactive map
import { SvelteMap } from "svelte/reactivity";

import * as m from "$paraglide/messages";

class Tree implements Omit<TreeType, "people" | "families"> {
  #id;
  #creatorID;

  #name = $state<TreeType["name"]>("");

  #people = new SvelteMap<PersonType["id"], Person>();
  #families = new SvelteMap<FamilyType["id"], Family>();
  #parents = new SvelteMap<PersonType["id"], FamilyType["id"]>();

  #rootFamilyID = $state<TreeType["rootFamilyID"]>(undefined);
  #snapshotIDs = $state<TreeType["snapshotIDs"]>([]);

  constructor(tree: TreeType) {
    this.#id = tree.id;
    this.#creatorID = tree.creatorID;
    this.#name = tree.name;

    this.#rootFamilyID = tree.rootFamilyID;
    this.#snapshotIDs = tree.snapshotIDs;

    for (let person of tree.people) {
      this.#people.set(person.id, new Person(person));
    }

    for (const family of tree.families) {
      this.#families.set(family.id, new Family(family, this));

      for (let parentID of family.parents) {
        this.#parents.set(parentID, family.id);
      }
    }

    // console.log(`Tree#${tree.id} constructed`);
  }

  get id() {
    return this.#id;
  }

  get creatorID() {
    return this.#creatorID;
  }

  get name() {
    if (this.#name) return this.#name;
    if (this.#rootFamilyID == null) return m.tree_untitled();

    const rootFamily = this.families.get(this.#rootFamilyID);
    if (rootFamily == null) throw new Error("Root family not found");

    const name = `${rootFamily.joinedParentNames()}`;
    // Capitalize first letter
    const displayName = m.family_display_name({ name });
    return displayName[0].toUpperCase() + displayName.slice(1);
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

  // TODO: find a way to merge with `get name()`
  public static createName(
    customName: TreeType["name"],
    people: TreeType["people"],
    families: TreeType["families"],
    rootFamilyID: TreeType["rootFamilyID"],
  ) {
    if (customName) return customName;

    const rootFamily = families.find((f) => f.id === rootFamilyID);
    if (rootFamily == null) return m.tree_untitled();

    const name = Family.joinedParentNames(rootFamily.parents, people);

    // Capitalize first letter
    const displayName = m.family_display_name({ name });
    return displayName[0].toUpperCase() + displayName.slice(1);
  }
}

export { Tree };
