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
  const { counter, poly1, poly2 } = state;

  React.useEffect(() => {

    const x = setInterval(() => {
      dispatch({ t: 'rotatePoly1', q: new Quaternion(Math.sqrt(9994 / 10000), Math.sqrt(1 / 10000), Math.sqrt(5 / 10000), 0) });

    }, 50);
    return () => { clearInterval(x); }
  }, []);

  return <>
    <center>
      <PolyhedraCanvas dispatch={dispatch} poly1={poly1} poly2={poly2} />
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
