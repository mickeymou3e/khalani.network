import { put, call } from 'typed-redux-saga'

import { initNetwork } from '@store/network/saga/init.saga'
import {
  initializeProviderSaga,
  initializeAddressTranslatorSaga,
} from '@store/provider/provider.initialize.saga'

import {
  checkMetaMaskInstalled,
  checkNetwork,
  checkUserAuthentication,
} from '../validators'
import { initializeWalletSaga } from '../wallet.initialize.saga'
import { walletActions } from '../wallet.slice'
import {
  ConnectionState,
  ConnectionStateStatusParams,
  ConnectionStatus,
} from '../wallet.types'
import { AuthorizeWallet, getMetamaskProvider } from '../wallet.utils'

export function* handleConnectionStateChange(
  action: ConnectionStateStatusParams,
): Generator {
  const { connectionState, status } = action.payload
  switch (connectionState) {
    case ConnectionState.None: {
      if (status === ConnectionStatus.pending) {
        const isMetamaskInstalled = yield* call(checkMetaMaskInstalled)
        const isAuthenticated = yield* call(checkUserAuthentication)
        if (isMetamaskInstalled && isAuthenticated) {
          yield* put(
            walletActions.changeConnectionStateStatus({
              connectionState: ConnectionState.Select,
              status: ConnectionStatus.success,
            }),
          )
        } else {
          yield* put(
            walletActions.changeConnectionStateStatus({
              connectionState: ConnectionState.Select,
              status: ConnectionStatus.fail,
            }),
          )
        }
      }
      return
    }
    case ConnectionState.Select: {
      if (status === ConnectionStatus.pending) {
        const isMetamaskInstalled = yield* call(checkMetaMaskInstalled)
        if (isMetamaskInstalled) {
          try {
            const metaMaskProvider = yield* call(getMetamaskProvider)
            yield* call(AuthorizeWallet, metaMaskProvider)
          } catch (_exception) {
            yield* put(
              walletActions.changeConnectionStateStatus({
                connectionState: ConnectionState.Authorize,
                status: ConnectionStatus.fail,
              }),
            )
          }
        } else {
          yield* put(
            walletActions.changeConnectionStateStatus({
              connectionState: ConnectionState.Install,
              status: ConnectionStatus.fail,
            }),
          )
        }
      } else if (status === ConnectionStatus.success) {
        yield* put(
          walletActions.changeConnectionStateStatus({
            connectionState: ConnectionState.Authorize,
            status: ConnectionStatus.pending,
          }),
        )
      }
      return
    }
    case ConnectionState.Authorize: {
      if (status === ConnectionStatus.pending) {
        const providerInitialized = yield* call(initializeProviderSaga)
        const isAuthenticated = yield* call(checkUserAuthentication)

        const addressTranslatorInitialized = yield* call(
          initializeAddressTranslatorSaga,
        )
        const walletInitialized = yield* call(initializeWalletSaga)
        if (
          isAuthenticated &&
          walletInitialized &&
          addressTranslatorInitialized &&
          providerInitialized
        ) {
          yield* put(
            walletActions.changeConnectionStateStatus({
              connectionState: ConnectionState.Authorize,
              status: ConnectionStatus.success,
            }),
          )
        } else {
          yield* put(
            walletActions.changeConnectionStateStatus({
              connectionState: ConnectionState.Authorize,
              status: ConnectionStatus.fail,
            }),
          )
        }
      } else if (status === ConnectionStatus.success) {
        yield* put(
          walletActions.changeConnectionStateStatus({
            connectionState: ConnectionState.ChangeNetwork,
            status: ConnectionStatus.pending,
          }),
        )
      }

      return
    }
    case ConnectionState.ChangeNetwork: {
      if (status === ConnectionStatus.pending) {
        const isNetworkInit = yield* call(initNetwork)
        const isCorrectNetwork = yield* call(checkNetwork)

        if (isNetworkInit && isCorrectNetwork) {
          yield* put(
            walletActions.changeConnectionStateStatus({
              connectionState: ConnectionState.Connected,
              status: ConnectionStatus.success,
            }),
          )
        } else {
          yield* put(
            walletActions.changeConnectionStateStatus({
              connectionState: ConnectionState.ChangeNetwork,
              status: ConnectionStatus.fail,
            }),
          )
        }
      }

      return
    }
  }
}
