import { providers } from 'ethers'
import { call, put } from 'typed-redux-saga'

import { initializeProviderSaga } from '@store/provider/provider.initialize.saga'
import { checkAccountConnected } from '@store/wallet/connection/validators'
import { initializeWalletSaga } from '@store/wallet/wallet.initialize.saga'
import { walletActions } from '@store/wallet/wallet.slice'
import { detectMetamask } from '@store/wallet/wallet.utils'

import { ConnectionStageType, ConnectionStageStatus } from '../../../types'

export function* pendingStatusHandler(): Generator {
  const metamaskProvider = yield* call(detectMetamask)
  const providerInitialized = yield* call(
    initializeProviderSaga,
    metamaskProvider as providers.ExternalProvider,
  )
  const isAuthenticated = yield* call(checkAccountConnected)
  const addressTranslatorInitialized = 'test'
  const walletInitialized = yield* call(initializeWalletSaga)
  if (
    providerInitialized &&
    isAuthenticated &&
    walletInitialized &&
    addressTranslatorInitialized
  ) {
    yield* put(
      walletActions.changeConnectionStage({
        type: ConnectionStageType.ConnectWallet,
        status: ConnectionStageStatus.Success,
      }),
    )
  } else {
    yield* put(
      walletActions.changeConnectionStage({
        type: ConnectionStageType.ConnectWallet,
        status: ConnectionStageStatus.Fail,
      }),
    )
  }
}
