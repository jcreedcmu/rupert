import { Point, Point3 } from "./types";
import { vm, vm2, vm3 } from "./vutil";

type Quaternion = { r: number, i: number, j: number, k: number };

export type SE3 = {
  rotate: Quaternion,
  translate: Point3,
}

export function mkSE3(rotate: Quaternion, translate: Point3): SE3 {
  return { rotate, translate };
}
