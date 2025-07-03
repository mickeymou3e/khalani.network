import { all, fork, takeEvery } from 'typed-redux-saga'

import { updatePrices } from './actions/updatePrices'
import { pricesActions } from './prices.slice'
import { watchPrices } from './pricesWatcher'

export function* pricesMasterSaga(): Generator {
  yield all([
    takeEvery(pricesActions.updatePricesRequest.type, updatePrices),
    fork(watchPrices),
  ])
}
