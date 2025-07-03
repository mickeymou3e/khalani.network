export const assetNameMapping = (asset: string): string => {
  switch (asset) {
    case 'USDC|eth':
    case 'USDC':
      return 'Force Bridge USDC from Ethereum'
    case 'pCKB':
    case 'CKB':
      return 'pCKB'
    case 'USDT|eth':
    case 'USDT':
      return 'Force Bridge USDT from Ethereum'
    case 'ETH':
      return 'Force Bridge ETH from Ethereum'
    case 'BNB|bsc':
    case 'BNB':
      return 'Force Bridge BNB from BSC'
    case 'WBTC|eth':
    case 'WBTC':
      return 'Force Bridge WBTC from Ethereum'
    case 'BUSD|eth':
    case 'BUSD':
      return 'Force Bridge BUSD from Ethereum'
    case 'BUSD|bsc':
      return 'Force Bridge BUSD from BSC'
    case 'USDT|bsc':
      return 'Force Bridge USDT from BSC'
    case 'USDC|bsc':
      return 'Force Bridge USDC from BSC'
    case 'ceUSDC':
      return 'Celer USDC'
    case 'ceUSDT':
      return 'Celer USDT'
    case 'hUSDC':
      return 'Wrapped hUSDC'
    case 'hUSDT':
      return 'Wrapped hUSDT'
    case 'hETH':
      return 'Wrapped hETH'
    case 'hCKB':
      return 'Wrapped hCKB'
    case 'hWBTC':
      return 'Wrapped hWBTC'
  }

  return asset
}
