import { call, put, select } from 'typed-redux-saga'

import { getChainConfig } from '@store/chains/saga/getChainConfig.saga'
import { networkSelectors } from '@store/network/network.selector'
import { networkActions } from '@store/network/network.slice'
import { providerSelector } from '@store/provider/provider.selector'

import { addNetworkToMetamaskWallet, switchNetwork } from '../../wallet.utils'

export function* switchMetamaskNetworkSaga(): Generator {
  const expectedNetwork = yield* select(networkSelectors.expectedNetwork)
  const provider = yield* select(providerSelector.provider)
  const networkConfig = yield* call(getChainConfig, expectedNetwork)

  try {
    networkConfig.isDefault
      ? yield* call(switchNetwork, expectedNetwork, provider)
      : yield* call(addNetworkToMetamaskWallet, networkConfig, provider)
    yield* put(networkActions.updateNetwork(expectedNetwork))
  } catch (switchNetworkError) {
    console.error('[Switch network contracts]', switchNetworkError)
  }
}
