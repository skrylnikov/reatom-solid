import { Atom, Store, Action } from '@reatom/core'
import { createState, onCleanup, createContext, useContext } from "solid-js";

const defaultMapper = (atomValue: any) => atomValue

export const context = createContext<Store | null>(null);

export const { Provider: ReatomProvider } = context;

export function createAtomHook(ctx = context) { 
  const useAtom = <TI, TO = TI>(atom: Atom<TI>, selector: (atomValue: TI) => TO = defaultMapper,) => {
    const store = useContext(ctx);
    
    if (!store) throw new Error('[reatom] The provider is not defined');
    
    const [state, setState] = createState({value:   selector(store.getState(atom))});

    const unsubscribe = store.subscribe(atom, (value) => {
      setState('value', selector(value))
    }
      );
    onCleanup(() => unsubscribe());
      
    return state;
  }

  return useAtom;
}

export const useAtom = createAtomHook();

type AnyActionCreator = (...args: any[]) => Action<any> | void

export function createActionHook(ctx = context) {
  function useAction<AC extends AnyActionCreator>(
    cb: AC,
  ): (...args: Parameters<AC>) => void
  function useAction(cb: () => Action<any> | void, deps?: any[]): () => void
  function useAction<T>(
    cb: (a: T) => Action<any> | void,
  ): (payload: T) => void
  function useAction(
    cb: AnyActionCreator,
  ): (...args: any[]) => void {
    const store = useContext(ctx)

    if (!store) throw new Error('[reatom] The provider is not defined')
    if (typeof cb !== 'function') {
      throw new TypeError('[reatom] `useAction` argument must be a function')
    }

    return (...args) => {
      const action = cb(...args)
      if (action) store.dispatch(action)
    };
  }

  return useAction;
}

export const useAction = createActionHook();
