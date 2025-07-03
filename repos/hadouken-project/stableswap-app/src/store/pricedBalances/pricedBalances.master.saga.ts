import { takeLatest } from 'redux-saga/effects'
import { all, call, fork, put, race, take } from 'typed-redux-saga'

import { balancesActions } from '@store/balances/balances.slice'
import { pricedBalancesActions } from '@store/pricedBalances/pricedBalances.slice'
import { updatePricedBalancesSaga } from '@store/pricedBalances/saga/update/update.saga'
import { pricesActions } from '@store/prices/prices.slice'

export function* requestUpdatePricedBalances(): Generator {
  const succeedRequests = yield* race({
    balances: take(balancesActions.updateBalancesSuccess),
    prices: take(pricesActions.updatePricesSuccess),
  })
  yield* take(
    succeedRequests.balances === undefined
      ? balancesActions.updateBalancesSuccess
      : pricesActions.updatePricesSuccess,
  )
  yield* put(pricedBalancesActions.updateRequest())
}

export function* actionHandlers(): Generator {
  yield* all([
    fork(requestUpdatePricedBalances),
    takeLatest(
      pricedBalancesActions.updateRequest.type,
      updatePricedBalancesSaga,
    ),
  ])
}

export function* pricedBalancesMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
