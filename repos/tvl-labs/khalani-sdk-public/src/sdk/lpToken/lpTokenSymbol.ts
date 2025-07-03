export enum LpTokenSymbol {
  USDC_ETH = 'USDC.sepoliaklnUSDC',
  USDC_AVAX = 'USDC.fujiklnUSDC',

  USDT_AVAX = 'USDT.fujiklnUSDT',
  USDT_ETH = 'USDT.sepoliaklnUSDT',

  USDC_USDT_KAI = 'klnUSDCklnUSDTKAI',
}

export function stringToLpTokenSymbol(
  input: string,
): LpTokenSymbol | undefined {
  for (const key in LpTokenSymbol) {
    const tokenSymbol = LpTokenSymbol[key as keyof typeof LpTokenSymbol]
    if (tokenSymbol === input) {
      return tokenSymbol
    }
  }
  return undefined
}
