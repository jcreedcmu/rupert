import { Quaternion } from "quaternion";
import { Point } from "./lib/types";
import { PolyName } from "./state";

export type Action =
  | { t: 'increment' }
  | { t: 'side-effect' }
  | { t: 'toggleAnimation' }
  | {
    t: 'mouseDown',
    poly_index: number,
    p_in_client: Point,
    p_in_canvas: Point
  }
  | { t: 'mouseUp' }
  | { t: 'mouseMove', p_in_client: Point }
  | { t: 'selectPoly', which: PolyName }
  | { t: 'reset', poly_index: number }
  ;

export type Dispatch = (action: Action) => void;
