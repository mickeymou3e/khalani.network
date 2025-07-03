import { providers } from 'ethers'
import { call, put } from 'typed-redux-saga'

import { initializeProviderSaga } from '@store/provider/provider.initialize.saga'
import { providerActions } from '@store/provider/provider.slice'
import { walletActions } from '@store/wallet/wallet.slice'

import { connectMetamaskWallet, detectMetamask } from '../../../../wallet.utils'
import {
  ConnectionStageStatus,
  ConnectionStageType,
  SelectWalletPendingPayload,
  WalletType,
} from '../../../types'

export function* pendingStatusHandler(
  payload?: SelectWalletPendingPayload,
): Generator {
  if (!payload) {
    const metamaskProvider = yield* call(detectMetamask)

    if (metamaskProvider) {
      try {
        const provider = yield* call(
          initializeProviderSaga,
          metamaskProvider as providers.ExternalProvider,
        )
        if (!provider) throw Error('provider not found')
        yield* call(connectMetamaskWallet, provider)

        yield* put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.SelectWallet,
            status: ConnectionStageStatus.Success,
          }),
        )
      } catch (error) {
        yield* put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.ConnectWallet,
            status: ConnectionStageStatus.Fail,
          }),
        )
      }
    } else {
      yield* put(providerActions.initializeProviderFailure())
      yield* put(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.InstallWallet,
          status: ConnectionStageStatus.Fail,
        }),
      )
    }
  }

  if (payload && payload.type === WalletType.MetaMask) {
    const metamaskProvider = yield* call(detectMetamask)
    if (metamaskProvider) {
      try {
        const provider = yield* call(
          initializeProviderSaga,
          metamaskProvider as providers.ExternalProvider,
        )

        if (!provider) throw Error('provider not found')

        yield* call(connectMetamaskWallet, provider)

        yield* put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.SelectWallet,
            status: ConnectionStageStatus.Success,
          }),
        )
      } catch (error) {
        yield* put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.ConnectWallet,
            status: ConnectionStageStatus.Fail,
          }),
        )
      }
    } else {
      yield* put(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.InstallWallet,
          status: ConnectionStageStatus.Fail,
        }),
      )
    }
  }
}
