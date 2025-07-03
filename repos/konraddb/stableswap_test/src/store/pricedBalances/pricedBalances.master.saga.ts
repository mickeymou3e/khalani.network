import { takeLatest } from 'redux-saga/effects'
import { all, call, put } from 'typed-redux-saga'

import { balancesActions } from '@store/balances/balances.slice'
import { pricedBalancesActions } from '@store/pricedBalances/pricedBalances.slice'
import { updatePricedBalancesSaga } from '@store/pricedBalances/saga/update/update.saga'
import { pricesActions } from '@store/prices/prices.slice'

export function* watchers(): Generator {
  yield* all([])
}

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(balancesActions.updateBalancesSuccess.type, function* () {
      yield* put(pricedBalancesActions.updateRequest())
    }),
    takeLatest(pricesActions.updatePricesSuccess.type, function* () {
      yield* put(pricedBalancesActions.updateRequest())
    }),
    takeLatest(
      pricedBalancesActions.updateRequest.type,
      updatePricedBalancesSaga,
    ),
  ])
}

export function* pricedBalancesMasterSaga(): Generator {
  yield all([call(actionHandlers), call(watchers)])
}
