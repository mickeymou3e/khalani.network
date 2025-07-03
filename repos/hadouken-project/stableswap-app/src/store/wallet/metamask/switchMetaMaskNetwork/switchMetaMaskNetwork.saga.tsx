import { call, put, select } from 'typed-redux-saga'

import { getChainConfig } from '@config'
import { networkSelectors } from '@store/network/network.selector'
import { networkActions } from '@store/network/network.slice'
import { providerSelector } from '@store/provider/provider.selector'

import { addNetworkToMetamaskWallet, switchNetwork } from '../../wallet.utils'

export function* switchMetamaskNetworkSaga(): Generator {
  const provider = yield* select(providerSelector.provider)

  const chainId = yield* select(networkSelectors.applicationChainId)

  try {
    if (!provider) throw Error('Provider not found')

    yield* call(switchNetwork, chainId, provider)

    yield* put(networkActions.updateNetwork(chainId))
  } catch (switchNetworkError) {
    if (
      switchNetworkError.code === 4902 ||
      switchNetworkError.code === -32603
    ) {
      try {
        if (!provider) throw Error('Provider not found')
        const config = getChainConfig(chainId)

        yield* call(
          addNetworkToMetamaskWallet,
          {
            chainId: config.chainId,
            chainName: config.chainName,
            nativeCurrency: {
              name: config.nativeCurrency.name,
              symbol: config.nativeCurrency.symbol,
              decimals: config.nativeCurrency.decimals,
            },
            blockExplorerUrls: [config.explorerUrl.godwoken],
            rpcUrls: [config.rpcUrl],
          },
          provider,
        )
      } catch (addNetworkError) {
        console.error('[Add network contracts]', addNetworkError)
      }
    } else {
      console.error('[Switch network contracts]', switchNetworkError)
    }
  }
}
