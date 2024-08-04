import type { Tree } from "./tree.svelte";

import type { Family as FamilyType } from "$lib/api/family";
import type { Person as PersonType } from "$lib/api/person";
import type { Tree as TreeType } from "$lib/api/tree";

import { Person } from "./person.svelte";

class Family {
  tree: Tree;

  id;
  creatorID;
  treeID;
  parents = $state<FamilyType["parents"]>([]);
  children = $state<FamilyType["children"]>([]);

  constructor(family: FamilyType, tree: Tree) {
    this.tree = tree;

    this.id = family.id;
    this.creatorID = family.creatorID;
    this.treeID = family.treeID;
    this.parents = family.parents;
    this.children = family.children;
  }

  joinedParentNames(): string {
    const parents = this.parents.map((parentID) =>
      this.tree.people.get(parentID),
    );

    if (parents.some((person) => person == null)) {
      throw new Error("Parent not found");
    }

    return parents
      .map((person) => Person.fullName(person as PersonType))
      .join(" & ");
  }

  public static joinedParentNames(
    parentIDs: FamilyType["parents"],
    people: TreeType["people"],
  ): string {
    const parents = parentIDs.map((parentID) =>
      people.find(({ id }) => id === parentID),
    );

    if (parents.some((person) => person == null)) {
      throw new Error("Parent not found");
    }

    return parents
      .map((person) => Person.fullName(person as PersonType))
      .join(" & ");
  }
}

export { Family };
