import { getChainConfig } from '@config'
import { transformDIAv2ApiResponseData } from '@dataSource/api/dia/prices/transform'
import { createPrice } from '@dataSource/api/dia/prices/utils'
import { mapTokenSymbolToPriceSymbol } from '@dataSource/blockchain/oracle/prices/mapper'
import { IToken } from '@interfaces/token'
import { IPrice } from '@store/prices/prices.types'

export async function fetchPrices(
  tokens: IToken[],
  chainId: string,
): Promise<IPrice[]> {
  const config = getChainConfig(chainId)
  const prices = await Promise.all(
    tokens.map(async (token) => {
      try {
        const response = await fetch(
          `${config.api.dia.priceUrl}/${mapTokenSymbolToPriceSymbol(
            token.symbol?.replace(/(["|()"].+)\w+/g, '').toUpperCase(),
          )}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (response.status === 200) {
          const data = await response.json()
          return transformDIAv2ApiResponseData(data, token)
        }
      } catch {
        return createPrice(null, token)
      }

      return createPrice(null, token)
    }),
  )

  return prices
}
