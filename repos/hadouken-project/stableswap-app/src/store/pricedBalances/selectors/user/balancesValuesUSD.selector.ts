import { IPool } from '@interfaces/pool'
import { Balances, IToken } from '@interfaces/token'
import { createSelector } from '@reduxjs/toolkit'
import { balancesAdapter } from '@store/pricedBalances/pricedBalances.slice'
import { poolBalancesValuesUSDSelectors } from '@store/pricedBalances/selectors/pool/balancesValuesUSD.selector'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

import { balancesValuesUSDSelectors } from '../token/balancesValuesUSD.selector'

const selectUserValuesUSD = createSelector(
  [selectReducer(StoreKeys.PricedBalances), walletSelectors.userAddress],
  (balancesState, userAddress) =>
    userAddress
      ? balancesAdapter.getSelectors().selectById(balancesState, userAddress)
      : null,
)

const selectUserTokenValueUSD = createSelector(
  [balancesValuesUSDSelectors.selectTokenValueUSD, walletSelectors.userAddress],
  (selectTokenValueUSD, userAddress) => (tokenAddress: IToken['address']) =>
    userAddress ? selectTokenValueUSD(userAddress, tokenAddress) : null,
)
const selectUserTokensValuesUSD = createSelector(
  [
    balancesValuesUSDSelectors.selectTokensValuesUSD,
    walletSelectors.userAddress,
  ],
  (selectTokensValuesUSD, userAddress) => (
    tokensAddresses: IToken['address'][],
  ) =>
    userAddress ? selectTokensValuesUSD(userAddress, tokensAddresses) : null,
)

const selectUserPoolValuesUSD = createSelector(
  [
    poolBalancesValuesUSDSelectors.selectPoolValuesUSDByAddress,
    walletSelectors.userAddress,
  ],
  (
    selectPoolValuesUSDByAddress,
    userAddress,
  ): ((poolId: string) => Balances) => {
    return (poolId: IPool['id']) =>
      userAddress ? selectPoolValuesUSDByAddress(userAddress, poolId) : null
  },
)
const selectUserPoolUnderlyingValuesUSD = createSelector(
  [
    poolBalancesValuesUSDSelectors.selectPoolUnderlyingValuesUSDByAddress,
    walletSelectors.userAddress,
  ],
  (selectPoolUnderlyingValuesUSDByAddress, userAddress) => {
    return (poolId: IPool['id']) =>
      userAddress
        ? selectPoolUnderlyingValuesUSDByAddress(userAddress, poolId)
        : null
  },
)

const selectUserTotalPoolValueUSD = createSelector(
  [selectUserPoolValuesUSD],
  (selectUserPoolValuesUSD) => {
    return (poolId: IPool['id']) => {
      if (poolId) {
        const valuesUSD: Balances = selectUserPoolValuesUSD(poolId)
        const totalValueUSD =
          valuesUSD &&
          Object.keys(valuesUSD).reduce((totalValueUSD, token) => {
            if (valuesUSD) {
              const valueUSD = valuesUSD[token]

              if (valueUSD) {
                totalValueUSD.add(valueUSD)
              }
            }

            return totalValueUSD
          }, BigDecimal.from(0))

        return totalValueUSD
      }
    }
  },
)

export const userBalancesValuesUSDSelectors = {
  selectUserValuesUSD,
  selectUserTokenValueUSD,
  selectUserTokensValuesUSD,
  selectUserPoolValuesUSD,
  selectUserPoolUnderlyingValuesUSD,
  selectUserTotalPoolValueUSD,
}
