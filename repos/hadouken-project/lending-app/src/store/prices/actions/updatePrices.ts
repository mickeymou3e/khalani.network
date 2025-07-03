import { put } from 'typed-redux-saga'

import { pricesActions } from '../prices.slice'

export function* updatePrices(
  action: ReturnType<typeof pricesActions['updatePricesRequest']>,
): Generator {
  yield* put(pricesActions.updatePricesSuccess(action.payload))
}
