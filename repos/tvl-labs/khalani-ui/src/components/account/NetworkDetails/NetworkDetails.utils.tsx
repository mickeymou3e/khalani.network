import { ENetwork } from '@interfaces/core'

export const resolveNetworkName = (chainId: number | undefined): string => {
  switch (chainId) {
    case ENetwork.Ethereum: {
      return 'Ethereum Mainnet'
    }
    case ENetwork.EthereumSepolia: {
      return 'Ethereum Sepolia'
    }
    case ENetwork.BaseSepolia: {
      return 'Base Sepolia'
    }
    case ENetwork.Holesky: {
      return 'Ethereum Holesky'
    }
    case ENetwork.BscMainnet: {
      return 'Binance Smart Chain'
    }
    case ENetwork.BscTestnet: {
      return 'Binance Smart Chain Testnet'
    }
    case ENetwork.Khalani: {
      return 'Arcadia'
    }
    case ENetwork.Avalanche: {
      return 'Avalanche'
    }
    case ENetwork.AvalancheTestnet: {
      return 'Avalanche Testnet'
    }
    case ENetwork.MumbaiTestnet: {
      return 'Polygon Mumbai Testnet'
    }
    case ENetwork.ArbitrumSepolia: {
      return 'Arbitrum Goerli'
    }
    case ENetwork.OptimismSepolia: {
      return 'Optimism Goerli'
    }
    case ENetwork.GodwokenTestnet: {
      return 'Godwoken Testnet'
    }
    default: {
      return ''
    }
  }
}
