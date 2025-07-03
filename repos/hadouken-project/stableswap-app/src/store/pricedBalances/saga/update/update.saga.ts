import { uniq } from 'lodash'
import { Effect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import { Balances, IToken } from '@interfaces/token'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'

import { pricedBalancesActions } from '../../pricedBalances.slice'
import { IBalance } from '../../pricedBalances.types'

export function* updatePricedBalancesSaga(): Generator<Effect, void> {
  const tokens = yield* select(tokenSelectors.selectAllTokens)

  const balancesAll = yield* select(balancesSelectors.selectAll)
  const selectPricesManyById = yield* select(pricesSelector.selectManyByIds)

  const prices = yield* call(
    selectPricesManyById,
    balancesAll.reduce(
      (tokens, { balances }) =>
        balances
          ? uniq([...tokens, ...Object.keys(balances)])
          : uniq([...tokens]),
      [] as IToken['id'][],
    ),
  )

  try {
    const pricedBalancesAll: IBalance[] = []
    for (const balances of balancesAll) {
      if (tokens && balances && prices && prices.length > 0) {
        const pricedBalancesByTokenId =
          balances?.balances &&
          Object.keys(balances?.balances).reduce((pricedBalances, id) => {
            const balance = balances?.balances?.[id]

            const token = tokens.find((token) => token.id === id)

            if (!token) {
              return {
                ...pricedBalances,
                [id]: null,
              } as Balances
            }

            const priceEntity = prices.find((price) => price?.id === id)

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
            } as Balances
          }, {} as IBalance['balances'])

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
