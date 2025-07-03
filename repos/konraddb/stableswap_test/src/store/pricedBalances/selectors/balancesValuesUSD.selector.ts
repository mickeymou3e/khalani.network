import { pick } from 'lodash'

import { IToken } from '@interfaces/token'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../../store.utils'
import { balancesAdapter } from '../pricedBalances.slice'

const selectTokenValueUSD = createSelector(
  selectReducer(StoreKeys.PricedBalances),
  (state) => (walletAddress: string, tokenAddress: IToken['address']) =>
    balancesAdapter.getSelectors().selectById(state, walletAddress)?.balances[
      tokenAddress
    ],
)

const selectTokensValuesUSD = createSelector(
  selectReducer(StoreKeys.PricedBalances),
  (state) => (address: string, tokensAddresses: IToken['address'][]) => {
    const userEntity = balancesAdapter.getSelectors().selectById(state, address)

    return pick(userEntity?.balances, tokensAddresses)
  },
)

export const balancesValuesUSDSelectors = {
  selectTokenValueUSD,
  selectTokensValuesUSD,
}
