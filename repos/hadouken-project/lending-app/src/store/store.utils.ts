import { StoreKeys } from './store.keys'
import { StoreState } from './store.types'

export const selectReducer = <StoreKey extends StoreKeys>(
  storeKey: StoreKey,
) => {
  return (store: StoreState): StoreState[StoreKey] => {
    return store[storeKey]
  }
}
