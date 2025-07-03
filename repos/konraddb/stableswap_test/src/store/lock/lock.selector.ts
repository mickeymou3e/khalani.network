import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { ILockRequest } from './lock.types'

const lock = createSelector(
  [selectReducer(StoreKeys.Lock)],
  (reducerState) =>
    ({
      user: reducerState?.user,
      token: reducerState?.token,
      amount: reducerState?.amount,
      destinationChain: reducerState?.destinationChain,
    } as ILockRequest),
)

const lockReady = createSelector(
  [selectReducer(StoreKeys.Lock)],
  (reduceState) => !!reduceState,
)

const lockLoading = createSelector(
  [selectReducer(StoreKeys.Lock)],
  (reducerState) => reducerState?.loading,
)

const destinationChain = createSelector(
  [selectReducer(StoreKeys.Lock)],
  (reducerState) => {
    return reducerState?.destinationChain
  },
)

export const lockSelectors = {
  lock,
  lockReady,
  lockLoading,
  destinationChain,
}
