import { Effect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import { fetchPrices } from '@dataSource/api/dia/prices'
import { pricesActions } from '@store/prices/prices.slice'
import { tokenSelectors } from '@store/tokens/tokens.selector'

export function* updatePricesSaga(): Generator<Effect, void> {
  const tokens = yield* select(tokenSelectors.selectTokens)
  try {
    const prices = yield* call(fetchPrices, tokens)

    yield* put(pricesActions.updatePricesSuccess(prices))
  } catch (e) {
    yield* put(pricesActions.updatePricesFailure())
  }
}
