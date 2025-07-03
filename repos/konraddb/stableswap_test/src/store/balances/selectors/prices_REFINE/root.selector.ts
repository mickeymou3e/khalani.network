import { Id } from '@interfaces/data'
import { createSelector } from '@reduxjs/toolkit'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { BigDecimal } from '@utils/math'

const selectById = createSelector(
  [
    balancesSelectors.selectBalances,
    pricesSelector.selectById,
    tokenSelectors.selectById,
  ],
  (selectBalances, selectPriceById, selectTokenById) => (id: Id) => {
    const entity = selectBalances(id)

    const balances = entity?.balances
    const pricedBalances = balances
      ? Object.keys(balances)
          .map((tokenId) => selectTokenById(tokenId))
          .filter((token) => !token?.isLpToken)
          .map((token) => {
            if (!token) return BigDecimal.from(0)

            const balance = balances[token.id]
            const tokenEntity = selectPriceById(token.id)
            const price = tokenEntity?.price

            if (!price || !balance) return BigDecimal.from(0)

            const pricedBalance = price.mul(balance)

            return pricedBalance
          })
      : []

    return pricedBalances
  },
)

export const pricedBalancesSelectors = {
  selectById,
}
