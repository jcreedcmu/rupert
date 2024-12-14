import *  as React from 'react';
import { LocatedPolyhedron } from "./state";
import { CanvasInfo, useCanvas } from './lib/use-canvas';
import { Point, Point3 } from './lib/types';
import { apply } from './lib/se3';
import { pathCircle, pathPoly } from './lib/dutil';
import { makeHull } from './convex-hull';

export type PolyhedronComparatorProps = {
  polys: LocatedPolyhedron[],
  scale: number,
};

export type RenderState = {
  polys: LocatedPolyhedron[],
  scale: number,
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

  function draw_poly(poly: LocatedPolyhedron) {
    const { pts_in_poly, scene_from_poly } = poly;
    const pts_in_canvas = pts_in_poly.map(pt_in_poly => {
      return canvas_from_scene(apply(scene_from_poly, pt_in_poly));
    });

    const hull = makeHull(pts_in_canvas);
    pathPoly(d, hull);
    d.stroke();
    hull.forEach(pt_in_canvas => {
      d.beginPath();
      pathCircle(d, pt_in_canvas, 3);
      d.fillStyle = "black";
      d.fill();
    });
  }

  draw_poly(state.polys[0]);
  draw_poly(state.polys[1]);
}


function onLoad(ci: CanvasInfo): void {

}
