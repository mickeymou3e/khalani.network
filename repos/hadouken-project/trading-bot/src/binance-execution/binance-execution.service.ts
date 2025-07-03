import { Injectable, Logger } from '@nestjs/common'
import { MainClient, NewSpotOrderParams, OrderResponseFull } from 'binance'
import { BigNumber } from 'ethers'
import * as Sentry from '@sentry/node'
import { getBinanceTokenEquivalentSymbol } from '../binance-bot/utils'
import { pools as binancePools } from '@config/binance.json'
import { applyDecimal } from '../yokai-sdk/utils'
import { GodwokenTokenService } from '../token/godwokenToken.service'

export const formatAmount = (decimals: number, amount: BigNumber): string => {
  return (
    Number(applyDecimal(-decimals + 8, amount).toString()) / 100_000_000
  ).toString()
}

@Injectable()
export class BinanceExecutionService {
  private readonly logger = new Logger(BinanceExecutionService.name)

  constructor(
    private readonly binanceClient: MainClient,
    private readonly tokenService: GodwokenTokenService,
  ) {}

  public async executeTrade(event: {
    poolNameForBuy: string
    poolNameForSell: string
    quoteAmount: string
    baseAmount: string
    baseTokenSymbol: string
    quoteTokenSymbol: string
    binancePrice: string
  }) {
    if (
      BigNumber.from(event.quoteAmount).isZero() ||
      BigNumber.from(event.baseAmount).isZero()
    ) {
      return {
        quoteAmount: BigNumber.from(0),
        baseAmount: BigNumber.from(0),
        binanceFee: 0,
      }
    }

    const pair = `${getBinanceTokenEquivalentSymbol(
      event.baseTokenSymbol,
    )}${getBinanceTokenEquivalentSymbol(event.quoteTokenSymbol)}`

    const baseTokenDecimals = this.tokenService.findTokenBySymbol(
      event.baseTokenSymbol,
    ).decimals
    const quoteTokenDecimals = this.tokenService.findTokenBySymbol(
      event.quoteTokenSymbol,
    ).decimals

    const isBuyBinance = event.poolNameForBuy.includes('binance')
    const binancePool = binancePools.find((pool) =>
      [event.poolNameForBuy, event.poolNameForSell].includes(pool.name),
    )

    const formattedQuantity =
      applyDecimal(
        binancePool.amountPrecision - baseTokenDecimals,
        BigNumber.from(event.baseAmount),
      ).toNumber() /
      10 ** binancePool.amountPrecision

    try {
      const params = {
        symbol: pair.toUpperCase(),
        side: isBuyBinance ? 'BUY' : 'SELL',
        type: 'LIMIT',
        quantity: formattedQuantity,
        price: Number(formatAmount(8, BigNumber.from(event.binancePrice))),
        timeInForce: 'IOC',
        newOrderRespType: 'FULL',
      } satisfies NewSpotOrderParams
      this.logger.log(
        `Execution trade with params: \n${JSON.stringify(params, null, 2)}}`,
      )
      const result = (await this.binanceClient.submitNewOrder(
        params,
      )) as OrderResponseFull

      const binanceFee = result.fills.reduce(
        (acc, curr) => acc + Number(curr.commission),
        0,
      )

      const baseResult = Number(result.executedQty)

      this.logger.log(`Execution result:\n ${JSON.stringify(result, null, 2)}}`)
      const quoteResult = Number(result.cummulativeQuoteQty)

      const baseResultWithDecimals = this.convertNumberToBignumberWithDecimal(
        baseResult,
        baseTokenDecimals,
      )
      const quoteResultWithDecimals = this.convertNumberToBignumberWithDecimal(
        quoteResult,
        quoteTokenDecimals,
      )

      return {
        quoteAmount: quoteResultWithDecimals,
        baseAmount: baseResultWithDecimals,
        binanceFee: binanceFee,
      }
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }
  }

  convertNumberToBignumberWithDecimal(value: number, decimal: number) {
    return applyDecimal(
      decimal - 4,
      BigNumber.from(Math.floor(value * 10 ** 4)),
    )
  }
}
