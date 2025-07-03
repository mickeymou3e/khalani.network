import { Effect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import config from '@config'
import { BigDecimal } from '@utils/math'

import { IChain } from '@store/chains/chains.types'
import { IPrice } from '@store/prices/prices.types'
import { createPrice } from './utils'
import { KHALA_SYMBOL, PRICE_DECIMALS } from '@constants/Tokens'
import { formatTokenSymbol } from '@utils/token'
import { TokenModel } from '@store/tokens/tokens.types'
import { transformDIAv2ApiResponseData } from './transform'

export function* getPrices(tokens: TokenModel[]): Generator<Effect, IPrice[]> {
  const prices: IPrice[] = []

  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i]
    const foundPrice = prices.find(
      (price) => price?.tokenSymbol === formatTokenSymbol(token.symbol),
    )

    if (token.symbol === KHALA_SYMBOL) {
      prices.push(
        createPrice(
          BigDecimal.from(BigInt(10) ** BigInt(PRICE_DECIMALS), PRICE_DECIMALS),
          token.id,
          token.symbol,
        ),
      )
    } else if (foundPrice) {
      prices.push(createPrice(foundPrice.price, token.id, token.symbol))
    } else {
      const price = yield* call(fetchPrice, token.id, token.symbol)
      prices.push(price)
    }
  }

  return prices
}

export function* getNativeTokensPrices(
  chains: IChain[],
): Generator<Effect, IPrice[]> {
  const prices: IPrice[] = []

  for (let i = 0; i < chains.length; ++i) {
    const chain = chains[i]
    const foundPrice = prices.find(
      (price) => price?.tokenSymbol === chain.nativeCurrency.name,
    )

    if (foundPrice) {
      prices.push(
        createPrice(foundPrice.price, chain.chainId, chain.nativeCurrency.name),
      )
    } else {
      const price = yield* call(
        fetchPrice,
        chain.chainId,
        chain.nativeCurrency.name,
      )
      prices.push(price)
    }
  }

  return prices
}

const fetchPrice = async (id: string, symbol: string): Promise<IPrice> => {
  try {
    const response = await fetch(
      `${config.api.dia.priceUrl}/${formatTokenSymbol(symbol)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (response.status === 200) {
      const data = await response.json()
      return transformDIAv2ApiResponseData(data, id, symbol)
    }
  } catch {
    return createPrice(null, id, symbol)
  }
  return createPrice(null, id, symbol)
}
