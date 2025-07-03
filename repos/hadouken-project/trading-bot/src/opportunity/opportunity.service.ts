import { InjectGraphQLClient } from '@golevelup/nestjs-graphql-request'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { BigNumber, ethers } from 'ethers'
import { GraphQLClient } from 'graphql-request'
import { PoolInformationFetcher } from '../data/data.types'
import { DataService } from '../data/data.service'
import { flashLoanDecimals as flDecimals } from '@config/arbitragePairs.json'
import { HadoukenSwapService } from '../hadouken-swap/hadouken-swap.service'
import { SwapTypes } from '@hadouken-project/sdk'
import { SwapInfo } from '../execution/execution.service'
import { DiscordNotifierService } from '../discord-notifier/discord-notifier.service'
import { BinanceFetcherService } from '../binance-fetcher/binance-fetcher.service'
import { JSON_RPC_PROVIDER } from '../helpers'

export type ArbitrageParams = {
  quoteAmount: BigNumber
  baseAmount: BigNumber
  profit: BigNumber
  swapInfo: SwapInfo
  subgraphBlocksBehind: number
  binancePrice?: BigNumber
}

function isHadoukenPoolFetcher(
  poolFetcher: PoolInformationFetcher,
): poolFetcher is HadoukenSwapService {
  return poolFetcher.poolType === 'hadouken'
}

const emptySwap = { swaps: [], tokenAddresses: [] }

@Injectable()
export class OpportunityService {
  private readonly logger = new Logger(OpportunityService.name)
  static BLOCK_LATENCY_TO_NOTIFY = 2

  constructor(
    private readonly dataService: DataService,
    @InjectGraphQLClient()
    private readonly graphQL: GraphQLClient,
    @Inject(JSON_RPC_PROVIDER)
    private readonly provider: ethers.providers.JsonRpcProvider,
    private readonly discordNotifierService: DiscordNotifierService,
    private readonly binanceFetcherService: BinanceFetcherService,
  ) {}

  private async checkSubgraph(
    subgraphBlocksBehind: number,
    poolNameForBuy: string,
    poolNameForSell: string,
  ): Promise<number> {
    const chainBlockNumber = await this.provider.getBlockNumber()
    const graphRes = await this.graphQL.rawRequest('{_meta {block{number}}}')
    const graphQLBlockNumber = Number(graphRes.data['_meta'].block.number)
    const blockDiff = chainBlockNumber - graphQLBlockNumber

    const wasInAlarm = subgraphBlocksBehind >= 2
    const isInAlarm = blockDiff >= 2

    if (blockDiff > 0) {
      this.logger.log(
        `Subgraph is out of sync with chain - Subgraph: ${graphQLBlockNumber} blockchain: ${chainBlockNumber}`,
      )
    }
    if (!wasInAlarm && isInAlarm) {
      await this.discordNotifierService.sendNotification(
        `⚠ Subgraph is ${blockDiff} blocks behind chain - pool for buy ${poolNameForBuy}  pool for sell ${poolNameForSell} ⚠`,
      )
    }
    if (wasInAlarm && !isInAlarm) {
      await this.discordNotifierService.sendNotification(
        `✅ Subgraph is in sync with chain after ${subgraphBlocksBehind} blocks - pool for buy ${poolNameForBuy}  pool for sell ${poolNameForSell} ✅`,
      )
    }

    return blockDiff
  }

