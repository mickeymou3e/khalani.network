import { put, call } from 'typed-redux-saga'

import { fetchReserves } from '@graph/pools/queries'

import { reservesActions } from './reserves.slice'

export function* initializeReservesSaga(): Generator {
  try {
    yield* put(reservesActions.fetchReservesRequest())
    const reserves = yield* call(fetchReserves)
    yield* put(reservesActions.fetchReservesSuccess(reserves))
  } catch (error) {
    yield* put(reservesActions.fetchReservesFailure())
    console.error(error)
  }
}
