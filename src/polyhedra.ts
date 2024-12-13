// Porting code from https://sourceforge.net/p/tom7misc/svn/HEAD/tree/trunk/ruperts/polyhedra.cc

import { SE3 } from "./lib/se3";
import { Point3 } from "./lib/types";
import { LocatedPolyhedron, Polyhedron } from "./state";
import qh, { isPointInsideHull } from 'quickhull3d';

function cbrt(x: number): number {
  return Math.pow(x, 1 / 3);
}
export function snubCube(): Polyhedron {
  const tribonacci = (1.0 + cbrt(19 + 3 * Math.sqrt(33)) + cbrt(19 - 3 * Math.sqrt(33))) / 3;

  const a = 1;
  const b = 1 / tribonacci;
  const c = tribonacci;

  const vertices: Point3[] = [];

  [0b100, 0b010, 0b001, 0b111].forEach(s => {
    const signs = {
      x: (s & 0b100) ? -1 : 1,
      y: (s & 0b010) ? -1 : 1,
      z: (s & 0b001) ? -1 : 1,
    };
    vertices.push([signs.x * a, signs.y * b, signs.z * c]);
    vertices.push([signs.x * b, signs.y * c, signs.z * a]);
    vertices.push([signs.x * c, signs.y * a, signs.z * b]);
  });

  [0b011, 0b110, 0b101, 0b000].forEach(s => {
    const signs = {
      x: (s & 0b100) ? -1 : 1,
      y: (s & 0b010) ? -1 : 1,
      z: (s & 0b001) ? -1 : 1,
    };
    vertices.push([signs.x * a, signs.y * c, signs.z * b]);
    vertices.push([signs.x * b, signs.y * a, signs.z * c]);
    vertices.push([signs.x * c, signs.y * b, signs.z * a]);
  });
  return vertices;
}

export function mkLocatedPolyhedron(pts_in_poly: Polyhedron, scene_from_poly: SE3): LocatedPolyhedron {
  return {
    pts_in_poly,
    scene_from_poly,
    faces: pts_in_poly.length > 0 ? qh(pts_in_poly) : [],
  }
}
