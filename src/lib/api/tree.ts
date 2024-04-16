import { baseURL } from "$lib/api";

import { personSchema } from "$lib/api/person";
import { familySchema } from "$lib/api/family";

import {
  object,
  uuid,
  string,
  optional,
  array,
  parse,
  type Output,
} from "valibot";

export const treeSchema = object({
  id: string([uuid()]),
  creatorID: string([uuid()]),
  name: string(),
  people: array(personSchema),
  families: array(familySchema),
  rootFamilyID: optional(string([uuid()])),
  snapshotIDs: array(string([uuid()])),
});

export type Tree = Output<typeof treeSchema>;

// API

// func boot(routes: RoutesBuilder) throws {
//   let tree = routes.grouped("tree")
//   let certainTree = tree.grouped(":treeID")
//   let snapshotTree = certainTree.grouped("snapshot")
//   let certainSnapshot = snapshotTree.grouped(":snapshotID")

//   tree.post("create", use: create)

//   certainTree.get(use: byID)
//   certainTree.delete(use: delete)

//   certainTree.post("restore", use: restoreLatestSnapshot)

//   snapshotTree.get(use: getLatestSnapshot)
//   snapshotTree.post("create", use: createSnapshot)

//   certainSnapshot.get(use: getSnapshot)
//   certainSnapshot.post("restore", use: restoreSnapshot)

//   routes.get("trees", use: all)

//   routes.delete("trees", use: nukeAllTrees)
// }

export const createTree = async (customFetch = fetch) => {
  return await customFetch(`${baseURL}/tree/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) =>
      response.ok ? response : Promise.reject(new Error(response.statusText)),
    )
    .then(async (response) => await response.json())
    .then((data) => parse(treeSchema, data));
};

export type Dashboard = Tree;

export const getDashboard = async (
  id: string,
  customFetch = fetch,
): Promise<Dashboard> => {
  parse(string([uuid()]), id);

  return await customFetch(`${baseURL}/tree/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) =>
      response.ok ? response : Promise.reject(new Error(response.statusText)),
    )
    .then(async (response) => await response.json())
    .then((data) => parse(treeSchema, data));
};

const dashboardsSchema = object({
  trees: array(treeSchema),
});

export type Dashboards = Output<typeof dashboardsSchema>;

export const getDashboards = async (
  customFetch = fetch,
): Promise<Dashboards> => {
  return await customFetch(`${baseURL}/trees`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) =>
      response.ok ? response : Promise.reject(new Error(response.statusText)),
    )
    .then(async (response) => await response.json())
    .then((data) => parse(dashboardsSchema, data));
};
