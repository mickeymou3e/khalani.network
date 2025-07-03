import { fork } from 'typed-redux-saga'

import {
  updateBalancesSaga,
  updateCurrentChainBalancesSaga,
  updateMTokenBalancesSaga,
  updateNativeBalancesSaga,
} from '@tvl-labs/sdk'

import { pollFunctionWithDelay } from '../store.utils'

export function* pollBalancesSaga(): Generator {
  yield* fork(pollFunctionWithDelay, updateCurrentChainBalancesSaga, 3000)
  yield* fork(pollFunctionWithDelay, updateBalancesSaga, 3000)
  yield* fork(pollFunctionWithDelay, updateMTokenBalancesSaga, 3000)
  yield* fork(pollFunctionWithDelay, updateNativeBalancesSaga, 3000)
}
