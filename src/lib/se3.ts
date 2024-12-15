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
  return v3add(se3.rotate.rotateVector(x), se3.translate);
}

export const dimensions = [0, 1, 2];

export function v3add(a: Point3, b: Point3): Point3 {
  return dimensions.map(d => a[d] + b[d]) as Point3;
}
