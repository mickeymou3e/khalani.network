import { call, put, select } from 'typed-redux-saga'

import config from '@config'
import { networkSelectors } from '@store/network/network.selector'

import { walletActions } from '../wallet.slice'
import {
  addBinanceNetworkToWallet,
  addGodwokenNetworkToWallet,
  getMetamaskProvider,
  switchNetwork,
} from '../wallet.utils'

export function* switchNetworkToSupportedSaga(): Generator {
  const metaMaskProvider = yield* call(getMetamaskProvider)
  const expectedNetwork = yield* select(networkSelectors.expectedNetwork)

  if (!metaMaskProvider) return

  try {
    if (expectedNetwork === null) throw Error('Wrong Network configuration')

    yield* call(switchNetwork, expectedNetwork, metaMaskProvider)
    yield* put(walletActions.onNetworkChange(expectedNetwork))
  } catch (switchNetworkError) {
    if (
      switchNetworkError.code === 4902 ||
      switchNetworkError.code === -32603
    ) {
      try {
        if (
          expectedNetwork.toString() === config.bridge.bsc.chainId.toString()
        ) {
          yield* call(addBinanceNetworkToWallet, metaMaskProvider)
        } else {
          yield* call(addGodwokenNetworkToWallet, metaMaskProvider)
        }
      } catch (addNetworkError) {
        console.error(addNetworkError)
      }
    }
    console.error(switchNetworkError)
  }
}
