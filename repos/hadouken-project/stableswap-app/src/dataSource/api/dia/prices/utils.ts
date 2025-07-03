import { IToken } from '@interfaces/token'
import { IPrice } from '@store/prices/prices.types'
import { BigDecimal } from '@utils/math'

export function createPrice(price: BigDecimal | null, token: IToken): IPrice {
  return {
    id: token.id,
    price: price ?? BigDecimal.from(0),
  }
}
