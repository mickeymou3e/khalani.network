import { providers } from 'ethers'
import { PolyjuiceHttpProvider } from '@polyjuice-provider/web3';
import { PolyjuiceJsonRpcProvider } from '@polyjuice-provider/ethers';
import { PolyjuiceWebsocketProvider } from "@polyjuice-provider/ethers"
import { EthereumNetwork } from './types'

import { getNetworkName } from './utils';
import { GodwokenNetwork } from './types'
import { getConfig } from './config';


const SUPPORTED_ETHEREUM_NETWORKS = [EthereumNetwork.Rinkeby]


export const getPolyjuiceProvider = (networkId: GodwokenNetwork): providers.JsonRpcProvider => {
  const config = getConfig(networkId)

  const providerConfig = {
    rollupTypeHash: config.nervos.rollupTypeHash,
    ethAccountLockCodeHash: config.nervos.ethAccountLockCodeHash,
    web3Url: config.nervos.godwoken.rpcUrl
  }

  const httpProvider = new PolyjuiceHttpProvider(config.nervos.godwoken.rpcUrl, providerConfig);
  const web3Provider = new providers.Web3Provider(httpProvider)

  const provider = new PolyjuiceJsonRpcProvider(providerConfig, config.nervos.godwoken.rpcUrl)

  return web3Provider as providers.JsonRpcProvider
}

export const getPolujuiceWSProvider = (networkId: GodwokenNetwork): providers.WebSocketProvider => {
  const config = getConfig(networkId)

  const providerConfig = {
    rollupTypeHash: config.nervos.rollupTypeHash,
    ethAccountLockCodeHash: config.nervos.ethAccountLockCodeHash,
    web3Url: config.nervos.godwoken.rpcUrl
  }

  const provider = new PolyjuiceWebsocketProvider(providerConfig, config.nervos.godwoken.wsUrl)

  return provider as providers.WebSocketProvider
}

export const getEthereumFallbackProvider = (networkId: GodwokenNetwork): providers.JsonRpcProvider => {
  const config = getConfig(networkId)
  const ethereumNetworkId = config.ethereum.networkId as EthereumNetwork

  /** DEV network shouldn't be in prod bundle */
  if(ethereumNetworkId === EthereumNetwork.Dev && config.ethereum.fallback.rpcUrl) {
    const localProvider = new providers.JsonRpcProvider(
      config.ethereum.fallback.rpcUrl,
    )
    return localProvider
  }

  if(SUPPORTED_ETHEREUM_NETWORKS.includes(ethereumNetworkId)) {
    const infuraProvider = new providers.InfuraProvider(
      getNetworkName(ethereumNetworkId),
      config.ethereum.fallback.infura.apiKey,
    )

    return infuraProvider
  }
  
  const defaultProvider = new providers.InfuraProvider(
    getNetworkName(EthereumNetwork.Rinkeby),
    config.ethereum.fallback.infura.apiKey,
  )

  return defaultProvider
}
