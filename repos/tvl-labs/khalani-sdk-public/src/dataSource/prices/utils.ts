import { IPrice } from '@store/prices/prices.types'
import { BigDecimal } from '@utils/math'
import { formatTokenSymbol } from '@utils/token'

export function createPrice(
  price: BigDecimal | null,
  id: string,
  symbol: string,
): IPrice {
  return {
    id: id.toLowerCase(),
    tokenSymbol: formatTokenSymbol(symbol),
    price: price ?? BigDecimal.from(0),
  }
}
