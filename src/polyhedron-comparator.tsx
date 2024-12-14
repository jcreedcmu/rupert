import *  as React from 'react';
import { LocatedPolyhedron } from "./state";
import { CanvasInfo, useCanvas } from './lib/use-canvas';
import { Point, Point3 } from './lib/types';
import { apply } from './lib/se3';
import { pathCircle, pathPoly } from './lib/dutil';
import { makeHull } from './convex-hull';
import { vsub, xprod } from './lib/vutil';

export type PolyhedronComparatorProps = {
  polys: LocatedPolyhedron[],
  scale: number,
};

export type RenderState = {
  polys: LocatedPolyhedron[],
  scale: number,
}

// Return true if point is inside the halfplane defined by the rhs of
// the segment fst --- snd.
function pointSideTest(point: Point, fst: Point, snd: Point): boolean {
  return xprod(vsub(point, fst), vsub(snd, fst)) > 0;
}

function pointInConvexPoly(point: Point, poly: Point[]): boolean {
  for (let i = 0; i < poly.length; i++) {
    const fst = poly[i];
    const snd = poly[(i + 1) % poly.length];
    if (!pointSideTest(point, fst, snd)) return false;
  }
  return true;
}

export function PolyhedronComparator(props: PolyhedronComparatorProps): JSX.Element {
  const { polys } = props;
  const [cref, mc] = useCanvas(props, render, [props], onLoad);
  return <canvas style={{ width: 400, height: 400 }} ref={cref} />;

}

function render(ci: CanvasInfo, state: RenderState): void {
  const { scale } = state;
  const { d, size } = ci;
  d.clearRect(0, 0, size.x, size.y);


  function canvas_from_scene(pt_in_scene: Point3): Point {
    return {
      x: size.x / 2 + pt_in_scene[0] * scale,
      y: size.y / 2 + pt_in_scene[1] * scale,
    };
  }

  function draw_hull(hull: Point[], error_k?: (point_in_canvas: Point) => boolean) {
    pathPoly(d, hull);
    d.stroke();
    hull.forEach(pt_in_canvas => {
      d.beginPath();
      pathCircle(d, pt_in_canvas, 3);
      d.fillStyle = "black";
      if (error_k != undefined) {
        if (error_k(pt_in_canvas)) {
          d.fillStyle = "red";
        }
        else {
          d.fillStyle = "#070";
        }
      }
      else
        d.fillStyle = "black";
      d.fill();
    });
  }

  function hull_in_canvas_from(poly: LocatedPolyhedron): Point[] {
    const { pts_in_poly, scene_from_poly } = poly;
    const pts_in_canvas = pts_in_poly.map(pt_in_poly => {
      return canvas_from_scene(apply(scene_from_poly, pt_in_poly));
    });
    return makeHull(pts_in_canvas);
  }

  const hulls_in_canvas = state.polys.map(hull_in_canvas_from);
  draw_hull(hulls_in_canvas[0]);
  draw_hull(hulls_in_canvas[1], x => !pointInConvexPoly(x, hulls_in_canvas[0]));
}


function onLoad(ci: CanvasInfo): void {

}
