import { call, select, take } from 'typed-redux-saga'

import { updateLatestBlock } from '../'
import { walletSelectors } from '../wallet.selector'
import { walletActions } from '../wallet.slice'

export function* waitForLatestBlockToBeUpdated(
  blockNumber: number | undefined,
): Generator {
  if (!blockNumber) {
    yield* call(updateLatestBlock)
  } else {
    let blockUpToDate = false
    while (!blockUpToDate) {
      yield* take(walletActions.updateLatestBlock)
      const latestBlockNumber = yield* select(walletSelectors.latestBlock)
      if (latestBlockNumber) {
        blockUpToDate = blockNumber <= latestBlockNumber
      }
    }
  }
}
