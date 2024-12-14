import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { doEffect } from './effect';
import { PolyhedraCanvas } from './polyhedra-canvas';
import { extractEffects } from './lib/extract-effects';
import { useEffectfulReducer } from './lib/use-effectful-reducer';
import { reduce } from './reduce';
import { mkState } from './state';
import { Quaternion } from 'quaternion';

export type AppProps = {
  color: string,
};

export function App(props: AppProps): JSX.Element {
  const [state, dispatch] = useEffectfulReducer(mkState(), extractEffects(reduce), doEffect);
  const { counter, poly1, poly2, isAnimating, mouseState } = state;

  function mouseup(e: MouseEvent) {
    dispatch({ t: 'mouseUp' });
  }

  function mousemove(e: MouseEvent): void {
    dispatch({ t: 'mouseMove', p_in_client: { x: e.clientX, y: e.clientY } });
  }

  React.useEffect(() => {
    document.addEventListener('mouseup', mouseup);
    return () => {
      document.removeEventListener('mouseup', mouseup);
    };
  }, []);

  React.useEffect(() => {
    if (state.mouseState.t == 'drag') {
      document.addEventListener('mousemove', mousemove);
      return () => {
        document.removeEventListener('mousemove', mousemove);
      };
    }
  }, [state.mouseState]);

  return <>
    <center>
      <PolyhedraCanvas dispatch={dispatch} which={1} poly={poly1} mouseState={mouseState} />
    </center>
    <center>
      <PolyhedraCanvas dispatch={dispatch} which={2} poly={poly2} mouseState={mouseState} />
    </center>
  </>;
}

export function init() {
  const props: AppProps = {
    color: '#f0f',
  };
  const root = createRoot(document.querySelector('.app')!);
  root.render(<App {...props} />);
}
