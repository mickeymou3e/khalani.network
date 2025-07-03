import { put, call } from 'typed-redux-saga'

import { fetchReserves as fetchReservesQuery } from '@graph/pools/queries'

import { reservesActions } from '../reserves.slice'

export function* fetchReserves(): Generator {
  try {
    const reserveInfos = yield* call(fetchReservesQuery)

    yield* put(reservesActions.fetchReservesSuccess(reserveInfos))
  } catch (error) {
    yield* put(reservesActions.fetchReservesFailure())
    console.error(error)
  }
}
