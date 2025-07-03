export enum KlnTokenName {
  KLN_USDC = 'klnUSDC',
  KLN_USDT = 'klnUSDT',
  KLN_BUSD = 'klnBUSD',
}

export function stringToKlnTokenName(input: string): KlnTokenName | undefined {
  for (const key in KlnTokenName) {
    const klnTokenName = KlnTokenName[key as keyof typeof KlnTokenName]
    if (klnTokenName === input) {
      return klnTokenName
    }
  }
  return undefined
}
