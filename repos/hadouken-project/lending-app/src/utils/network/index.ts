import config from '@config'
import {
  getNetworkName,
  getSupportedNetworks,
} from '@hadouken-project/lending-contracts'

import { ENVIRONMENT, formatNetworkName } from '../stringOperations'

export const isTestnetEnv = ENVIRONMENT === 'testnet'

export const formatChainIdToHex = (chainId: number) =>
  `0x${chainId.toString(16)}`

export const getSupportedNetworksInApplication = () => {
  const supportedNetworks = getSupportedNetworks(ENVIRONMENT)

  if (!supportedNetworks) return []

  const supportedNetworksInApplication = supportedNetworks.filter((network) =>
    config.supportedNetworks.includes(network),
  )

  return supportedNetworksInApplication
}

export const checkIsSupportedNetworkInUrl = (pathname: string) => {
  const supportedChains = getSupportedNetworksInApplication()

  const supportedNetworks = supportedChains?.map((chainId) => ({
    name: formatNetworkName(getNetworkName(chainId)),
    chainId,
  }))

  const networkName = pathname.split('/')[1]

  const supportedNetwork = supportedNetworks?.find(
    (network) => network.name === networkName,
  )

  return supportedNetwork
}
