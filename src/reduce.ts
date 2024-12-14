import { produce } from 'immer';
import { AppState } from './state';
import { Action } from './action';
import { Quaternion } from 'quaternion';
import { vadd, vequal, vsnorm, vsub, vunit } from './lib/vutil';

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
    case 'rotatePoly1': {
      const new_rotate = new Quaternion(state.poly1.scene_from_poly.rotate).mul(action.q);
      return produce(state, s => {
        s.counter += 1;
        s.poly1.scene_from_poly.rotate = new_rotate;
      });

    }
    case 'mouseDown': {
      return produce(state, s => {
        s.mouseState = {
          t: 'drag',
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
        const { init_p_in_canvas, init_p_in_client, p_in_client } = state.mouseState;

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
        const newRot = extraRot.mul(new Quaternion(state.poly1.scene_from_poly.rotate));
        return produce(state, s => {
          s.mouseState = newMouseState;
          s.poly1.scene_from_poly.rotate = newRot;
        });
      }
      else
        return state;
    }
  }
}
