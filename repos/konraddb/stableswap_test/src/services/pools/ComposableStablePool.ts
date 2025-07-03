import { BigNumber } from 'ethers'

import { TransactionResponse } from '@ethersproject/abstract-provider'
import { IPool, PoolType } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { SwapV2 } from '@tvl-labs/swap-v2-sdk'

import InvestService from '../invest/invest.service'
import TradeService from '../trade/trade.service'
import { SwapToken, SwapTokenType, SwapType } from '../trade/types'
import { IPoolService, IPoolServiceProvider } from './types'

export type ComposableStablePoolJoinArguments = {
  account: string
  pool: IPool
  amountsIn: BigNumber[]
  tokensIn: IToken[]
}

export class ComposableStablePoolService implements IPoolService {
  constructor(
    public readonly investService: InvestService,
    public readonly tradeService: TradeService,
  ) {}

  async queryJoin({
    pool,
    amountsIn,
    tokensIn,
  }: {
    account: string
    pool: IPool
    amountsIn: BigNumber[]
    tokensIn: IToken[]
  }): Promise<{ amountsIn: BigNumber[]; amountOut: BigNumber }> {
    const { amountsOut, assets } = await this.queryJoinSwap(
      pool,
      tokensIn,
      amountsIn,
      SwapType.SwapExactIn,
    )

    const tokenOutIndex = assets.findIndex(
      (tokenAddress) => tokenAddress === pool.address,
    )

    const amountOut = amountsOut[tokenOutIndex]

    return {
      amountsIn,
      amountOut,
    }
  }

  private async queryJoinSwap(
    pool: IPool,
    tokensIn: IToken[],
    amountsIn: BigNumber[],
    swapType: SwapType,
  ): Promise<{
    amountsOut: BigNumber[]
    assets: string[]
    swaps: SwapV2[]
  }> {
    const batchSwapPreview = await this.tradeService.previewBatchSwapTokensIn(
      tokensIn.map((tokenIn) => tokenIn.address),
      tokensIn.map(() => pool.address),
      amountsIn,
      swapType,
    )

    return {
      amountsOut: batchSwapPreview.amountsOut,
      assets: batchSwapPreview.assets,
      swaps: batchSwapPreview.swaps,
    }
  }

  async join({
    account,
    pool,
    amountsIn,
    tokensIn,
  }: ComposableStablePoolJoinArguments): Promise<TransactionResponse> {
    const {
      assets,
      swaps,
      limit,
      funds,
    } = await this.prepareBatchSwapArguments({
      account,
      pool,
      amountsIn,
      tokensIn,
    })

    const batchSwapTransaction = await this.tradeService.batchSwap(
      assets,
      swaps,
      limit,
      SwapType.SwapExactIn,
      funds,
    )

    return batchSwapTransaction
  }

  async queryExitTokenIn({
    tokenInAddress,
    amountIn,
    tokensOutAddresses,
  }: {
    account: string
    pool: IPool
    tokenInAddress: IToken['address']
    amountIn: BigNumber
    tokensOutAddresses: IToken['address'][]
  }) {
    const amountsIn = tokensOutAddresses.reduce(
      (amountsOut, tokenOut, index) => {
        if (index === tokensOutAddresses.length - 1) {
          return [
            ...amountsOut,
            amountIn.sub(amountIn.div(tokensOutAddresses.length).mul(index)),
          ]
        }
        return [...amountsOut, amountIn.div(tokensOutAddresses.length)]
      },
      [] as BigNumber[],
    )
    const tokensInAddresses = tokensOutAddresses.map(() => tokenInAddress)

    return await this.tradeService.previewBatchSwapTokensIn(
      tokensInAddresses,
      tokensOutAddresses,
      amountsIn,
      SwapType.SwapExactIn,
    )
  }

  async exitTokenIn({
    account,
    pool,
    tokenInAddress,
    amountIn,
    tokensOutAddresses,
  }: {
    account: string
    pool: IPool
    tokenInAddress: IToken['address']
    amountIn: BigNumber
    tokensOutAddresses: IToken['address'][]
  }) {
    const exitTokenInPreview = await this.queryExitTokenIn({
      account,
      pool,
      tokenInAddress,
      amountIn,
      tokensOutAddresses,
    })

    const tokenInIndex = exitTokenInPreview.assets.findIndex(
      (tokenAddress) => tokenAddress === tokenInAddress,
    )
    const swapsIn: SwapToken[] = [
      {
        token: tokenInAddress,
        amount: exitTokenInPreview.amountsIn[tokenInIndex],
        type: SwapTokenType.max,
      },
    ]

    const swapsOut = tokensOutAddresses.map((address) => {
      const tokenOutIndex = exitTokenInPreview.assets.findIndex(
        (tokenAddress) => tokenAddress === address,
      )
      const swapOut: SwapToken = {
        token: address,
        amount: exitTokenInPreview.amountsOut[tokenOutIndex],
        type: SwapTokenType.min,
      }

      return swapOut
    })

    const limit = this.tradeService.calculateLimits(
      swapsIn,
      swapsOut,
      exitTokenInPreview.assets,
    )
    const funds = this.tradeService.getFundManagement(account)

    const batchSwapTransaction = this.tradeService.batchSwap(
      exitTokenInPreview.assets,
      exitTokenInPreview.swaps,
      limit,
      SwapType.SwapExactIn,
      funds,
    )

    return batchSwapTransaction
  }

