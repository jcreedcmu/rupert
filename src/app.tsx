import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { doEffect } from './effect';
import { PolyhedronControl } from './polyhedron-control';
import { extractEffects } from './lib/extract-effects';
import { useEffectfulReducer } from './lib/use-effectful-reducer';
import { reduce } from './reduce';
import { mkState } from './state';
import { Quaternion } from 'quaternion';
import { PolyhedronComparator } from './polyhedron-comparator';

export type AppProps = {
  color: string,
};

export function App(props: AppProps): JSX.Element {
  const [state, dispatch] = useEffectfulReducer(mkState(), extractEffects(reduce), doEffect);
  const { counter, polys, isAnimating, mouseState } = state;

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
      {[0, 1].map(which => {
        return <PolyhedronControl
          scale={40}
          dispatch={dispatch}
          which={which}
          poly={polys[which]}
          mouseState={mouseState} />;
      })}
    </center>
    <center><PolyhedronComparator polys={polys} scale={80} /></center>
  </>;
}

export function init() {
  const props: AppProps = {
    color: '#f0f',
  };
  const root = createRoot(document.querySelector('.app')!);
  root.render(<App {...props} />);
}
