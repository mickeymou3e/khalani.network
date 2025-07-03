import { BigNumber } from 'ethers'
import { uniq } from 'lodash'
import { Effect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import { PRICE_DECIMALS } from '@dataSource/api/dia/prices/constants'
import { createPrice } from '@dataSource/api/dia/prices/utils'
import { IToken } from '@interfaces/token'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { BigDecimal } from '@utils/math'
import { isDebtToken } from '@utils/token'

import { pricedBalancesActions } from '../../pricedBalances.slice'
import { IBalance } from '../../pricedBalances.types'

export function* updatePricedBalancesSaga(): Generator<Effect, void> {
  const tokens = yield* select(tokenSelectors.selectTokens)
  const balancesAll = yield* select(balancesSelectors.selectAll)
  const selectPricesManyById = yield* select(pricesSelector.selectManyByIds)

  const prices = yield* call(
    selectPricesManyById,
    balancesAll.reduce(
      (tokens, { balances }) => uniq([...tokens, ...Object.keys(balances)]),
      [] as IToken['id'][],
    ),
  )

  try {
    const pricedBalancesAll: IBalance[] = []
    for (const balances of balancesAll) {
      if (tokens && balances && prices) {
        const pricedBalancesByTokenId = Object.keys(balances?.balances).reduce(
          (pricedBalances, id) => {
            const balance = balances?.balances[id]

            const token = tokens.find((token) => token.id === id)

            if (!token) {
              return {
                ...pricedBalances,
                [id]: null,
              }
            }

            /* TODO: Populate prices for debt tokens
                     Using 1 USD as price for debt tokens
             */
            const priceEntity = !isDebtToken(token?.address)
              ? prices.find((price) => price?.id === id)
              : createPrice(
                  BigDecimal.from(
                    BigNumber.from(10).pow(PRICE_DECIMALS),
                    PRICE_DECIMALS,
                  ),
                  token,
                )

            if (balance && token && priceEntity?.price) {
              const pricedBalance = priceEntity.price.mul(balance)

              return {
                ...pricedBalances,
                [id]: pricedBalance,
              }
            }

            return {
              ...pricedBalances,
              [id]: null,
            }
          },
          {} as IBalance['balances'],
        )

        const pricedBalances: IBalance = {
          id: balances.id,
          balances: pricedBalancesByTokenId,
        }
        pricedBalancesAll.push(pricedBalances)
      }
    }

    yield* put(pricedBalancesActions.updateSuccess(pricedBalancesAll))
  } catch (e) {
    console.error(e)
  }
}
