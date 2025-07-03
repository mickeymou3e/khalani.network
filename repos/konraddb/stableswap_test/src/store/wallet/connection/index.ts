import { call } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'

import { changeNetworkConnectionStageHandler } from './stages/changeNetwork'
import { connectWalletConnectionStageHandler } from './stages/connectWallet'
import { idleConnectionStageHandler } from './stages/idle'
import { selectWalletConnectionStageHandler } from './stages/selectWallet'
import { ConnectionStage, ConnectionStageType } from './types'

export function* handleConnectionStageChangeSaga(
  action: PayloadAction<ConnectionStage>,
): Generator {
  const connectionStage = action.payload

  switch (connectionStage.type) {
    case ConnectionStageType.Idle: {
      yield* call(idleConnectionStageHandler, connectionStage)
      return
    }
    case ConnectionStageType.SelectWallet: {
      yield* call(selectWalletConnectionStageHandler, connectionStage)
      return
    }
    case ConnectionStageType.ConnectWallet: {
      yield* call(connectWalletConnectionStageHandler, connectionStage)
      return
    }
    case ConnectionStageType.ChangeNetwork: {
      yield* call(changeNetworkConnectionStageHandler, connectionStage)
      return
    }
  }
}
