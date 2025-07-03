import { fork } from 'typed-redux-saga'

import { updatePricesSaga } from '@tvl-labs/sdk'

import { pollFunctionWithDelay } from '../store.utils'

export function* pollPricesSaga(): Generator {
  yield* fork(pollFunctionWithDelay, updatePricesSaga, 5000)
}
