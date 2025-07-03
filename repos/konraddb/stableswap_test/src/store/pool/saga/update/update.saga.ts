import { call, put } from 'typed-redux-saga'

import { fetchPools } from '@dataSource/graph/pools'

import { poolsActions } from '../../pool.slice'

export function* updateSaga(): Generator {
  try {
    const pools = yield* call(fetchPools)

    yield* put(poolsActions.updateSuccess(pools))
  } catch (error) {
    yield* put(poolsActions.updateError())
    console.error(error)
  }
}
