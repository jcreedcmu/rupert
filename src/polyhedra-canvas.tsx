import *  as React from 'react';
import { CanvasInfo, useCanvas } from './lib/use-canvas';
import { Dispatch } from './action';
import { pathCircle, pathPoly, relpos, rrelpos } from './lib/dutil';
import { LocatedPolyhedron } from './state';
import { Point, Point3 } from './lib/types';
import { apply } from './lib/se3';

export type CanvasProps = {
  dispatch: Dispatch,
  poly1: LocatedPolyhedron,
  poly2: LocatedPolyhedron,
}

export type CanvasState = {
  poly1: LocatedPolyhedron,
  poly2: LocatedPolyhedron,
}

function render(ci: CanvasInfo, state: CanvasState): void {
  const { d, size } = ci;
  d.clearRect(0, 0, size.x, size.y);

  d.fillStyle = '#def';
  d.fillRect(0, 0, size.x, size.y);

  function canvas_from_scene(pt_in_scene: Point3): Point {
    return {
      x: size.x / 2 + pt_in_scene[0] * 40,
      y: size.y / 2 + pt_in_scene[1] * 40
    };
  }

  const { pts_in_poly, scene_from_poly, faces } = state.poly1;
  const pts_in_canvas = pts_in_poly.map(pt_in_poly => {
    return canvas_from_scene(apply(scene_from_poly, pt_in_poly));
  });

  faces.forEach(face => {

    d.beginPath();

    const face_in_canvas = face.map(i => pts_in_canvas[i]);
    pathPoly(d, face_in_canvas);
    d.lineWidth = 1;
    d.strokeStyle = "gray";
    d.stroke();

  });

  pts_in_canvas.forEach(pt_in_canvas => {
    d.beginPath();
    pathCircle(d, pt_in_canvas, 3);
    d.fillStyle = "black";
    d.fill();
  });


}

function onLoad(ci: CanvasInfo): void {

}

export function PolyhedraCanvas(props: CanvasProps): JSX.Element {
  const { dispatch } = props;
  const [cref, mc] = useCanvas(props, render, [props], onLoad);
  function onMouseDown(e: React.MouseEvent): void {
    dispatch({ t: 'mouseDown', p_in_canvas: rrelpos(e) });
  }
  return <canvas onMouseDown={onMouseDown} style={{ width: 400, height: 400 }} ref={cref} />;
}
