import { Inject, Injectable, Logger } from '@nestjs/common'
import * as Sentry from '@sentry/node'
import fetch from 'cross-fetch'
import { tokens } from '@config/binanceFetcherTokens.json'
import { BigNumber } from 'ethers'
import { PoolInformationFetcher } from '../data/data.types'
import { applyDecimal } from '../yokai-sdk/utils'
import { BINANCE_BASE_URL } from '../binance-bot/binanceClient.module'
import { getBinanceTokenEquivalentSymbol } from '../binance-bot/utils'

type OrderBookEntries = {
  amountOut: BigNumber
  amountIn: BigNumber
  price: BigNumber
}[]

type OrderBookApiReturn = {
  bids: string[][]
  asks: string[][]
}

export class BinanceOrderBookInformationFetcher
  implements PoolInformationFetcher
{
  private readonly logger = new Logger(BinanceOrderBookInformationFetcher.name)
  private baseTokenDecimals
  private quoteTokenDecimals
  private orderBookInformation?: OrderBookApiReturn
  private orderBookCache: { [key: string]: OrderBookEntries } = {}

  public readonly poolType = 'binance' as const
  constructor(
    public binanceBaseUrl: string,
    private baseTokenSymbol: string,
    private quoteTokenSymbol: string,
    overrideOrderBookInformation?: OrderBookApiReturn,
  ) {
    this.orderBookInformation = overrideOrderBookInformation
    this.baseTokenDecimals = tokens.find(
      (token) => token.symbol === this.baseTokenSymbol,
    ).decimals

    this.quoteTokenDecimals = tokens.find(
      (token) => token.symbol === this.quoteTokenSymbol,
    ).decimals
    this.quoteTokenSymbol = getBinanceTokenEquivalentSymbol(quoteTokenSymbol)
  }

  async getInGivenOut(amount: BigNumber, tokenIn: string, _tokenOut: string) {
    return this.getAmountGivenSide(amount, tokenIn, 'exactOut')
  }

  async getOutGivenIn(amount: BigNumber, tokenIn: string, _tokenOut: string) {
    return this.getAmountGivenSide(amount, tokenIn, 'exactIn')
  }
  async getPriceGivenOut(
    amount: BigNumber,
    tokenIn: string,
    _tokenOut: string,
  ) {
    return this.getPriceGivenSide(amount, tokenIn, 'exactOut')
  }

  async getPriceGivenIn(amount: BigNumber, tokenIn: string, _tokenOut: string) {
    return this.getPriceGivenSide(amount, tokenIn, 'exactIn')
  }

  private async getPriceGivenSide(
    amount: BigNumber,
    tokenIn: string,
    swapType: 'exactIn' | 'exactOut',
  ) {
    const cacheKey = tokenIn
    if (!this.orderBookCache[cacheKey]) {
      this.orderBookCache[cacheKey] = await this.getOrderBook(
        this.baseTokenSymbol === tokenIn ? 'tokenIn' : 'tokenOut',
      )
    }

    const { price } = await this.getResultOfOrderBookEntries(
      amount,
      this.orderBookCache[cacheKey],
      swapType,
    )
    return price
  }
  private async getAmountGivenSide(
    amount: BigNumber,
    tokenIn: string,
    swapType: 'exactIn' | 'exactOut',
  ) {
    const cacheKey = tokenIn
    if (!this.orderBookCache[cacheKey]) {
      this.orderBookCache[cacheKey] = await this.getOrderBook(
        this.baseTokenSymbol === tokenIn ? 'tokenIn' : 'tokenOut',
      )
    }

    const { amount: amountGivenIn } = await this.getResultOfOrderBookEntries(
      amount,
      this.orderBookCache[cacheKey],
      swapType,
    )
    return amountGivenIn
  }

  private async getResultOfOrderBookEntries(
    targetAmount: BigNumber,
    asksOrBids: OrderBookEntries,
    swapType: 'exactIn' | 'exactOut',
  ): Promise<{ amount: BigNumber; price: BigNumber }> {
    let tokenInSum = BigNumber.from(0)
    let tokenOutSum = BigNumber.from(0)
    let value
    if (swapType === 'exactIn') {
      for (value of asksOrBids) {
        if (tokenInSum.add(value.amountIn).gte(targetAmount)) {
          const multiplicationFactorNumerator = targetAmount.sub(tokenInSum)
          const multiplicationFactorDenumerator = value.amountIn

          tokenOutSum = tokenOutSum.add(
            value.amountOut
              .mul(multiplicationFactorNumerator)
              .div(multiplicationFactorDenumerator),
          )

          tokenInSum = targetAmount

          break
        } else {
          tokenOutSum = tokenOutSum.add(value.amountOut)
          tokenInSum = tokenInSum.add(value.amountIn)
        }
      }

      if (tokenInSum.lt(targetAmount)) {
        throw new Error('amountIn is bigger than order book')
      }
      return { amount: tokenOutSum, price: value.price }
    } else {
      for (value of asksOrBids) {
        if (tokenOutSum.add(value.amountOut).gte(targetAmount)) {
          const multiplicationFactorNumerator = targetAmount.sub(tokenOutSum)
          const multiplicationFactorDenumerator = value.amountOut

          tokenInSum = tokenInSum.add(
            value.amountIn
              .mul(multiplicationFactorNumerator)
              .div(multiplicationFactorDenumerator),
          )
          tokenOutSum = targetAmount

          break
        } else {
          tokenOutSum = tokenOutSum.add(value.amountOut)
          tokenInSum = tokenInSum.add(value.amountIn)
        }
      }

      if (tokenOutSum.lt(targetAmount)) {
        throw new Error('amountOut is bigger than order book')
      }
      return { amount: tokenInSum, price: value.price }
    }
  }

  private async getOrderBook(
    baseTokenType: 'tokenIn' | 'tokenOut',
  ): Promise<OrderBookEntries> {
    const orderBook = await this.requestOrderBook()

    const bigNumberAsks = orderBook.asks.map((order) =>
      this.parseRawOrderEntry(order),
    )

    const bigNumberBids = orderBook.bids.map((order) =>
      this.parseRawOrderEntry(order),
    )

    const bigNumberOrderBook = {
      asks: bigNumberAsks,
      bids: bigNumberBids,
    }

    const decimalDiff = this.quoteTokenDecimals - this.baseTokenDecimals - 8

    if (baseTokenType === 'tokenIn') {
      return bigNumberOrderBook.bids.reverse().map((order) => ({
        amountIn: order[1],
        price: order[0],
        amountOut: applyDecimal(decimalDiff, order[0].mul(order[1])),
      }))
    } else {
      return bigNumberOrderBook.asks.map((order) => ({
        amountOut: order[1],
        amountIn: applyDecimal(decimalDiff, order[0].mul(order[1])),
        price: order[0],
      }))
    }
  }

  private parseRawOrderEntry(order: string[]) {
    const baseTokenPower = this.baseTokenDecimals - 8

    const price = BigNumber.from(order[0].replace('.', ''))
    const baseToken = applyDecimal(
      baseTokenPower,
      BigNumber.from(order[1].replace('.', '')),
    )

    return [price, baseToken]
  }

  private async fetchOrderBook(): Promise<OrderBookApiReturn> {
    const orderBookLimit = '10'
    const pairSymbol = `${getBinanceTokenEquivalentSymbol(
      this.baseTokenSymbol,
    )}${this.quoteTokenSymbol}`.toUpperCase()
    const endpointUrl = `${this.binanceBaseUrl}/api/v3/depth?symbol=${pairSymbol}&limit=${orderBookLimit}`

    try {
      const response = await fetch(endpointUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status !== 200) {
        const text = await response.text()
        throw new Error(`Binance error ${response.status}: ${text}`)
      }

      return await response.json()
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }
  }

  public async requestOrderBook() {
    if (!this.orderBookInformation) {
      this.orderBookInformation = await this.fetchOrderBook()
      this.logger.log(
        'OrderBook (raw) fetch result',
        JSON.stringify(this.orderBookInformation),
      )
    }

    return this.orderBookInformation
  }
}

@Injectable()
export class BinanceFetcherService {
  constructor(@Inject(BINANCE_BASE_URL) public binanceBaseUrl: string) {}

  createFetcher(
    baseTokenSymbol: string,
    quoteTokenSymbol: string,
    overrideOrderBookInformation?: OrderBookApiReturn,
  ) {
    return new BinanceOrderBookInformationFetcher(
      this.binanceBaseUrl,
      baseTokenSymbol,
      quoteTokenSymbol,
      overrideOrderBookInformation,
    )
  }
}
