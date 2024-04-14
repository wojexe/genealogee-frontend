// Schemas

import {
  object,
  string,
  uuid,
  optional,
  date,
  nullable,
  coerce,
} from "valibot";

export const datesSchema = object({
  birth: nullable(coerce(date(), (input) => new Date(input as string))),
  birthCustom: nullable(string()),
  death: nullable(coerce(date(), (input) => new Date(input as string))),
  deathCustom: nullable(string()),
});

export const personSchema = object({
  id: string([uuid()]),
  creatorID: string([uuid()]),
  treeID: string([uuid()]),
  givenNames: string(),
  familyName: string(),
  birthName: optional(string()),
  dateOf: datesSchema,
  familyID: optional(string([uuid()])),
  parentFamilyID: optional(string([uuid()])),
});
