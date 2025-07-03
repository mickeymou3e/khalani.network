import { call, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { getSupportedNetworksInApplication } from '@utils/network'

import { walletActions } from '../wallet.slice'
import {
  addNetworkToWallet,
  getMetamaskProviderSaga,
  switchNetwork,
} from '../wallet.utils'

export function* switchNetworkToSupportedSaga(
  action: PayloadAction<string>,
): Generator {
  const metaMaskProvider = yield* call(getMetamaskProviderSaga)
  const supportedNetworks = getSupportedNetworksInApplication()

  const chainId = action.payload

  if (!metaMaskProvider) return

  try {
    if (supportedNetworks === null) throw Error('Wrong Network configuration')

    yield* call(switchNetwork, chainId, metaMaskProvider)
    yield* put(walletActions.onNetworkChange(chainId))
  } catch (switchNetworkError) {
    if (
      switchNetworkError.code === 4902 ||
      switchNetworkError.code === -32603
    ) {
      try {
        yield* call(addNetworkToWallet, metaMaskProvider, chainId)
      } catch (addNetworkError) {
        console.error(addNetworkError)
      }
    }
    console.error(switchNetworkError)
  }
}
