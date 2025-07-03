import { BigNumber } from 'ethers'

import { PRICE_DECIMALS } from '@dataSource/api/dia/prices/constants'
import { createPrice } from '@dataSource/api/dia/prices/utils'
import { IToken } from '@interfaces/token'
import { IPrice } from '@store/prices/prices.types'
import { BigDecimal } from '@utils/math'

export async function fetchPrices(tokens: IToken[]): Promise<IPrice[]> {
  const prices = await Promise.all(
    tokens.map(async (token) => {
      try {
        return createPrice(
          BigDecimal.from(
            BigNumber.from(10).pow(PRICE_DECIMALS),
            PRICE_DECIMALS,
          ),
          token,
        )
      } catch {
        return createPrice(null, token)
      }
    }),
  )

  return prices
}
