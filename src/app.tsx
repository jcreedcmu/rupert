import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { doEffect } from './effect';
import { PolyhedronControl } from './polyhedron-control';
import { extractEffects } from './lib/extract-effects';
import { useEffectfulReducer } from './lib/use-effectful-reducer';
import { reduce } from './reduce';
import { MouseState, mkState } from './state';
import { Quaternion } from 'quaternion';
import { PolyhedronComparator } from './polyhedron-comparator';
import { rawPolys } from './raw-poly';

export type AppProps = {
  color: string,
};

function isDraggingState(ms: MouseState): boolean {
  switch (ms.t) {
    case 'up': return false;
    case 'trackball': return true;
    case 'pan': return true;
  }
}

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
    if (isDraggingState(state.mouseState)) {
      document.addEventListener('mousemove', mousemove);
      return () => {
        document.removeEventListener('mousemove', mousemove);
      };
    }
  }, [state.mouseState]);

  const options = rawPolys.map(x => x.name).map(polyName => {
    return <option value={polyName}>{polyName.replace(/\b./g, x => x.toUpperCase())}</option>;
  });
  return <>
    <center>
      <select value={state.polyName}
        onChange={(e) => { dispatch({ t: 'selectPoly', which: e.currentTarget.value }) }}>
        {options}

      </select></center>
    <center>
      {[0, 1].map(which => {
        return <PolyhedronControl
          scale={40}
          dispatch={dispatch}
          poly_index={which}
          poly={polys[which]}
          mouseState={mouseState} />;
      })}
    </center>
    <center><PolyhedronComparator polys={polys} scale={140} /></center>
  </>;
}

export function init() {
  const props: AppProps = {
    color: '#f0f',
  };
  const root = createRoot(document.querySelector('.app')!);
  root.render(<App {...props} />);
}
