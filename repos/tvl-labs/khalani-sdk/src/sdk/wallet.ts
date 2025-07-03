import { Network, stringToNetwork } from '@constants/Networks'
import { providerSelector } from '@store/provider/provider.selector'
import {
  JsonRpcProvider,
  Signer as EthersSigner,
  FallbackProvider,
} from 'ethers-v6'
import { initializeSDK } from '@store/sdk/sdk.initialize'
import { runSaga, useReduxSelector } from '@store/store.utils'
import { Signer } from './signer'
import { Address } from '@store/tokens/tokens.types'

export class Wallet {
  async initialize(provider: JsonRpcProvider, signer: EthersSigner) {
    const providerNetwork = await provider.getNetwork()
    const providerNetworkHex = '0x' + providerNetwork.chainId.toString(16)
    const network = stringToNetwork(providerNetworkHex)
    if (!network) {
      throw new Error(`Unknown network: ${providerNetworkHex}`)
    }

    const signerv5 = new Signer().getSignerv5(provider._getConnection().url)

    const userAddress = await signer.getAddress()
    const providerState = { provider, signer, signerv5, network, userAddress }
    await runSaga(initializeSDK, providerState)
  }

  getNetwork(): Network | null {
    return useReduxSelector(providerSelector.network)
  }

  getUserAddress(): Address | null {
    return useReduxSelector(providerSelector.userAddress)
  }

  getProvider(): JsonRpcProvider | FallbackProvider | null {
    return useReduxSelector(providerSelector.provider)
  }
}
