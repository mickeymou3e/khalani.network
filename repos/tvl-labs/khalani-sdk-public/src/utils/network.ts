import { Network } from '@constants/Networks'

export const resolveNetworkBySymbol = (symbol: string): Network | undefined => {
  switch (symbol) {
    case 'avax':
      return Network.AvalancheTestnet
    case 'sepolia':
      return Network.Sepolia
    case 'khalani':
      return Network.Khalani
    // case 'arbitrum':
    //   return Network.ArbitrumSepolia
    // case 'base':
    //   return Network.BaseSepoliaTestnet
    // case 'blast':
    //   return Network.BlastSepoliaTestnet
    // case 'optimism':
    //   return Network.OptimismSepoliaTestnet
    // case 'polygon':
    //   return Network.PolygonAmoyTestnet
    default:
      return undefined
  }
}

export const parseNetworkEnumToId = (network: Network): number =>
  parseInt(network, 16)
