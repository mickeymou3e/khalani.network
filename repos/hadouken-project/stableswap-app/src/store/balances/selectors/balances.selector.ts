import { pick } from 'lodash'

import { RequestStatus } from '@constants/Request'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { balancesAdapter } from '../balances.slice'

const selectAll = createSelector(selectReducer(StoreKeys.Balances), (state) =>
  balancesAdapter.getSelectors().selectAll(state),
)

const selectBalances = createSelector(
  [selectReducer(StoreKeys.Balances)],
  (balancesState) => (address: string) =>
    balancesAdapter.getSelectors().selectById(balancesState, address),
)

const selectTokenBalance = createSelector(
  selectReducer(StoreKeys.Balances),
  (state) => (walletAddress: string, tokenAddress: string) =>
    balancesAdapter.getSelectors().selectById(state, walletAddress)?.balances?.[
      tokenAddress
    ],
)

const selectTokensBalances = createSelector(
  selectReducer(StoreKeys.Balances),
  (state) => (address: string, tokensAddresses: string[]) => {
    const userEntity = balancesAdapter.getSelectors().selectById(state, address)

    return pick(userEntity?.balances, tokensAddresses)
  },
)

const loading = createSelector(
  selectReducer(StoreKeys.Balances),
  (state) => state.status === RequestStatus.Pending,
)

const isReady = createSelector(
  selectReducer(StoreKeys.Balances),
  (state) => state.status === RequestStatus.Resolved,
)

const isUserBalanceFetched = createSelector(
  [selectReducer(StoreKeys.Balances), walletSelectors.userAddress],
  (reducerState, userAddress) => {
    if (!userAddress) return false

    const userBalance = balancesAdapter
      .getSelectors()
      .selectById(reducerState, userAddress)

    if (!userBalance) return false

    return true
  },
)

export const balancesSelectors = {
  isReady,
  isUserBalanceFetched,
  loading,
  selectBalances,
  selectTokenBalance,
  selectTokensBalances,
  selectAll,
}
