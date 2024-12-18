import *  as React from 'react';
import { CanvasInfo, useCanvas } from './lib/use-canvas';
import { Dispatch } from './action';
import { pathCircle, pathPoly, relpos, rrelpos } from './lib/dutil';
import { LocatedPolyhedron, MouseState } from './state';
import { Point, Point3 } from './lib/types';
import { apply } from './lib/se3';

export type CanvasProps = {
  poly_index: number,
  dispatch: Dispatch,
  poly: LocatedPolyhedron,
  mouseState: MouseState,
  scale: number,
}

export type RenderState = {
  poly: LocatedPolyhedron,
  scale: number,
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

  const { pts_in_poly, scene_from_poly, faces } = state.poly;
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

export function PolyhedronControl(props: CanvasProps): JSX.Element {
  const { dispatch, poly_index } = props;
  const [cref, mc] = useCanvas(props, render, [props], onLoad);

  function mousedown(e: React.MouseEvent): void {
    dispatch({
      t: 'mouseDown', poly_index, p_in_canvas: rrelpos(e),
      p_in_client: { x: e.clientX, y: e.clientY },
      modifiers: { shift: e.shiftKey },
    });
  }

  const rv = props.poly.scene_from_poly.rotate.toVector();
  const tv = props.poly.scene_from_poly.translate;
  const quaternionText = <div className="transform">{JSON.stringify({ rotation: rv, translation: [tv[0], tv[1]] })}</div>;
  return <div className="polyhedron-control-container">
    <canvas onMouseDown={mousedown} style={{ width: 400, height: 400 }} ref={cref} />

    {quaternionText}<p />
    <button onClick={() => { dispatch({ t: 'reset', poly_index: poly_index }) }}>Reset</button>
  </div>;
}
