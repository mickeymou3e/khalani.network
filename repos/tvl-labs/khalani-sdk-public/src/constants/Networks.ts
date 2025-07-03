export enum Network {
  AvalancheTestnet = '0xa869',
  Khalani = '0x41786f6e',
  Sepolia = '0xaa36a7',
  Holesky = '0x4268',
  ArbitrumSepolia = '0x66eee',
  BaseSepolia = '0x14a34',
  // BlastSepoliaTestnet = '0xa0c71fd',
  OptimismSepolia = '0xaa37dc',
  // PolygonAmoyTestnet = '0x13882',
}

export const ALL_NETWORKS = [
  Network.Sepolia,
  Network.AvalancheTestnet,
  Network.Khalani,
  Network.Holesky,
  Network.ArbitrumSepolia,
  Network.BaseSepolia,
  // Network.BlastSepoliaTestnet,
  Network.OptimismSepolia,
  // Network.PolygonAmoyTestnet,
]

export const NetworkName = {
  '0xa869': 'Fuji',
  '0x41786f6e': 'Khalani',
  '0xaa36a7': 'Sepolia',
  '0x4268': 'Holesky',
  '0x66eee': 'Arbitrum Sepolia',
  '0x14a34': 'Base Sepolia',
  // '0xa0c71fd': 'Blast Sepolia',
  '0xaa37dc': 'Optimism Sepolia',
  // '0x13882': 'Polygon Amoy',
}

export function stringToNetwork(input: string): Network | undefined {
  for (const key in Network) {
    const hex = Network[key as keyof typeof Network]
    if (hex === input) {
      return hex as Network
    }
  }
  return undefined
}

export const getNetworkName = (chainId: Network | null): string => {
  if (chainId === null) return 'unknown'

  const name = NetworkName[chainId as Network]
  if (!name) return 'Name missing'

  return name
}
