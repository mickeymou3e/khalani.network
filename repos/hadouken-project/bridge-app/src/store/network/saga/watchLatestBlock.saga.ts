import { providers } from 'ethers'
import { call, put, select, take } from 'typed-redux-saga'

import { eventChannel, EventChannel } from '@redux-saga/core'
import { networkActions } from '@store/network/network.slice'
import { providerSelectors } from '@store/provider/provider.selectors'
import { providerActions } from '@store/provider/provider.slice'
import { EventName } from '@store/provider/provider.types'

export function createBlockEventChannel(
  wsProvider: providers.WebSocketProvider,
): EventChannel<number> {
  return eventChannel((emmiter) => {
    const blockHandler = (blockNumber: number) => {
      emmiter(blockNumber)
    }

    wsProvider.on(EventName.Block, blockHandler)

    return () => {
      wsProvider.off(EventName.Block, blockHandler)
    }
  })
}

export function* watchLatestGodwokenBlockNumber(): Generator {
  yield* take(providerActions.initializeProviderSuccess)

  const wsGodwokenProvider = yield* select(providerSelectors.wsGodwokenProvider)
  const blockEventChannel = yield* call(
    createBlockEventChannel,
    wsGodwokenProvider,
  )

  while (true) {
    const latestBlockNumber = yield* take(blockEventChannel)
    yield* put(networkActions.updateLatestBlock(latestBlockNumber))
  }
}
