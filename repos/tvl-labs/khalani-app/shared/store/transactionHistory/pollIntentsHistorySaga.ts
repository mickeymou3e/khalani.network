import { fork } from 'typed-redux-saga'

import { getDepositHistorySaga, getIntentsHistorySaga } from '@tvl-labs/sdk'

import { pollFunctionWithDelay } from '../store.utils'

export function* pollIntentsHistorySaga(): Generator {
  yield* fork(pollFunctionWithDelay, getIntentsHistorySaga, 3000)
  yield* fork(pollFunctionWithDelay, getDepositHistorySaga, 3000)
}
