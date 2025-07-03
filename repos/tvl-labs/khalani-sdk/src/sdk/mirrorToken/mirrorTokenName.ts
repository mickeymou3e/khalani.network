export enum MirrorTokenName {
  USDC_SEPOLIA = 'USDC | sepolia',
  USDT_SEPOLIA = 'USDT | sepolia',
  BUSD_SEPOLIA = 'BUSD | sepolia',

  USDC_FUJI = 'USDC | fuji',
  USDT_FUJI = 'USDT | fuji',
}

export function stringToMirrorTokenName(
  input: string,
): MirrorTokenName | undefined {
  for (const key in MirrorTokenName) {
    const tokenSymbol = MirrorTokenName[key as keyof typeof MirrorTokenName]
    if (tokenSymbol === input) {
      return tokenSymbol
    }
  }
  return undefined
}
