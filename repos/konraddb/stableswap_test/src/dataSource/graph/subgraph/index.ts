import { select, take } from 'typed-redux-saga'

import { networkSelectors } from '@store/network/network.selector'
import { networkActions } from '@store/network/network.slice'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function* waitForSubgraphToBeUpToDate(
  blockNumber: number | undefined,
): Generator {
  if (!blockNumber) return false

  let blockUpToDate = false
  while (!blockUpToDate) {
    yield* take(networkActions.updateLatestBlock)
    const latestBlockNumber = yield* select(networkSelectors.latestBlock)
    if (latestBlockNumber) {
      blockUpToDate = blockNumber <= latestBlockNumber
    }
  }
}
