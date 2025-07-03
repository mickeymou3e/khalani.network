import { PriceSymbol } from '@dataSource/blockchain/oracle/prices/constants'
import { WBTC } from '@dataSource/graph/pools/poolsTokens/constants'

export const mapTokenSymbolToPriceSymbol = (tokenSymbol: string): string => {
  switch (tokenSymbol) {
    case WBTC.symbol:
      return PriceSymbol[WBTC.symbol]
    default:
      return tokenSymbol
  }
}
