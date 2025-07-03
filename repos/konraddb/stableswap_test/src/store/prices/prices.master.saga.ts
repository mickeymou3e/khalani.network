import { all, call } from 'typed-redux-saga'

import { networkActions } from '@store/network/network.slice'
import { takeLatestN } from '@store/network/utils'
import { updatePricesSaga } from '@store/prices/saga/updatePrices/updatePrices.saga'

function* actionHandlers(): Generator {
  yield* all([
    takeLatestN(10, networkActions.updateLatestBlock.type, updatePricesSaga),
  ])
}

export function* pricesMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
