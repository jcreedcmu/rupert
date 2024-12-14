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


  return <>
    <center>
      <PolyhedraCanvas dispatch={dispatch} poly1={poly1} poly2={poly2} mouseState={mouseState} />
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
