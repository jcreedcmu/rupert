import { produce } from 'immer';
import { AppState } from './state';
import { Action } from './action';
import { Quaternion } from 'quaternion';

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
    case 'mouseDown': {
      const { x, y } = action.p_in_canvas;
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
  }
}
