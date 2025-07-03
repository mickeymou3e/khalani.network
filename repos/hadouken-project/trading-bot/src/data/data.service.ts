import { Inject, Injectable } from '@nestjs/common'
import { pools as hadoukenPools } from '@config/hadouken.json'
import { pools as binancePools } from '@config/binance.json'
import { pools as yokaiPools } from '@config/yokai.json'
import { BigNumber } from 'ethers'
import { PoolService } from '../pool/pool.service'
import { PoolYokaiData } from '../pool/pool.types'
import { PoolInformationFetcher } from './data.types'
import * as Sentry from '@sentry/node'
import { HadoukenSwapService } from '../hadouken-swap/hadouken-swap.service'
import { Sor } from '@hadouken-project/sdk'
import { BinanceOrderBookInformationFetcher } from '../binance-fetcher/binance-fetcher.service'
import { getBinanceTokenEquivalentSymbol } from '../binance-bot/utils'
import { BINANCE_BASE_URL } from '../binance-bot/binanceClient.module'
import { GodwokenTokenService } from '../token/godwokenToken.service'

type YokaiPoolType = (typeof yokaiPools)[0]

export class YokaiPoolInformationFetcher implements PoolInformationFetcher {
  public poolType = 'yokai' as const
  private poolInformation?: PoolYokaiData
  constructor(
    private readonly pool: YokaiPoolType,
    private readonly poolService: PoolService,
    overridePoolInformation?: PoolYokaiData,
  ) {
    this.poolInformation = overridePoolInformation
  }

  private getYokaiTokenSymbol(symbol: string) {
    return symbol === 'CKB' ? 'WCKB' : symbol
  }
  async getOutGivenIn(
    amount: BigNumber,
    tokenIn: string,
    tokenOut: string,
  ): Promise<BigNumber> {
    const poolData = await this.getPoolInformation()
    const tokenInData = poolData.tokenInfo.get(
      this.getYokaiTokenSymbol(tokenIn),
    )
    const tokenOutData = poolData.tokenInfo.get(
      this.getYokaiTokenSymbol(tokenOut),
    )

    const amountInWithFee = amount.mul(9975)
    const numerator = amountInWithFee.mul(tokenOutData.amount)
    const denominator = tokenInData.amount.mul(10000).add(amountInWithFee)
    return numerator.div(denominator)
  }

  async getInGivenOut(
    amount: BigNumber,
    tokenIn: string,
    tokenOut: string,
  ): Promise<BigNumber> {
    const poolData = await this.getPoolInformation()
    const tokenInData = poolData.tokenInfo.get(
      this.getYokaiTokenSymbol(tokenIn),
    )
    const tokenOutData = poolData.tokenInfo.get(
      this.getYokaiTokenSymbol(tokenOut),
    )

    const numerator = tokenInData.amount.mul(amount).mul(10000)
    const denominator = tokenOutData.amount.sub(amount).mul(9975)
    return numerator.div(denominator).add(1)
  }

  async getPoolInformation(): Promise<PoolYokaiData> {
    if (!this.poolInformation) {
      this.poolInformation = await this.poolService.getYokaiPoolData(
        this.pool.address,
      )
    }
    return this.poolInformation
  }
}

@Injectable()
export class DataService {
  constructor(
    private readonly poolService: PoolService,
    private readonly sor: Sor,
    @Inject(BINANCE_BASE_URL) public binanceBaseUrl: string,
    private readonly tokenService: GodwokenTokenService,
  ) {}
  async getPool(
    poolName: string,
  ): Promise<
    | HadoukenSwapService
    | YokaiPoolInformationFetcher
    | BinanceOrderBookInformationFetcher
  > {
    const hadoukenPool = hadoukenPools.find((pool) => pool.name === poolName)
    if (hadoukenPool) {
      const hadoukenSwapService = new HadoukenSwapService(
        this.sor,
        this.tokenService,
      )
      await hadoukenSwapService.fetchPools()
      return hadoukenSwapService
    }
    const yokaiPool = yokaiPools.find((pool) => pool.name === poolName)
    if (yokaiPool) {
      return new YokaiPoolInformationFetcher(yokaiPool, this.poolService)
    }
    const binancePool = binancePools.find((pool) => pool.name === poolName)
    if (binancePool) {
      return new BinanceOrderBookInformationFetcher(
        this.binanceBaseUrl,
        binancePool.baseToken,
        getBinanceTokenEquivalentSymbol(binancePool.quoteToken),
      )
    }
    Sentry.captureException(`Pool not found ${poolName}`)
    throw new Error(`Pool not found ${poolName}`)
  }
}
