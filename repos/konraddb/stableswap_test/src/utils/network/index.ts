import config from '@config'
import { Network, NetworkName } from '@constants/Networks'
import { GodwokenNetwork } from '@hadouken-project/stableswap-contracts'

export const getNetworkName = (chainId: string | null): string => {
  if (chainId === null) return 'unknown'

  const name = NetworkName[chainId as Network]
  if (!name) return 'Name missing'

  return name
}

export const getNetwork = (): GodwokenNetwork => {
  return getGodwokenNetwork() ?? GodwokenNetwork.Mainnet
}

export const mapChainIdToName = (chainId: number): string => {
  const hexChainId = '0x' + chainId.toString(16)

  const networkName = getNetworkName(hexChainId)

  return networkName
}

export const getGodwokenNetwork = (): GodwokenNetwork => {
  return config.godwoken.chainId as GodwokenNetwork
}
