import { produce } from 'immer';
import { AppState, LocatedPolyhedron } from './state';
import { Action } from './action';
import { Quaternion } from 'quaternion';
import { vadd, vequal, vscale, vsnorm, vsub, vunit } from './lib/vutil';
import { getPoly, mkLocatedPolyhedron } from './polyhedra';
import { v3add } from './lib/se3';
import { Point3 } from './lib/types';

export function reduceMouseMove(state: AppState, action: Action & { t: 'mouseMove' }): AppState {
  const ms = state.mouseState;
  switch (ms.t) {
    case 'trackball': {
      const { poly_index, init_p_in_canvas, init_p_in_client, p_in_client } = ms;

      const motion = vsub(p_in_client, action.p_in_client);
      const newMouseState = produce(ms, s => {
        s.p_in_client = action.p_in_client;
      });

      if (vequal(motion, { x: 0, y: 0 })) return state;

      const nmotion = vunit(motion);
      const theta = vsnorm(motion) * 0.015;
      const c = Math.cos(theta / 2);
      const s = Math.sin(theta / 2);
      const extraRot = new Quaternion(c, -s * nmotion.y, s * nmotion.x, 0);
      const newRot = extraRot.mul(new Quaternion(state.polys[poly_index].scene_from_poly.rotate));
      return produce(state, s => {
        s.mouseState = newMouseState;
        s.polys[poly_index].scene_from_poly.rotate = newRot;
      });
    }
    case 'pan': {
      const { poly_index, init_p_in_canvas, init_p_in_client, p_in_client } = ms;

      const motion = vsub(p_in_client, action.p_in_client);
      const newMouseState = produce(ms, s => {
        s.p_in_client = action.p_in_client;
      });

      if (vequal(motion, { x: 0, y: 0 })) return state;

      const nmotion = vscale(motion, -0.01);

      const extraTrans: Point3 = [nmotion.x, nmotion.y, 0];
      const newTrans = v3add(state.polys[poly_index].scene_from_poly.translate, extraTrans);
      return produce(state, s => {
        s.mouseState = newMouseState;
        s.polys[poly_index].scene_from_poly.translate = newTrans;
      });
    }
    case 'up': return state;
  }
}

export function reduce(state: AppState, action: Action): AppState {
  switch (action.t) {
    case 'increment': {
      return produce(state, s => {
        s.counter++;
      });
    }
    case 'side-effect': {
      return produce(state, s => {
        s.effects.push({ t: 'alert' });
      });
    }
    case 'toggleAnimation': {
      return produce(state, s => {
        s.isAnimating = !state.isAnimating;
      });
    }
    case 'mouseDown': {
      return produce(state, s => {
        s.mouseState = {
          t: action.modifiers.shift ? 'pan' : 'trackball',
          poly_index: action.poly_index,
          init_p_in_canvas: action.p_in_canvas,
          init_p_in_client: action.p_in_client,
          p_in_client: action.p_in_client
        }
      });
    }
    case 'mouseUp': {
      return produce(state, s => {
        s.mouseState = { t: 'up' }
      });
    }
    case 'mouseMove': {
      return reduceMouseMove(state, action);
    }
    case 'selectPoly': {
      const newPoints = getPoly(action.which);
      const newPolys: LocatedPolyhedron[] = state.polys.map(oldPoly => {
        return mkLocatedPolyhedron(newPoints, oldPoly.scene_from_poly);
      });
      return produce(state, s => {
        s.polyName = action.which;
        s.polys = newPolys;
      });
    }
    case 'reset': {
      return produce(state, s => {
        s.polys[action.poly_index].scene_from_poly = { rotate: new Quaternion(), translate: [0, 0, 0] };
      });
    }
  }
}
