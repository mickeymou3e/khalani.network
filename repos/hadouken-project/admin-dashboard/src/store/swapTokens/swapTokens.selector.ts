import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { swapTokensAdapter } from './swapTokens.slice'

export const selectAll = createSelector(
  selectReducer(StoreKeys.SwapTokens),
  (state) => {
    const tokens = swapTokensAdapter.getSelectors().selectAll(state)

    return tokens
  },
)

export const swapTokensSelectors = {
  selectAll,
}
