import { IToken } from '@interfaces/token'
import { IPrice } from '@store/prices/prices.types'
import { BigDecimal } from '@utils/math'
import { decimalStringToBigNumber } from '@utils/string'

import { PRICE_DECIMALS } from './constants'
import { DIAv2ApiResponseData } from './types'
import { createPrice } from './utils'

export function transformDIAv2ApiResponseData(
  data: DIAv2ApiResponseData,
  token: IToken,
): IPrice {
  const priceValue = decimalStringToBigNumber(
    data.Price.toString(),
    PRICE_DECIMALS,
  )

  const price = new BigDecimal(priceValue, PRICE_DECIMALS)

  return createPrice(price, token)
}
