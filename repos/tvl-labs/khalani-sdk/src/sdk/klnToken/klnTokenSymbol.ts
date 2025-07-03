export enum KlnTokenSymbol {
  KLN_USDC = 'klnUSDC',
  KLN_USDT = 'klnUSDT',
  KLN_BUSD = 'klnBUSD',
}

export function stringToKlnTokenSymbol(input: string): KlnTokenSymbol | undefined {
  for (const key in KlnTokenSymbol) {
    const tokenSymbol = KlnTokenSymbol[key as keyof typeof KlnTokenSymbol]
    if (tokenSymbol === input) {
      return tokenSymbol
    }
  }
  return undefined
}
