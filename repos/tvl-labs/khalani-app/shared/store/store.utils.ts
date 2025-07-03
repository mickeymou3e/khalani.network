import { call, delay } from 'typed-redux-saga'

import { StoreKeys } from './store.keys'
import { StoreState } from './store.types'

export const selectReducer = <StoreKey extends StoreKeys>(
  storeKey: StoreKey,
) => {
  return (store: StoreState): StoreState[StoreKey] => {
    return store[storeKey]
  }
}

export function* pollFunctionWithDelay(
  pollingFunction: () => Generator,
  delayMs: number,
): Generator {
  while (true) {
    try {
      yield* call(pollingFunction)
    } catch (error) {
      console.error(`Error in polling function ${pollingFunction.name}:`, error)
    }
    yield* delay(delayMs)
  }
}
