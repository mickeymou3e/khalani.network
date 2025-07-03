import { PRICE_DECIMALS } from '@constants/Tokens'
import { IPrice } from '@store/prices/prices.types'
import { BigDecimal } from '@utils/math'
import { convertDecimalToIntegerDecimal } from '@utils/text'

import { DIAv2ApiResponseData } from './types'
import { createPrice } from './utils'

export function transformDIAv2ApiResponseData(
  data: DIAv2ApiResponseData,
  id: string,
  symbol: string,
): IPrice {
  const priceValue = convertDecimalToIntegerDecimal(
    data.Price.toString(),
    PRICE_DECIMALS,
  )

  const price = new BigDecimal(priceValue, PRICE_DECIMALS)

  return createPrice(price, id, symbol)
}
