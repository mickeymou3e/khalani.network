import { providers } from 'ethers'
import { call, delay, put, select, take } from 'typed-redux-saga'

import { eventChannel, EventChannel } from '@redux-saga/core'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'

export function createBlockEventChannel(
  wsProvider: providers.WebSocketProvider,
): EventChannel<number> {
  return eventChannel((emitter) => {
    const blockHandler = (blockNumber: number) => {
      emitter(blockNumber)
    }

    wsProvider.on('block', blockHandler)

    return () => {
      wsProvider.off('block', blockHandler)
    }
  })
}

export function* watchLatestBlockNumber(): Generator {
  let wsProvider = yield* select(contractsSelectors.wsProvider)

  while (!wsProvider) {
    wsProvider = yield* select(contractsSelectors.wsProvider)
    yield delay(1000)
  }

  if (wsProvider) {
    const blockEventChannel = yield* call(
      createBlockEventChannel,
      wsProvider as providers.WebSocketProvider,
    )

    while (true) {
      const blockNumber = yield* take(blockEventChannel)

      yield* put(providerActions.updateLatestBlock(blockNumber))
    }
  }
}
