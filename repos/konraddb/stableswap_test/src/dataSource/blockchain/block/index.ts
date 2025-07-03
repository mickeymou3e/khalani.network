import { providers } from 'ethers'
import { call, put, select, take } from 'typed-redux-saga'

import { eventChannel, EventChannel } from '@redux-saga/core'
import { networkActions } from '@store/network/network.slice'
import { providerSelector } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { EventName } from '@store/provider/provider.types'

export function createBlockEventChannel(
  wsProvider: providers.WebSocketProvider,
): EventChannel<number> {
  return eventChannel((emitter) => {
    const blockHandler = (blockNumber: number) => {
      emitter(blockNumber)
    }

    wsProvider.on(EventName.Block, blockHandler)

    return () => {
      wsProvider.off(EventName.Block, blockHandler)
    }
  })
}

export function* watchLatestBlockNumber(): Generator {
  yield* take(providerActions.initializeProviderSuccess)

  const wsProvider = yield* select(providerSelector.wsProvider)
  if (wsProvider) {
    const blockEventChannel = yield* call(createBlockEventChannel, wsProvider)

    while (true) {
      const latestBlockNumber = yield* take(blockEventChannel)

      yield* put(networkActions.updateLatestBlock(latestBlockNumber))
    }
  }
}
