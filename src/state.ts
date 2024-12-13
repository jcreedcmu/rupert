import { Quaternion } from "quaternion";
import { Effect } from "./effect";
import { SE3, mkSE3 } from "./lib/se3";
import { Point3 } from "./lib/types";
import { mkLocatedPolyhedron, snubCube } from "./polyhedra";

export type AppState = {
  counter: number,
  effects: Effect[],
  debugStr: string,
  poly1: LocatedPolyhedron,
  poly2: LocatedPolyhedron,
}

export type Polyhedron = Point3[];

export type LocatedPolyhedron = {
  pts_in_poly: Polyhedron,
  faces: number[][], // each face is a list of indices into pts_in_poly
  scene_from_poly: SE3,
}

export function mkState(): AppState {
  const poly1: LocatedPolyhedron = mkLocatedPolyhedron(
    snubCube(),
    mkSE3(new Quaternion(), [0, 0, 0]),
  );
  const poly2: LocatedPolyhedron = mkLocatedPolyhedron(
    [],
    mkSE3(new Quaternion(0, 0, 0, 1), [0, 0, 0]),
  );
  return {
    counter: 0, effects: [], debugStr: '',
    poly1,
    poly2
  };
}
