export enum UsdTokenSymbol {
  KAI = 'KAI',

  // These symbols only take place on the test-nets, because on the main-nets they are named just USDC/USDT/BUSD.
  USDC_SEPOLIA = 'USDC.sepolia',
  USDT_SEPOLIA = 'USDT.sepolia',
  DAI_SEPOLIA = 'DAI.sepolia',

  USDC_HOLESKY = 'USDC.holesky',
  USDT_HOLESKY = 'USDT.holesky',
  DAI_HOLESKY = 'DAI.holesky',

  USDC_ARBITRUM = 'USDC.arbitrum',
  USDT_ARBITRUM = 'USDT.arbitrum',
  DAI_ARBITRUM = 'DAI.arbitrum',

  USDC_OPTIMISM = 'USDC.optimism',
  USDT_OPTIMISM = 'USDT.optimism',
  DAI_OPTIMISM = 'DAI.optimism',

  USDC_BASE = 'USDC.base',
  USDT_BASE = 'USDT.base',
  DAI_BASE = 'DAI.base',

  USDC_FUJI = 'USDC.fuji',
  USDT_FUJI = 'USDT.fuji',

  KLN_USDC = 'klnUSDC',
  KLN_USDT = 'klnUSDT',
  KLN_BUSD = 'klnBUSD',
}

export function stringToUsdTokenSymbol(
  input: string,
): UsdTokenSymbol | undefined {
  for (const key in UsdTokenSymbol) {
    const tokenSymbol = UsdTokenSymbol[key as keyof typeof UsdTokenSymbol]
    if (tokenSymbol === input) {
      return tokenSymbol
    }
  }
  return undefined
}
