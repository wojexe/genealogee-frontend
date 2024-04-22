import type { Family as FamilyType } from "$lib/api/family";

class Family {
  id;
  creatorID;
  treeID;
  parents = $state<FamilyType["parents"]>([]);
  children = $state<FamilyType["children"]>([]);

  constructor(family: FamilyType) {
    this.id = family.id;
    this.creatorID = family.creatorID;
    this.treeID = family.treeID;
    this.parents = family.parents;
    this.children = family.children;
  }
}

export { Family };
