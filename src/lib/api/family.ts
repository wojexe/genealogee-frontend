// Schemas

import { object, array, string, uuid } from "valibot";

export const familySchema = object({
  id: string([uuid()]),
  creatorID: string([uuid()]),
  treeID: string([uuid()]),
  parents: array(string([uuid()])),
  children: array(string([uuid()])),
});
