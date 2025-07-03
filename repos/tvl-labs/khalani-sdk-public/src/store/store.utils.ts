import { StoreKeys } from './store.keys'
import { StoreState } from './store.types'
import { Saga } from 'redux-saga';
import { sagaMiddleware, store } from '@store/store';

export const selectReducer = <StoreKey extends StoreKeys>(
  storeKey: StoreKey,
) => {
  return (store: StoreState): StoreState[StoreKey] => {
    return store[storeKey]
  }
}

/**
 * React-like hook to select a state.
 */
export function useReduxSelector<S>(selector: (state: any) => S): S {
  return selector(store.getState());
}

export async function runSaga<S extends Saga>(saga: S, ...args: Parameters<S>): Promise<unknown> {
  return await sagaMiddleware.run(saga, ...args).toPromise();
}