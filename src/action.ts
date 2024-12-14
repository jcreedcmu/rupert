import { Quaternion } from "quaternion";
import { Point } from "./lib/types";

export type Action =
  | { t: 'increment' }
  | { t: 'side-effect' }
  | { t: 'toggleAnimation' }
  | { t: 'mouseDown', p_in_client: Point, p_in_canvas: Point }
  | { t: 'mouseUp' }
  | { t: 'mouseMove', p_in_client: Point }
  | { t: 'rotatePoly1', q: Quaternion }
  ;

export type Dispatch = (action: Action) => void;
