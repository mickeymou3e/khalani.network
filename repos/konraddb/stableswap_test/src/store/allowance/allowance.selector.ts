import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../store.utils'

const allowances = createSelector(
  selectReducer(StoreKeys.Allowance),
  (reducerState) => reducerState.allowances,
)
export const allowanceSelectors = {
  allowances,
}
