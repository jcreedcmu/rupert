import { Quaternion } from "quaternion";
import { Point } from "./lib/types";

export type Action =
  | { t: 'increment' }
  | { t: 'side-effect' }
  | { t: 'mouseDown', p_in_canvas: Point }
  | { t: 'rotatePoly1', q: Quaternion }
  ;

export type Dispatch = (action: Action) => void;
