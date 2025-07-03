import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { liquidationsAdapter } from './backstop.slice'

const isInitialized = createSelector(
  selectReducer(StoreKeys.Backstop),
  (state) => state.initialized,
)

const backstopToken = createSelector(
  selectReducer(StoreKeys.Backstop),
  (state) => state.backstopToken,
)

const liquidationToken = createSelector(
  selectReducer(StoreKeys.Backstop),
  (state) => state.liquidationToken,
)

const backstopTotalBalance = createSelector(
  selectReducer(StoreKeys.Backstop),
  (state) => state.backstopTotalBalance,
)

const apr = createSelector(
  selectReducer(StoreKeys.Backstop),
  (state) => state.apr,
)

const liquidations = createSelector(
  selectReducer(StoreKeys.Backstop),
  (state) => liquidationsAdapter.getSelectors().selectAll(state.liquidations),
)

const hasMore = createSelector(
  selectReducer(StoreKeys.Backstop),
  (state) => state.hasMore,
)

export const backstopSelectors = {
  isInitialized,
  backstopToken,
  liquidationToken,
  backstopTotalBalance,
  apr,
  liquidations,
  hasMore,
}
