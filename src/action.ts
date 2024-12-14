import { Quaternion } from "quaternion";
import { Point } from "./lib/types";

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
  ;

export type Dispatch = (action: Action) => void;
