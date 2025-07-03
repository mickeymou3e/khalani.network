import { FrontConfig } from 'src/config.types'

import { Network, NetworkName } from '@constants/Networks'
import { Environment, deployments, external } from '@hadouken-project/config'
import {
  deployments as ZksyncDeployment,
  external as ZksyncExternal,
} from '@hadouken-project/config-zksync'

import ConfigMainnet from '../../../config/front/config.mainnet.json'
import ConfigTestnet from '../../../config/front/config.testnet.json'

export const getEnv = (env: string | undefined): Environment => {
  switch (env) {
    case 'mainnet':
      return Environment.Mainnet
    case 'testnet':
      return Environment.Testnet
    default:
      console.log(
        `Unknown environment ${env} - Using Default testnet environment`,
      )
      return Environment.Testnet
  }
}

export const env = getEnv(process.env.CONFIG)

export const config = ((): FrontConfig => {
  if (env === Environment.Mainnet) {
    return ConfigMainnet
  } else if (env === Environment.Testnet) {
    return ConfigTestnet
  }

  return ConfigMainnet
})()

export const getDeploymentConfig = (
  chainId: string,
): Record<string, string> => {
  if (chainId === Network.ZksyncMainnet || chainId === Network.ZksyncTestnet) {
    return ZksyncDeployment(env as Environment)
  }
  return deployments(chainId)
}

export const getExternal = (
  chainId: string,
): {
  DIAOracleV2: string
} => {
  if (chainId === Network.ZksyncMainnet || chainId === Network.ZksyncTestnet) {
    return ZksyncExternal(env as Environment)
  }
  return external(chainId)
}

export const getNetworkName = (chainId: string | null): string => {
  if (chainId === null) return 'unknown'

  const name = NetworkName[chainId as Network]
  if (!name) return 'unknown'

  return name
}

export const formatNetworkName = (name: string): string =>
  name.split(' ').join('-').toLowerCase()

export const createRouteForChains = (
  path: string,
  isDefaultRoute?: boolean,
): string[] => {
  return config.supportedNetworks.map((network) => {
    if (isDefaultRoute) {
      return `/${formatNetworkName(getNetworkName(network))}`
    }
    return `/${formatNetworkName(getNetworkName(network))}${path}`
  })
}

export const formatChainIdToHex = (chainId: number): string =>
  '0x' + chainId.toString(16)

export const checkIsSupportedNetworkInUrl = (
  pathname: string,
):
  | {
      name: string
      chainId: string
    }
  | undefined => {
  const supportedChains = config.supportedNetworks

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
