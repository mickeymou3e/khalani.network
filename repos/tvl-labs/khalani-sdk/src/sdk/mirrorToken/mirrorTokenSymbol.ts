export enum MirrorTokenSymbol {
  USDC_SEPOLIA = 'USDC.sepolia',
  USDT_SEPOLIA = 'USDT.sepolia',
  BUSD_SEPOLIA = 'BUSD.sepolia',

  USDC_FUJI = 'USDC.fuji',
  USDT_FUJI = 'USDT.fuji',

  USDC_ARBITRUM = 'USDC.arbitrum',
  USDT_ARBITRUM = 'USDT.arbitrum',
  DAI_ARBITRUM = 'DAI.arbitrum',

  USDC_OPTIMISM = 'USDC.optimism',
  USDT_OPTIMISM = 'USDT.optimism',
  DAI_OPTIMISM = 'DAI.optimism',

  USDC_BASE = 'USDC.base',
  USDT_BASE = 'USDT.base',
  DAI_BASE = 'DAI.base',
}

export function stringToMirrorTokenSymbol(
  input: string,
): MirrorTokenSymbol | undefined {
  for (const key in MirrorTokenSymbol) {
    const tokenSymbol = MirrorTokenSymbol[key as keyof typeof MirrorTokenSymbol]
    if (tokenSymbol === input) {
      return tokenSymbol
    }
  }
  return undefined
}
