// Schemas

import {
  type Output,
  coerce,
  date,
  nullable,
  object,
  optional,
  string,
  uuid,
} from "valibot";

export type Dates = Output<typeof datesSchema>;

export const datesSchema = object({
  birth: nullable(coerce(date(), (input) => new Date(input as string))),
  birthCustom: nullable(string()),
  death: nullable(coerce(date(), (input) => new Date(input as string))),
  deathCustom: nullable(string()),
});

export type Person = Output<typeof personSchema>;

export const personSchema = object({
  id: string([uuid()]),
  creatorID: string([uuid()]),
  treeID: string([uuid()]),
  givenNames: string(),
  familyName: string(),
  birthName: optional(string()),
  dateOf: optional(datesSchema),
  familyID: optional(string([uuid()])),
  parentFamilyID: optional(string([uuid()])),
});