  async queryExitTokensOut({
    tokenInAddress,
    amountsOut,
    tokensOutAddresses,
  }: {
    account: string
    pool: IPool
    tokenInAddress: IToken['address']
    amountsOut: BigNumber[]
    tokensOutAddresses: IToken['address'][]
  }) {
    return await this.tradeService.previewBatchSwapTokensIn(
      tokensOutAddresses.map(() => tokenInAddress),
      tokensOutAddresses,
      amountsOut,
      SwapType.SwapExactOut,
    )
  }

  async exitTokensOut({
    account,
    pool,
    tokenInAddress,
    amountsOut,
    tokensOutAddresses,
  }: {
    account: string
    pool: IPool
    tokenInAddress: IToken['address']
    amountsOut: BigNumber[]
    tokensOutAddresses: IToken['address'][]
  }) {
    const exitTokensOutPreview = await this.queryExitTokensOut({
      account,
      pool,
      tokenInAddress,
      amountsOut,
      tokensOutAddresses,
    })

    const tokenInIndex = exitTokensOutPreview.assets.findIndex(
      (tokenAddress) => tokenAddress === tokenInAddress,
    )
    const swapsIn: SwapToken[] = [
      {
        token: tokenInAddress,
        amount: exitTokensOutPreview.amountsIn[tokenInIndex],
        type: SwapTokenType.max,
      },
    ]

    const swapsOut = tokensOutAddresses.map((address) => {
      const tokenOutIndex = exitTokensOutPreview.assets.findIndex(
        (tokenAddress) => tokenAddress === address,
      )
      const swapOut: SwapToken = {
        token: address,
        amount: exitTokensOutPreview.amountsOut[tokenOutIndex],
        type: SwapTokenType.min,
      }

      return swapOut
    })

    const limit = this.tradeService.calculateLimits(
      swapsIn,
      swapsOut,
      exitTokensOutPreview.assets,
    )
    const funds = this.tradeService.getFundManagement(account)

    const batchSwapTransaction = this.tradeService.batchSwap(
      exitTokensOutPreview.assets,
      exitTokensOutPreview.swaps,
      limit,
      SwapType.SwapExactOut,
      funds,
    )

    return batchSwapTransaction
  }

  protected async prepareBatchSwapArguments({
    account,
    pool,
    amountsIn,
    tokensIn,
  }: ComposableStablePoolJoinArguments) {
    const { assets, swaps, amountsOut } = await this.queryJoinSwap(
      pool,
      tokensIn,
      amountsIn,
      SwapType.SwapExactIn,
    )

    const swapsIn: SwapToken[] = swaps.map((swap) => ({
      token: assets[swap.assetInIndex],
      amount: BigNumber.from(swap.amount),
      type: SwapTokenType.max,
    }))

    const tokenOutIndex = assets.findIndex(
      (tokenAddress) => tokenAddress === pool.address,
    )
    const swapsOut: SwapToken[] = [
      {
        token: pool.address,
        amount: amountsOut[tokenOutIndex],
        type: SwapTokenType.min,
      },
    ]

    const limit = this.tradeService.calculateLimits(swapsIn, swapsOut, assets)
    const funds = this.tradeService.getFundManagement(account)

    return {
      assets,
      swaps,
      limit,
      funds,
    }
  }
}

export class ComposableStablePoolServiceProvider
  implements IPoolServiceProvider {
  poolService: ComposableStablePoolService

  constructor(
    public readonly investService: InvestService,
    public readonly tradeService: TradeService,
  ) {
    this.poolService = new ComposableStablePoolService(
      investService,
      tradeService,
    )
  }

  public provide(pool: IPool): ComposableStablePoolService | null {
    if (pool.poolType === PoolType.ComposableStable) {
      return this.poolService
    }

    return null
  }
}
