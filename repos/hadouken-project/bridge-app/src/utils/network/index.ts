import config from '@config'
import { Network, NetworkName } from '@constants/Network'

export const isTestOrLocalEnv =
  process.env.CONFIG === 'testnet' || process.env.CONFIG === 'local'

export declare enum EthereumNetwork {
  Mainnet = '0x1',
  Ropsten = '0x3',
  Kovan = '0x2a',
  Rinkeby = '0x4',
  Goerli = '0x5',
  Dev = '0x539',
}
export enum GodwokenNetwork {
  Mainnet = '0x116ea',
  Testnet = '0x116e9',
  Devnet = '0xfa309',
}

export const getNetworkName = (chainId: string): string => {
  if (chainId === null) return null

  const name = NetworkName[chainId as Network]
  if (!name) return 'Name missing'

  return name
}

export const getEthereumNetwork = (): EthereumNetwork => {
  return config.bridge.ethereum.chainId as EthereumNetwork
}

export const getGodwokenNetwork = (): GodwokenNetwork => {
  return config.godwoken.chainId as GodwokenNetwork
}

export const getNetwork = (chainId: string): string => {
  if (chainId === null) return 'unknown'

  switch (chainId) {
    case Network.Mainnet:
      return 'Mainnet'
    case Network.Ropsten:
      return 'Ropsten'
    case Network.Rinkeby:
      return 'Rinkeby'
    case Network.Goerli:
      return 'Goerli'
    case Network.Dev:
      return 'Local'
    case Network.GodwokenMainnet:
      return 'Godwoken'
    case Network.GodwokenTestnet:
      return 'Godwoken Testnet V1'
    case Network.GodwokenTestnet:
      return 'Godwoken Testnet V0'
    case Network.GodwokenDevnet:
      return 'Godwoken Devnet V1'
  }

  return 'unknown'
}