  async findOpportunityForTrade({
    poolNameForBuy,
    poolNameForSell,
    baseToken,
    quoteToken,
    quoteTokenThreshold,
    minProfit,
    flashLoanCost,
    subgraphBlocksBehind,
  }: {
    poolNameForBuy: string
    poolNameForSell: string
    baseToken: string
    quoteToken: string
    quoteTokenThreshold: BigNumber
    minProfit: BigNumber
    flashLoanCost: BigNumber
    subgraphBlocksBehind: number
  }): Promise<ArbitrageParams> {
    const [poolForBuy, poolForSell] = await Promise.all([
      this.dataService.getPool(poolNameForBuy),
      this.dataService.getPool(poolNameForSell),
    ])
    const currentBlockLatency = await this.checkSubgraph(
      subgraphBlocksBehind,
      poolNameForBuy,
      poolNameForSell,
    )
    if (currentBlockLatency > 0) {
      return {
        quoteAmount: BigNumber.from(0),
        baseAmount: BigNumber.from(0),
        profit: BigNumber.from(0),
        swapInfo: emptySwap,
        subgraphBlocksBehind: currentBlockLatency,
      }
    }

    const { quoteAmount, baseAmount, profit, swapInfo, binancePrice } =
      await this.findQuoteAmountToArbitrage({
        poolForBuy,
        poolForSell,
        baseToken,
        quoteToken,
        quoteTokenThreshold,
        minProfit,
        flashLoanCost,
      })
    return {
      quoteAmount,
      baseAmount,
      profit,
      swapInfo,
      subgraphBlocksBehind: 0,
      binancePrice,
    }
  }

  public async findQuoteAmountToArbitrage({
    poolForBuy,
    poolForSell,
    baseToken,
    quoteToken,
    quoteTokenThreshold,
    minProfit,
    flashLoanCost,
  }: {
    poolForBuy: PoolInformationFetcher
    poolForSell: PoolInformationFetcher
    baseToken: string
    quoteToken: string
    quoteTokenThreshold: BigNumber
    minProfit: BigNumber
    flashLoanCost: BigNumber
  }): Promise<Omit<ArbitrageParams, 'subgraphBlocksBehind'>> {
    this.logger.log(
      `Looking for quoteToken amount, pool for buy: ${
        poolForBuy.poolType
      }, pool for sell: ${
        poolForSell.poolType
      }, baseToken: ${baseToken}, quoteToken: ${quoteToken}, quoteTokenThreshold: ${quoteTokenThreshold.toString()}, minProfit: ${minProfit.toString()}`,
    )

    let amount = quoteTokenThreshold.div(2)

    const maxAmount = quoteTokenThreshold.mul(BigNumber.from(2).pow(20))

    let profitScoped = BigNumber.from(0)
    do {
      amount = amount.mul(2)
      const { profit } = await this.getProfit(
        poolForBuy,
        poolForSell,
        amount,
        baseToken,
        quoteToken,
        flashLoanCost,
      )
      profitScoped = profit
    } while (profitScoped.gt(0) && amount.lte(maxAmount))
    if (amount.eq(quoteTokenThreshold)) {
      this.logger.log(
        `Quote amount below threshold for quote token:${quoteToken} and base token: ${baseToken}`,
      )
      return {
        quoteAmount: BigNumber.from(0),
        baseAmount: BigNumber.from(0),
        profit: BigNumber.from(0),
        swapInfo: emptySwap,
      }
    }

    const range = [quoteTokenThreshold, amount]

    const { quoteAmount, baseAmount, profit } = await this.goldenSectionSearch(
      poolForBuy,
      poolForSell,
      range,
      baseToken,
      quoteToken,
      quoteTokenThreshold,
      flashLoanCost,
    )

    if (profit.gte(minProfit)) {
      const hadoukenFetcher = isHadoukenPoolFetcher(poolForBuy)
        ? poolForBuy
        : isHadoukenPoolFetcher(poolForSell)
        ? poolForSell
        : null

      const { swaps, tokenAddresses } =
        poolForBuy.poolType === 'hadouken'
          ? await hadoukenFetcher.getBestSwap(
              quoteToken,
              baseToken,
              SwapTypes.SwapExactIn,
              quoteAmount,
            )
          : await hadoukenFetcher.getBestSwap(
              baseToken,
              quoteToken,
              SwapTypes.SwapExactIn,
              baseAmount,
            )

      let binancePrice: BigNumber

      if (
        poolForBuy.poolType === 'binance' ||
        poolForSell.poolType === 'binance'
      ) {
        const binanceFetcher = this.binanceFetcherService.createFetcher(
          baseToken,
          quoteToken,
        )

        binancePrice =
          poolForBuy.poolType === 'binance'
            ? await binanceFetcher.getPriceGivenOut(
                BigNumber.from(baseAmount),
                quoteToken,
                baseToken,
              )
            : await binanceFetcher.getPriceGivenIn(
                BigNumber.from(baseAmount),
                baseToken,
                quoteToken,
              )
      }
      this.logger.log(
        `Arbitrage parameters: quote amount:${quoteAmount} ${quoteToken} base amount: ${baseAmount} ${baseToken} expected profit: ${profit}`,
      )
      return {
        quoteAmount,
        baseAmount,
        profit,
        swapInfo: { tokenAddresses, swaps },
        binancePrice,
      }
    } else {
      this.logger.log(
        `Profit below minimum value for quote token:${quoteToken} and base token: ${baseToken}`,
      )
      return {
        quoteAmount: BigNumber.from(0),
        baseAmount,
        profit,
        swapInfo: emptySwap,
      }
    }
  }

