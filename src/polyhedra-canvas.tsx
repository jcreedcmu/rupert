import *  as React from 'react';
import { CanvasInfo, useCanvas } from './lib/use-canvas';
import { Dispatch } from './action';
import { pathCircle, relpos, rrelpos } from './lib/dutil';
import { LocatedPolyhedron } from './state';
import { Point, Point3 } from './lib/types';

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
  state.poly1.pts_in_poly.forEach(pt_in_poly => {
    // XXX should apply scene_from_poly
    const pt_in_canvas = canvas_from_scene(pt_in_poly);

    console.log(pt_in_canvas);
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
