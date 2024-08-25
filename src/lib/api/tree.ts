import { baseURL } from "$lib/api";

import { familySchema } from "$lib/api/family";
import { personSchema } from "$lib/api/person";

import {
  type InferOutput,
  array,
  object,
  optional,
  parse,
  string,
  uuid,
  pipe,
} from "valibot";

export const treeSchema = object({
  id: pipe(string(), uuid()),
  creatorID: pipe(string(), uuid()),
  name: string(),

  people: array(personSchema),
  families: array(familySchema),

  rootFamilyID: optional(pipe(string(), uuid())),
  snapshotIDs: array(pipe(string(), uuid())),
});

export type Tree = InferOutput<typeof treeSchema>;
export type Dashboard = Tree;

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

export const deleteTree = async (
  treeID: string,
  customFetch = fetch,
): Promise<void> => {
  parse(pipe(string(), uuid()), treeID);

  return await customFetch(`${baseURL}/tree/${treeID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((response) =>
    response.ok
      ? (null as never)
      : Promise.reject(new Error(response.statusText)),
  );
};

export const createTree = async (
  name: string | undefined = undefined,
  rootFamilyID = null,
  customFetch = fetch,
): Promise<Tree> => {
  const body = {
    name: name ?? "",
    rootFamilyID,
  };

  return await customFetch(`${baseURL}/tree/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  })
    .then((response) =>
      response.ok ? response : Promise.reject(new Error(response.statusText)),
    )
    .then(async (response) => await response.json())
    .then((data) => parse(treeSchema, data));
};

export const getDashboard = async (
  id: string,
  customFetch = fetch,
): Promise<Dashboard> => {
  parse(pipe(string(), uuid()), id);

  return await customFetch(`${baseURL}/tree/${id}`, {
    method: "GET",
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

export type Dashboards = InferOutput<typeof dashboardsSchema>;

export const getDashboards = async (
  customFetch = fetch,
): Promise<Dashboards> => {
  return await customFetch(`${baseURL}/trees`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) =>
      response.ok ? response : Promise.reject(new Error(response.statusText)),
    )
    .then(async (response) => await response.json())
    .then((data) => parse(dashboardsSchema, data));
};
