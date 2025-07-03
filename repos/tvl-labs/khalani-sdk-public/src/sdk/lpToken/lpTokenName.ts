export enum LpTokenName {
  USDC_ETH = 'USDC.sepolia/klnUSDC',
  USDC_AVAX = 'USDC.fuji/klnUSDC',

  USDT_AVAX = 'USDT.fuji/klnUSDT',
  USDT_ETH = 'USDT.sepolia/klnUSDT',

  USDC_USDT_KAI = 'klnUSDC/klnUSDT/KAI',
}

export function stringToLpTokenName(input: string): LpTokenName | undefined {
  for (const key in LpTokenName) {
    const tokenSymbol = LpTokenName[key as keyof typeof LpTokenName]
    if (tokenSymbol === input) {
      return tokenSymbol
    }
  }
  return undefined
}