  public async getProfit(
    poolForBuy: PoolInformationFetcher,
    poolForSell: PoolInformationFetcher,
    quoteTokenAmount: BigNumber,
    baseToken: string,
    quoteToken: string,
    flashLoanCost: BigNumber,
  ) {
    const baseAmount = await poolForBuy.getOutGivenIn(
      quoteTokenAmount,
      quoteToken,
      baseToken,
    )
    const amountIn = await poolForSell.getOutGivenIn(
      baseAmount,
      baseToken,
      quoteToken,
    )

    const flashLoanDecimals = BigNumber.from(10).pow(flDecimals)
    const premium = quoteTokenAmount.mul(flashLoanCost).div(flashLoanDecimals)
    const profit = amountIn.sub(quoteTokenAmount).sub(premium)
    this.logger.debug(
      `getProfit(amount=${quoteTokenAmount.toString()})=${profit.toString()}`,
    )
    return { profit, baseAmount }
  }

  public async goldenSectionSearch(
    poolForBuy: PoolInformationFetcher,
    poolForSell: PoolInformationFetcher,
    range: BigNumber[],
    baseToken: string,
    quoteToken: string,
    precision: BigNumber,
    flashLoanCost: BigNumber,
  ) {
    this.logger.log(
      `Starting golden section in range: [${range[0].toString()}, ${range[1].toString()}]`,
    )
    const goldenRatio = BigNumber.from('6180')
    const grDecimals = BigNumber.from(10).pow(4)
    const proportion = goldenRatio.mul(range[1].sub(range[0])).div(grDecimals)
    const rangeCandidates = [range[1].sub(proportion), range[0].add(proportion)]
    do {
      const { profit: profitLeft } = await this.getProfit(
        poolForBuy,
        poolForSell,
        rangeCandidates[0],
        baseToken,
        quoteToken,
        flashLoanCost,
      )
      const { profit: profitRight } = await this.getProfit(
        poolForBuy,
        poolForSell,
        rangeCandidates[1],
        baseToken,
        quoteToken,
        flashLoanCost,
      )

      if (profitLeft.gt(profitRight)) {
        range[1] = rangeCandidates[1]
      } else {
        range[0] = rangeCandidates[0]
      }
      const newProportion = goldenRatio
        .mul(range[1].sub(range[0]))
        .div(grDecimals)
      rangeCandidates[0] = range[1].sub(newProportion)
      rangeCandidates[1] = range[0].add(newProportion)
    } while (range[1].sub(range[0]).abs().gt(precision))

    const quoteAmount = range[0].add(range[1]).div(2)
    const { profit, baseAmount } = await this.getProfit(
      poolForBuy,
      poolForSell,
      quoteAmount,
      baseToken,
      quoteToken,
      flashLoanCost,
    )

    return {
      profit,
      quoteAmount,
      baseAmount,
    }
  }
}
