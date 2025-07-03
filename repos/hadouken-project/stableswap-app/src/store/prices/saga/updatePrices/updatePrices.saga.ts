import { Effect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import { fetchPrices } from '@dataSource/api/dia/prices'
import { waitForPoolsAndTokensBeFetched } from '@store/deposit/saga/editor/utils'
import { networkSelectors } from '@store/network/network.selector'
import { pricesActions } from '@store/prices/prices.slice'
import { tokenSelectors } from '@store/tokens/tokens.selector'

import { queryTokenPrices } from '../../../../dataSource/graph/prices'
import { BigDecimal } from '../../../../utils/math'
import { IPrice } from '../../prices.types'

export function* updatePricesSaga(): Generator<Effect, void> {
  try {
    yield* call(waitForPoolsAndTokensBeFetched)
    const standardTokens = yield* select(tokenSelectors.selectTokens)
    const lpTokens = yield* select(tokenSelectors.selectLPTokens)
    const chainId = yield* select(networkSelectors.applicationChainId)
    const prices = yield* call(fetchPrices, standardTokens, chainId)
    const graphqlPrices = yield* call(queryTokenPrices)
    const lpPrices = graphqlPrices.reduce((prices, graphPrice) => {
      const token = lpTokens.find(
        (lpToken) => lpToken.address === graphPrice.address,
      )
      if (token && graphPrice.latestUSDPrice) {
        prices.push({
          id: graphPrice.address,
          price: BigDecimal.fromString(graphPrice.latestUSDPrice, 27),
        })
      }

      return prices
    }, [] as IPrice[])
    yield* put(pricesActions.updatePricesSuccess([...prices, ...lpPrices]))
  } catch (e) {
    yield* put(pricesActions.updatePricesFailure())
  }
}
