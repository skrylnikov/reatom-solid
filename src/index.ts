import { Atom, AtomState, Store, Action, defaultStore, getState, isActionCreator } from '@reatom/core'
import { onCleanup, createContext, useContext, createSignal, Accessor } from "solid-js";

export const reatomContext = createContext(defaultStore);

function bindActionCreator<T>(
  store: Store,
  actionCreator: (payload: T) => Action | Action[] | void,
) {
  return (payload: T) => {
    const action = actionCreator(payload);

    if (action) {
      store.dispatch(action)
    }
  }
}

export function useAction<T = void>(
  actionCreator: (payload: T) => Action | Action[] | void,
) {
  const store = useContext(reatomContext);

  return bindActionCreator(store, actionCreator);
}


type ActionCreators<T extends any> = {
  [K in keyof T]: T[K] extends (...a: infer Args) => Action
    ? (...args: Args) => void
    : never
}


export function useAtom<T extends Atom>(
  atom: T,
): [state: Accessor<AtomState<T>>, bindedActionCreators: ActionCreators<T>] {
  const store = useContext(reatomContext);

  const [state, setState] = createSignal(getState(atom, store));

  const unsubscribe = store.subscribe(atom, (value) => {
    setState(value)
  });

  onCleanup(() => unsubscribe());
    
  return [
    state,
    Object.entries(atom).reduce((acc, [k, ac]) => {
      // @ts-expect-error
      if (isActionCreator(ac)) acc[k] = bindActionCreator(store, ac)
      return acc
    }, {} as ActionCreators<T>)
  ];
}



