export const avalancheTestnet = {
  id: 43113,
  chainName: 'Avalanche Testnet',
  chainId: '0xa869',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  blockExplorerUrls: ['https://testnet.snowtrace.io'],
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  logo: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg',
  borderColor: '#CC3333',
  poolTokenSymbol: 'USDC.avax',
}

export const khalaniTestnet = {
  id: 1098411886,
  chainName: 'Khalani',
  chainId: '0x41786f6e',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://v1.betanet.gwscan.com/'],
  rpcUrls: ['https://www.axon-node.info'],
  logo: 'https://pbs.twimg.com/media/FdWhUExUUAE30t_.png',
  borderColor: '#228c22',
}

export const baseSepolia = {
  id: 84532,
  chainName: 'Base Sepolia Testnet',
  chainId: '0x14a34',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://sepolia-explorer.base.org'],
  rpcUrls: ['https://base-sepolia.drpc.org', 'https://sepolia.base.org'],
  logo: 'https://pbs.twimg.com/media/FdWhUExUUAE30t_.png',
  borderColor: '#228c22',
}

export const chains = [avalancheTestnet, khalaniTestnet, baseSepolia]
