import { FillStructure } from '@interfaces/outcome'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { ethers } from 'ethers-v6'

const selectAll = createSelector(
  [selectReducer(StoreKeys.Intents)],
  (state) => state.history,
)

const isLoading = createSelector(
  [selectReducer(StoreKeys.Intents)],
  (state) => state.isFetching,
)

const isInitialized = createSelector(
  [selectReducer(StoreKeys.Intents)],
  (state) => state.isInitialized,
)

const liquidityIntents = createSelector([selectAll], (intents) => {
  return (
    intents &&
    intents.filter(
      (intent) =>
        intent.intent.outcome.fillStructure ===
          FillStructure.PercentageFilled &&
        intent.intent.nonce < ethers.MaxUint256 / 2n,
    )
  )
})

const bridgeIntents = createSelector([selectAll], (intents) => {
  return (
    intents &&
    intents.filter(
      (intent) => intent.intent.outcome.fillStructure === FillStructure.Exact,
    )
  )
})

const activeLiquidityIntents = createSelector([selectAll], (intents) => {
  return (
    intents &&
    intents.filter(
      (intent) =>
        intent.intent.outcome.fillStructure ===
          FillStructure.PercentageFilled &&
        !intent.transactions.cancel_tx_hash &&
        !intent.transactions.withdraw_timestamp &&
        !intent.transactions.redeem_tx_hash &&
        !intent.transactions.error_type,
    )
  )
})

export const intentsSelectors = {
  isLoading,
  isInitialized,
  selectAll,
  liquidityIntents,
  bridgeIntents,
  activeLiquidityIntents,
}
