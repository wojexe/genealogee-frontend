// Schemas

import { type Output, array, object, string, uuid } from "valibot";

export type Family = Output<typeof familySchema>;

export const familySchema = object({
  id: string([uuid()]),
  creatorID: string([uuid()]),
  treeID: string([uuid()]),
  parents: array(string([uuid()])),
  children: array(string([uuid()])),
});
