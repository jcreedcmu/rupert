import { produce } from 'immer';
import { AppState, LocatedPolyhedron } from './state';
import { Action } from './action';
import { Quaternion } from 'quaternion';
import { vadd, vequal, vsnorm, vsub, vunit } from './lib/vutil';
import { getPoly, mkLocatedPolyhedron } from './polyhedra';

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
        //        s.debugStr = `clicked at (${x}, ${y})`;
      });
    }
    case 'mouseDown': {
      return produce(state, s => {
        s.mouseState = {
          t: 'drag',
          poly_index: action.which,
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
      if (state.mouseState.t == 'drag') {
        const { poly_index, init_p_in_canvas, init_p_in_client, p_in_client } = state.mouseState;

        const motion = vsub(p_in_client, action.p_in_client);
        // console.log('motion:', motion);
        // console.log('current in canvas:', vadd(init_p_in_canvas, vsub(p_in_client, init_p_in_client)));
        const newMouseState = produce(state.mouseState, s => {
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
      else
        return state;
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
  }
}
