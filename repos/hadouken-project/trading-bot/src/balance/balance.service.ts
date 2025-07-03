import { Injectable, Logger } from '@nestjs/common'
import { BigNumber } from 'ethers'
import { BalanceFetcherService } from '../balance-fetcher/balance-fetcher.service'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getBinanceTokenEquivalentSymbol } from '../binance-bot/utils'
import { DataService } from '../data/data.service'
import { pools as binancePools } from '@config/binance.json'

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name)

  constructor(
    private balanceFetcherService: BalanceFetcherService,
    private dataService: DataService,
  ) {}

  async getBalancesBinanceHadouken(event: {
    poolNameForBuy: string
    poolNameForSell: string

    quoteTokenSymbol: string
    baseTokenSymbol: string
  }) {
    const poolForBuy = await this.dataService.getPool(event.poolNameForBuy)

    let quoteTokenBalance: BigNumber
    let baseTokenBalance: BigNumber
    let minQuoteAmount: BigNumber
    let minBaseAmount: BigNumber
    let minTradeSizeInQuoteToken: BigNumber
    if (poolForBuy.poolType === 'binance') {
      const pool = binancePools.find(
        (pool) => pool.name === event.poolNameForBuy,
      )
      minQuoteAmount = BigNumber.from(pool.minQuoteAmount)
      minBaseAmount = BigNumber.from(pool.minBaseAmount)
      minTradeSizeInQuoteToken = BigNumber.from(pool.minTradeSizeInQuoteToken)

      quoteTokenBalance =
        await this.balanceFetcherService.getBinanceTokenBalance(
          event.quoteTokenSymbol,
        )
      this.logger.log(
        `Quote token balance on binance: ${quoteTokenBalance.toString()}`,
      )

      baseTokenBalance =
        await this.balanceFetcherService.getGodwokenTokenBalance(
          event.baseTokenSymbol,
        )

      this.logger.log(
        `Base token balance on GW: ${baseTokenBalance.toString()}`,
      )
    } else {
      const pool = binancePools.find(
        (pool) => pool.name === event.poolNameForSell,
      )
      minQuoteAmount = BigNumber.from(pool.minQuoteAmount)
      minBaseAmount = BigNumber.from(pool.minBaseAmount)
      minTradeSizeInQuoteToken = BigNumber.from(pool.minTradeSizeInQuoteToken)

      quoteTokenBalance =
        await this.balanceFetcherService.getGodwokenTokenBalance(
          event.quoteTokenSymbol,
        )
      this.logger.log(
        `Quote token balance on GW: ${quoteTokenBalance.toString()}`,
      )

      baseTokenBalance =
        await this.balanceFetcherService.getBinanceTokenBalance(
          event.baseTokenSymbol,
        )

      this.logger.log(
        `Base token balance on Binance: ${baseTokenBalance.toString()}`,
      )
    }
    return {
      quoteTokenBalance,
      baseTokenBalance,
      minQuoteAmount,
      minBaseAmount,
      minTradeSizeInQuoteToken,
    }
  }
  async trimBalancesBinanceHadouken({
    quoteTokenBalance,
    baseTokenBalance,
    minQuoteAmount,
    minBaseAmount,
    minTradeSizeInQuoteToken,
    quoteAmount,
    baseAmount,
  }) {
    const quoteRatio = this.getRatio(
      quoteTokenBalance.mul(98).div(100),
      quoteAmount,
    )

    const baseRatio = this.getRatio(
      baseTokenBalance.mul(98).div(100),
      baseAmount,
    )

    let minRatio = quoteRatio.lt(baseRatio) ? quoteRatio : baseRatio

    if (
      minRatio.gt(
        BigNumber.from(BigNumber.from(10).mul(BigNumber.from(10).pow(18))),
      )
    ) {
      minRatio = BigNumber.from(
        BigNumber.from(10).mul(BigNumber.from(10).pow(18)),
      )
    }

    const quoteAmountTrade = this.getAmountByRatio(quoteAmount, minRatio)
    const baseAmountTrade = this.getAmountByRatio(baseAmount, minRatio)
    const isBelowMinimumOrder =
      quoteAmountTrade.lt(minQuoteAmount) || baseAmountTrade.lt(minBaseAmount)

    if (quoteAmountTrade.lt(minTradeSizeInQuoteToken)) {
      return {
        quoteAmount: BigNumber.from(0),
        baseAmount: BigNumber.from(0),
      }
    }

    return {
      quoteAmount: isBelowMinimumOrder ? BigNumber.from(0) : quoteAmountTrade,
      baseAmount: isBelowMinimumOrder ? BigNumber.from(0) : baseAmountTrade,
    }
  }
  private getRatio(balance: BigNumber, amount: BigNumber): BigNumber {
    return balance
      .mul(BigNumber.from(10).mul(BigNumber.from(10).pow(18)))
      .div(amount)
  }
  private getAmountByRatio(amount: BigNumber, minRatio: BigNumber): BigNumber {
    return amount
      .mul(minRatio)
      .div(BigNumber.from(10).mul(BigNumber.from(10).pow(18)))
  }
}
