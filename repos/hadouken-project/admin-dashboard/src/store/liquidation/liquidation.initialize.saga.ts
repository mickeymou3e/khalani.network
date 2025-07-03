import { put, call } from 'typed-redux-saga'

import { fetchLiquidationData } from './action/fetchLiquidations'
import { liquidationsActions } from './liquidation.slice'

export function* initializeLiquidationsSaga(): Generator {
  try {
    yield* put(liquidationsActions.fetchLiquidationsRequest())
    const liquidations = yield* call(fetchLiquidationData)
    yield* put(liquidationsActions.fetchLiquidationsSuccess(liquidations))
  } catch (error) {
    yield* put(liquidationsActions.fetchLiquidationsFailure())
    console.error(error)
  }
}
