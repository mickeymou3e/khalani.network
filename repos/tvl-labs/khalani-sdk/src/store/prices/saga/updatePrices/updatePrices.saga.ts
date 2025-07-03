import { Effect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import { pricesActions } from '@store/prices/prices.slice'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { chainsSelectors } from '@store/chains/chains.selector'
import { getNativeTokensPrices, getPrices } from '@dataSource/prices'

export function* updatePricesSaga(): Generator<Effect, void> {
  const tokens = yield* select(tokenSelectors.selectAll)
  const chains = yield* select(chainsSelectors.chains)

  try {
    const prices = yield* call(getPrices, tokens)
    const nativeTokensPrices = yield* call(getNativeTokensPrices, chains)
    const result = [...prices, ...nativeTokensPrices]

    yield* put(pricesActions.updatePricesSuccess(result))
  } catch (e) {
    yield* put(pricesActions.updatePricesFailure())
  }
}
