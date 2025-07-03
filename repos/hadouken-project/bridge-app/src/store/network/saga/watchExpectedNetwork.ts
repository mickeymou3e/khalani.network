import { put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { walletActions } from '@store/wallet/wallet.slice'
import { ConnectionState, ConnectionStatus } from '@store/wallet/wallet.types'

export function* expectedNetworkChangeSaga(
  _action: PayloadAction<number>,
): Generator {
  yield* put(
    walletActions.changeConnectionStateStatus({
      connectionState: ConnectionState.ChangeNetwork,
      status: ConnectionStatus.pending,
    }),
  )
}
