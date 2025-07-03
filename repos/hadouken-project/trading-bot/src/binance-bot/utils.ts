export const getBinanceTokenEquivalentSymbol = (token: string) => {
  if (token === 'WBTC|eth') {
    return 'BTC'
  }
  return token === 'USDC' ? 'BUSD' : token
}
