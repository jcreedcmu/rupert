import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { doEffect } from './effect';
import { PolyhedraCanvas } from './polyhedra-canvas';
import { extractEffects } from './lib/extract-effects';
import { useEffectfulReducer } from './lib/use-effectful-reducer';
import { reduce } from './reduce';
import { mkState } from './state';

export type AppProps = {
  color: string,
};

export function App(props: AppProps): JSX.Element {
  const [state, dispatch] = useEffectfulReducer(mkState(), extractEffects(reduce), doEffect);
  const { counter, poly1, poly2 } = state;
  return <>
    <span style={{ color: props.color }}>Hello, World!</span><p />

    <button onMouseDown={(e) => { dispatch({ t: 'increment' }) }}>Increment</button><p />
    <button onMouseDown={(e) => { dispatch({ t: 'side-effect' }) }}>Side Effect</button><p />
    <PolyhedraCanvas dispatch={dispatch} poly1={poly1} poly2={poly2} /><p />
    {state.debugStr}
  </>;
}

export function init() {
  const props: AppProps = {
    color: '#f0f',
  };
  const root = createRoot(document.querySelector('.app')!);
  root.render(<App {...props} />);
}
