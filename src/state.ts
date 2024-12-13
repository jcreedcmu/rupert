import { Effect } from "./effect";
import { SE3, mkSE3 } from "./lib/se3";
import { Point3 } from "./lib/types";
import { snubCube } from "./polyhedra";

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
  scene_from_poly: SE3,
}

export function mkState(): AppState {
  const poly1: LocatedPolyhedron = {
    pts_in_poly: snubCube(),
    scene_from_poly: mkSE3({ i: 0, j: 0, k: 0, r: 1 }, [0, 0, 0]),
  };
  return {
    counter: 0, effects: [], debugStr: '',
    poly1,
    poly2: { pts_in_poly: [], scene_from_poly: mkSE3({ i: 0, j: 0, k: 0, r: 1 }, [0, 0, 0]) },
  };
}
