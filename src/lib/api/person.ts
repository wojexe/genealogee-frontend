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
  parse,
  minLength,
  transform,
  toTrimmed,
  toCustom,
} from "valibot";

import { baseURL } from "$lib/api";

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

// func boot(routes: RoutesBuilder) throws {
//   let person = routes.grouped("person")
//   person.post("create", use: create)

//   let certainPerson = person.grouped(":personID")
//   certainPerson.get(use: byID)
//   certainPerson.delete(use: delete)

//   routes.get("people", use: all)
// }

// final class Create: Content, Validatable {
//   var treeID: UUID
//   var givenNames: String
//   var familyName: String
//   var birthName: String?
//   var dateOf: Dates

//   var childOf: UUID?
//   var partnerOf: UUID?

//   static func validations(_ val: inout Validations) {
//       val.add("treeID", as: UUID.self, is: .valid)
//       val.add("givenNames", as: String.self, is: .count(...128))
//       val.add("familyName", as: String.self, is: .count(...128))
//       val.add("birthName", as: String?.self, is: .nil || .count(...128), required: false)

//       val.add("dateOf") { val in
//           val.add("birth", as: Date?.self, is: .valid, required: false)
//           val.add("birthCustom", as: String?.self, is: .nil || .count(...128), required: false)
//           val.add("death", as: Date?.self, is: .valid, required: false)
//           val.add("deathCustom", as: String?.self, is: .nil || .count(...128), required: false)
//       }

//       val.add("childOf", as: UUID?.self, required: false)
//       val.add("partnerOf", as: UUID?.self, required: false)
//   }
// }

export const createPersonSchema = object(
  {
    treeID: string([uuid()]),

    givenNames: string([toTrimmed(), minLength(1)]),
    familyName: string([toTrimmed(), minLength(1)]),
    birthName: optional(
      transform(string([toTrimmed()]), (input) =>
        input.length === 0 ? undefined : input,
      ),
    ),

    dateOf: datesSchema,

    childOf: optional(string([uuid()])),
    partnerOf: optional(string([uuid()])),
  },
  // TODO: enable the following check for requests other than the first person
  // [custom(({ childOf, partnerOf }) => xor(childOf, partnerOf))],
);

export type CreatePersonInput = Output<typeof createPersonSchema>;

export const createPerson = async (
  personData: CreatePersonInput,
  customFetch = fetch,
): Promise<Person> => {
  return await customFetch(`${baseURL}/person/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(personData),
  })
    .then((response) =>
      response.ok ? response : Promise.reject(new Error(response.statusText)),
    )
    .then(async (response) => await response.json())
    .then((data) => parse(personSchema, data));
};

export const editPersonSchema = object({
  treeID: string([uuid()]),

  givenNames: string([toTrimmed(), minLength(1)]),
  familyName: string([toTrimmed(), minLength(1)]),
  birthName: optional(
    transform(string([toTrimmed()]), (input) =>
      input.length === 0 ? undefined : input,
    ),
  ),

  dateOf: datesSchema,
});

export type EditPersonInput = Output<typeof editPersonSchema>;

export const editPerson = async (
  personID: string,
  personData: EditPersonInput,
  customFetch = fetch,
): Promise<Person> => {
  return await customFetch(`${baseURL}/person/${personID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(personData),
  })
    .then((response) =>
      response.ok ? response : Promise.reject(new Error(response.statusText)),
    )
    .then(async (response) => await response.json())
    .then((data) => parse(personSchema, data));
};

export const deletePerson = async (personID: string): Promise<void> => {
  return await fetch(`${baseURL}/person/${personID}`, {
    method: "DELETE",
    credentials: "include",
  }).then((response) =>
    response.ok
      ? (null as never)
      : Promise.reject(new Error(response.statusText)),
  );
};
