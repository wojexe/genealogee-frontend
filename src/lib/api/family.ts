// Schemas

import { type InferOutput, array, object, string, uuid, pipe } from "valibot";

export type Family = InferOutput<typeof familySchema>;

export const familySchema = object({
  id: pipe(string(), uuid()),
  creatorID: pipe(string(), uuid()),
  treeID: pipe(string(), uuid()),
  parents: array(pipe(string(), uuid())),
  children: array(pipe(string(), uuid())),
});
