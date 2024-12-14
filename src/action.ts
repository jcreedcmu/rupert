import { Quaternion } from "quaternion";
import { Point } from "./lib/types";
import { PolyName } from "./state";

export type Action =
  | { t: 'increment' }
  | { t: 'side-effect' }
  | { t: 'toggleAnimation' }
  | {
    t: 'mouseDown',
    which: number, // polyhedron 1 or 2
    p_in_client: Point,
    p_in_canvas: Point
  }
  | { t: 'mouseUp' }
  | { t: 'mouseMove', p_in_client: Point }
  | { t: 'selectPoly', which: PolyName }
  ;

export type Dispatch = (action: Action) => void;
