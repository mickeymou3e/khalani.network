export const mapTokenSymbolToPriceSymbol = (tokenSymbol: string): string => {
  switch (tokenSymbol.toUpperCase()) {
    case 'CEWBTC':
    case 'WBTC':
    case 'HWBTC':
    case 'MULTIWBTC':
      return 'WBTC'
    case 'HCKB':
    case 'PCKB':
      return 'CKB'
    case 'CEUSDC':
    case 'HUSDC':
    case 'MULTIUSDC':
      return 'USDC'
    case 'CEUSDT':
    case 'HUSDT':
    case 'USDT.E':
    case 'MULTIUSDT':
      return 'USDT'
    case 'CEETH':
    case 'HETH':
    case 'HWETH':
    case 'WETH':
    case 'MULTIETH':
      return 'ETH'
    default:
      return tokenSymbol.toUpperCase()
  }
}
