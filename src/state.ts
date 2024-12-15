import { Quaternion } from "quaternion";
import { Effect } from "./effect";
import { SE3, mkSE3 } from "./lib/se3";
import { Point, Point3 } from "./lib/types";
import { mkLocatedPolyhedron, snubCube } from "./polyhedra";

export type MouseState =
  | { t: 'up' }
  | {
    t: 'trackball',
    poly_index: number,
    init_p_in_canvas: Point,
    init_p_in_client: Point,
    p_in_client: Point,
  }
  | {
    t: 'pan',
    poly_index: number,
    init_p_in_canvas: Point,
    init_p_in_client: Point,
    p_in_client: Point,
  }
  ;



export type AppState = {
  counter: number,
  effects: Effect[],
  debugStr: string,
  polyName: string,
  polys: LocatedPolyhedron[],
  isAnimating: boolean,
  mouseState: MouseState,
}

export type Polyhedron = Point3[];

export type LocatedPolyhedron = {
  pts_in_poly: Polyhedron,
  faces: number[][], // derived from pts_in_poly; each face is a list of indices into pts_in_poly
  scene_from_poly: SE3,
}

export function mkState(): AppState {
  const poly1: LocatedPolyhedron = mkLocatedPolyhedron(
    snubCube(),
    mkSE3(new Quaternion(), [0, 0, 0]),
  );
  const poly2: LocatedPolyhedron = mkLocatedPolyhedron(
    snubCube(),
    mkSE3(new Quaternion(), [0, 0, 0]),
  );
  return {
    polyName: 'snub cube',
    counter: 0, effects: [], debugStr: '',
    polys: [poly1, poly2],
    isAnimating: true,
    mouseState: { t: 'up' },
  };
}
