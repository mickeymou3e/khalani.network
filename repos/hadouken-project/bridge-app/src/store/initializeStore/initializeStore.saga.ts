import { put } from 'typed-redux-saga'

import { walletActions } from '@store/wallet/wallet.slice'
import { ConnectionState, ConnectionStatus } from '@store/wallet/wallet.types'

import { initializeStoreActions } from './initializeStore.slice'

export function* initializeStoreSaga(): Generator {
  try {
    yield* put(
      walletActions.changeConnectionStateStatus({
        connectionState: ConnectionState.None,
        status: ConnectionStatus.pending,
      }),
    )

    yield* put(initializeStoreActions.initializeStoreSuccess())
  } catch (error) {
    yield* put(initializeStoreActions.initializeStoreFailure())
  }
}
