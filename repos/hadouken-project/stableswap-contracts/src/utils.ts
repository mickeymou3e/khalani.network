import { EthereumNetwork, GodwokenNetwork } from './types'

export const getNetwork = (
  chainId: string,
): EthereumNetwork | GodwokenNetwork | null => {
  if (chainId === null) return null

  switch (chainId) {
    case EthereumNetwork.Mainnet:
      return EthereumNetwork.Mainnet
    case EthereumNetwork.Ropsten:
      return EthereumNetwork.Ropsten
    case EthereumNetwork.Rinkeby:
      return EthereumNetwork.Rinkeby
    case EthereumNetwork.Goerli:
      return EthereumNetwork.Goerli
    case EthereumNetwork.Dev:
      return EthereumNetwork.Dev
    case GodwokenNetwork.Testnet:
      return GodwokenNetwork.Testnet
    case GodwokenNetwork.Devnet:
      return GodwokenNetwork.Devnet
  }

  return null
}


export const getNetworkName = (
  chainId: string,
): string => {
  if (chainId === null) return 'unknown'

  switch (chainId) {
    case EthereumNetwork.Mainnet:
      return 'homestead'
    case EthereumNetwork.Ropsten:
      return 'ropsten'
    case EthereumNetwork.Rinkeby:
      return 'rinkeby'
    case EthereumNetwork.Goerli:
      return 'kovan'
    case EthereumNetwork.Dev:
      return 'goerli'
    case GodwokenNetwork.Testnet:
      return 'godwoken'
    case GodwokenNetwork.Devnet:
      return 'godwokendev'
  }

  return 'unknown'
}