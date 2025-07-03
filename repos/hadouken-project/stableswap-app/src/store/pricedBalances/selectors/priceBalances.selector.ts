import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../../store.keys'
import { selectReducer } from '../../store.utils'
import { poolBalancesValuesUSDSelectors } from './pool/balancesValuesUSD.selector'
import { balancesValuesUSDSelectors } from './token/balancesValuesUSD.selector'
import { userBalancesValuesUSDSelectors } from './user/balancesValuesUSD.selector'

const isFetching = createSelector(
  selectReducer(StoreKeys.PricedBalances),
  (state) => state.isFetching,
)

export const pricedBalancesSelectors = {
  isFetching,
  ...poolBalancesValuesUSDSelectors,
  ...userBalancesValuesUSDSelectors,
  ...balancesValuesUSDSelectors,
}
