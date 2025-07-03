import { pick } from 'lodash'

import { RequestStatus } from '@constants/Request'
import { Address } from '@interfaces/data'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { balancesAdapter } from '../balances.slice'

const selectAll = createSelector(selectReducer(StoreKeys.Balances), (state) =>
  balancesAdapter.getSelectors().selectAll(state),
)

const selectBalances = createSelector(
  [selectReducer(StoreKeys.Balances)],
  (balancesState) => (address: Address) =>
    balancesAdapter.getSelectors().selectById(balancesState, address),
)

const selectTokenBalance = createSelector(
  selectReducer(StoreKeys.Balances),
  (state) => (walletAddress: string, tokenAddress: string) =>
    balancesAdapter.getSelectors().selectById(state, walletAddress)?.balances[
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

export const balancesSelectors = {
  loading,
  selectBalances,
  selectTokenBalance,
  selectTokensBalances,
  selectAll,
}
