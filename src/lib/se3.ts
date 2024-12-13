import { Point, Point3 } from "./types";
import { vm, vm2, vm3 } from "./vutil";
import { Quaternion } from 'quaternion';

export type SE3 = {
  rotate: Quaternion,
  translate: Point3,
}

export function mkSE3(rotate: Quaternion, translate: Point3): SE3 {
  return { rotate, translate };
}

export function apply(se3: SE3, x: Point3): Point3 {
  // XXX wrong, doesn't include translation
  return se3.rotate.rotateVector(x);
}
