import { BigNumber, ethers } from 'ethers'

import { MaxUint256 } from '@constants/Networks'
import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'
import { address } from '@dataSource/graph/utils/formatters'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { IPool, PoolType } from '@interfaces/pool'
import { ONE_PERCENT } from '@utils/math'

import BatchRelayerService from '../batchRelayer/batchRelayer.service'
import InvestService from '../invest/invest.service'
import TradeService from '../trade/trade.service'
import { SwapToken, SwapTokenType, SwapType } from '../trade/types'
import {
  ChainReferenceTokenAmount,
  ExitTokenInParams,
  ExitTokensOutParams,
  IPoolService,
  IPoolServiceProvider,
  JoinParams,
  LendingToken,
  QueryExitTokenInParams,
  QueryExitTokenInResult,
  QueryExitTokensOutParams,
  QueryExitTokensOutResult,
  QueryJoinParams,
  QueryJoinResult,
  QueryJoinSwapParams,
  UserBalanceOpKind,
} from './types'

export class ComposableStablePoolService implements IPoolService {
  constructor(
    public readonly investService: InvestService,
    public readonly tradeService: TradeService,
    public readonly batchRelayerService: BatchRelayerService,
  ) {}

  async queryJoin({
    pool,
    amountsIn,
    tokensIn,
    chainId,
  }: QueryJoinParams): Promise<QueryJoinResult> {
    const data = await this.queryJoinSwap(
      pool,
      tokensIn,
      amountsIn,
      SwapType.SwapExactIn,
      chainId,
    )

    const { amountsOut, assets } = data

    const tokenOutIndex = assets.findIndex(
      (tokenAddress) => tokenAddress === pool.address,
    )

    const amountOut = amountsOut[tokenOutIndex]

    return {
      amountsIn,
      amountOut,
      error: data?.error,
      isWEth: false,
      ethAmount: BigNumber.from(0),
    }
  }

  private async queryJoinSwap(
    pool: IPool,
    tokensIn: string[],
    amountsIn: BigNumber[],
    swapType: SwapType,
    chainId: string,
  ): Promise<QueryJoinSwapParams> {
    const batchSwapPreview = await this.tradeService.previewBatchSwapTokensIn(
      tokensIn.map((address) => address),
      tokensIn.map(() => pool.address),
      amountsIn,
      swapType,
      chainId,
    )

    return {
      amountsOut: batchSwapPreview.amountsOut,
      assets: batchSwapPreview.assets,
      swaps: batchSwapPreview.swaps,
      error: batchSwapPreview.error,
    }
  }

  private async getAmountsInWithLendWrappedTokens({
    lendingTokens,
    tokensIn,
    account,
    amountsIn,
  }: {
    lendingTokens: IPoolToken[]
    tokensIn: string[]
    account: string
    amountsIn: BigNumber[]
  }): Promise<BigNumber[]> {
    const checkCalls: string[] = []
    const wrappedAddresses: string[] = []
    const lendingTokenAmounts: LendingToken[] = []
    lendingTokens.map((lendingToken) => {
      const index = tokensIn.indexOf(lendingToken.address)
      if (amountsIn[index].gt(0)) {
        checkCalls.push(
          this.batchRelayerService.encodeDepositAaveToken({
            staticToken: lendingToken.address,
            sender: account,
            recipient: this.batchRelayerService._balancerRelayer.address,
            fromUnderlying: false,
            amount: amountsIn[index],
            outputReference: BigNumber.from(0),
          }),
        )

        wrappedAddresses.push(lendingToken.address)
      }
    })

    const lendingTokenWrappedAmountsResult = await this.batchRelayerService.staticMulticall(
      checkCalls,
    )

    lendingTokenWrappedAmountsResult.map((wrappedAmount, index) => {
      lendingTokenAmounts.push({
        address: wrappedAddresses[index],
        wrappedAmount: BigNumber.from(wrappedAmount),
      })
    })

    return tokensIn.map((tokenIn, index) => {
      const wrappedAmount: LendingToken | undefined = lendingTokenAmounts.find(
        (lendingTokenAmount) => lendingTokenAmount.address === tokenIn,
      )

      if (wrappedAmount) {
        return wrappedAmount.wrappedAmount
      }

      return amountsIn[index]
    })
  }

  private async joinWithLendingTokens({
    pool,
    allTokens,
    account,
    amountsIn,
    lendingTokens,
    notEmptyTokensIn,
    tokensIn,
    slippage,
    chainId,
  }: {
    pool: IPool
    allTokens: IPoolToken[]
    tokensIn: string[]
    notEmptyTokensIn: string[]
    account: string
    amountsIn: BigNumber[]
    lendingTokens: IPoolToken[]
    slippage?: BigNumber
    chainId: string
  }) {
    const standardTokens = allTokens.filter(
      (token) =>
        !token.isLendingToken &&
        notEmptyTokensIn.some(
          (tokenIn) => address(tokenIn) === address(token.address),
        ),
    )

    const amountsInWithLendWrappedTokens = await this.getAmountsInWithLendWrappedTokens(
      {
        lendingTokens,
        tokensIn,
        account,
        amountsIn,
      },
    )

    const tokenChainReferenceAmounts: ChainReferenceTokenAmount[] = []
    const calls: string[] = []

    lendingTokens.map((lendingToken) => {
      const index = tokensIn.indexOf(lendingToken.address)

      calls.push(
        this.batchRelayerService.encodeDepositAaveToken({
          staticToken: lendingToken.address,
          sender: account,
          recipient: this.batchRelayerService._balancerRelayer.address,
          fromUnderlying: false,
          amount: amountsIn[index],
          outputReference: this.toChainedReference(index),
        }),
      )

      tokenChainReferenceAmounts.push({
        address: lendingToken.address,
        amount: this.toChainedReference(index),
      })

      calls.push(
        this.batchRelayerService.encodeApproveToken(
          lendingToken.address,
          amountsIn[index],
        ),
      )
    })

    standardTokens.map((token) => {
      const index = tokensIn.indexOf(token.address)

      if (amountsInWithLendWrappedTokens[index].gt(0)) {
        calls.push(
          this.batchRelayerService.encodeManageUserBalance(
            UserBalanceOpKind.TRANSFER_EXTERNAL,
            token.address,
            amountsInWithLendWrappedTokens[index],
            account,
            this.batchRelayerService._balancerRelayer.address,
          ),
        )
        calls.push(
          this.batchRelayerService.encodeApproveToken(
            token.address,
            amountsInWithLendWrappedTokens[index],
          ),
        )
      }
    })

    const { assets, swaps, amountsOut } = await this.queryJoinSwap(
      pool,
      tokensIn,
      amountsInWithLendWrappedTokens,
      SwapType.SwapExactIn,
      chainId,
    )

    const swapsIn: SwapToken[] = swaps.map((swap) => {
      return {
        token: assets[swap.assetInIndex],
        amount: BigNumber.from(swap.amount),
        type: SwapTokenType.max,
      }
    })

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

    const limit = this.tradeService.calculateLimits(
      swapsIn,
      swapsOut,
      assets,
      slippage,
    )

    const swapWithRefs = swaps.map((swap) => {
      const chainAmount = tokenChainReferenceAmounts.find(
        (chainAmount) => chainAmount.address === assets[swap.assetInIndex],
      )

      const amount = chainAmount ? chainAmount.amount.toString() : swap.amount
      return {
        ...swap,
        amount,
      }
    })

    calls.push(
      this.batchRelayerService.encodeBatchSwap({
        swapType: SwapType.SwapExactIn,
        assets: assets,
        swaps: swapWithRefs,
        funds: {
          sender: this.batchRelayerService._balancerRelayer.address,
          recipient: account,
          fromInternalBalance: false,
          toInternalBalance: false,
        },
        deadline: MaxUint256,
        limits: limit,
        outputReferences: [],
        value: BigNumber.from(0),
      }),
    )

    return await this.batchRelayerService.multicall(calls)
  }

  async join({
    account,
    pool,
    allTokens,
    amountsIn,
    tokensIn,
    chainId,
    slippage = ONE_PERCENT,
  }: JoinParams): Promise<TransactionResponse> {
    const notEmptyTokensIn = tokensIn.filter((_tokenIn, index) =>
      amountsIn[index].gt(BigNumber.from(0)),
    )

    const lendingTokens = allTokens.filter((token) =>
      notEmptyTokensIn.some(
        (tokenIn) =>
          address(tokenIn) === address(token.address) && token.isLendingToken,
      ),
    )

    if (lendingTokens.length > 0) {
      return this.joinWithLendingTokens({
        account,
        allTokens,
        amountsIn,
        lendingTokens,
        notEmptyTokensIn,
        pool,
        tokensIn,
        slippage,
        chainId,
      })
    }

    const { assets, swaps, amountsOut } = await this.queryJoinSwap(
      pool,
      tokensIn,
      amountsIn,
      SwapType.SwapExactIn,
      chainId,
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

    const limit = this.tradeService.calculateLimits(
      swapsIn,
      swapsOut,
      assets,
      slippage,
    )

    const funds = this.tradeService.getFundManagement(account)

    const batchSwapTransaction = await this.tradeService.batchSwap(
      assets,
      swaps,
      limit,
      SwapType.SwapExactIn,
      funds,
      chainId,
    )

    return batchSwapTransaction
  }

  async queryExitTokenIn({
    tokenInAddress,
    amountsIn,
    tokensOutAddresses,
    chainId,
  }: QueryExitTokenInParams): Promise<QueryExitTokenInResult> {
    const tokensInAddresses = tokensOutAddresses.map(() => tokenInAddress)

    return await this.tradeService.previewBatchSwapTokensIn(
      tokensInAddresses,
      tokensOutAddresses,
      amountsIn,
      SwapType.SwapExactIn,
      chainId,
    )
  }

  async exitTokenIn({
    account,
    pool,
    allPools,
    allTokens,
    tokenInAddress,
    amountsIn,
    tokensOutAddresses,
    chainId,
    slippage = ONE_PERCENT,
  }: ExitTokenInParams): Promise<TransactionResponse> {
    const exitTokenInPreview = await this.queryExitTokenIn({
      account,
      pool,
      allPools,
      tokenInAddress,
      amountsIn,
      tokensOutAddresses,
      chainId,
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
      slippage,
    )

    const calls: string[] = []

    calls.push(
      this.batchRelayerService.encodeBatchSwap({
        swapType: SwapType.SwapExactIn,
        assets: exitTokenInPreview.assets,
        swaps: exitTokenInPreview.swaps,
        funds: {
          sender: account,
          recipient: this.batchRelayerService._balancerRelayer.address,
          fromInternalBalance: false,
          toInternalBalance: false,
        },
        deadline: MaxUint256,
        limits: limit,
        outputReferences: exitTokenInPreview.assets.map((_asset, index) => {
          return {
            index,
            key: this.toChainedReference(index),
          }
        }),
        value: BigNumber.from(0),
      }),
    )

    const lendingTokens = allTokens.filter((token) => {
      return swapsOut.some(
        (swapOutToken) =>
          swapOutToken?.amount?.gt(0) &&
          address(swapOutToken.token) === address(token.address) &&
          token.isLendingToken,
      )
    })

    lendingTokens.map((lendingToken) => {
      const index = exitTokenInPreview.assets.findIndex(
        (address) => address === lendingToken.address,
      )

      calls.push(
        this.batchRelayerService.encodeWithdrawAaveToken({
          staticToken: lendingToken.address,
          toUnderlying: false,
          sender: this.batchRelayerService._balancerRelayer.address,
          recipient: account,
          amount: this.toChainedReference(index),
          outputReference: BigNumber.from(0),
        }),
      )
    })

    const standardNotEmptyTokens = allTokens.filter(
      (token) =>
        !token.isLendingToken &&
        swapsOut.some(
          (tokenOut) =>
            tokenOut?.amount?.gt(0) &&
            address(tokenOut.token) === address(token.address),
        ),
    )

    standardNotEmptyTokens.forEach((token) => {
      calls.push(
        this.batchRelayerService.encodeApproveToken(
          token.address,
          BigNumber.from(ethers.constants.MaxUint256),
        ),
      )
    })

    calls.push(
      this.batchRelayerService.encodeRefundTokens({
        tokens: standardNotEmptyTokens.map((token) => token.address),
        recipient: account,
      }),
    )

    const response = await this.batchRelayerService.multicall(calls)

    return response
  }

  async queryExitTokensOut({
    tokenInAddress,
    amountsOut,
    tokensOutAddresses,
    chainId,
  }: QueryExitTokensOutParams): Promise<QueryExitTokensOutResult> {
    return await this.tradeService.previewBatchSwapTokensIn(
      tokensOutAddresses.map(() => tokenInAddress),
      tokensOutAddresses,
      amountsOut,
      SwapType.SwapExactOut,
      chainId,
    )
  }

  async exitTokensOut({
    account,
    pool,
    allPools,
    allTokens,
    tokenInAddress,
    amountsOut,
    tokensOutAddresses,
    fullUserLpTokenBalance,
    tokenIndex,
    chainId,
    slippage = ONE_PERCENT,
  }: ExitTokensOutParams): Promise<TransactionResponse> {
    const exitTokensOutPreview = await this.queryExitTokensOut({
      account,
      pool,
      tokenInAddress,
      amountsOut,
      tokensOutAddresses,
      chainId,
    })

    const tokenInIndex = exitTokensOutPreview.assets.findIndex(
      (tokenAddress) => tokenAddress === tokenInAddress,
    )

    if (
      tokenIndex !== null &&
      tokenIndex !== undefined &&
      fullUserLpTokenBalance &&
      exitTokensOutPreview.amountsIn[tokenInIndex].gt(fullUserLpTokenBalance)
    ) {
      return this.exitTokenIn({
        account,
        pool,
        allPools,
        allTokens,
        tokenInAddress,
        amountsIn: [fullUserLpTokenBalance],
        tokensOutAddresses: [tokensOutAddresses[tokenIndex]],
        slippage: slippage,
        chainId,
      })
    }

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
      slippage,
    )

    const funds = this.tradeService.getFundManagement(account)

    const batchSwapTransaction = this.tradeService.batchSwap(
      exitTokensOutPreview.assets,
      exitTokensOutPreview.swaps,
      limit,
      SwapType.SwapExactOut,
      funds,
      chainId,
    )

    return batchSwapTransaction
  }

  private toChainedReference(key: number): BigNumber {
    const CHAINED_REFERENCE_PREFIX = 'ba10'

    // The full padded prefix is 66 characters long, with 64 hex characters and the 0x prefix.
    const paddedPrefix = `0x${CHAINED_REFERENCE_PREFIX}${'0'.repeat(
      64 - CHAINED_REFERENCE_PREFIX.length,
    )}`

    return BigNumber.from(paddedPrefix).add(key)
  }
}

export class ComposableStablePoolServiceProvider
  implements IPoolServiceProvider {
  poolService: ComposableStablePoolService

  constructor(
    public readonly investService: InvestService,
    public readonly tradeService: TradeService,
    public readonly batchRelayerService: BatchRelayerService,
  ) {
    this.poolService = new ComposableStablePoolService(
      investService,
      tradeService,
      batchRelayerService,
    )
  }

  public provide(pool: IPool): ComposableStablePoolService | null {
    if (pool.poolType === PoolType.ComposableStable) {
      return this.poolService
    }

    return null
  }
}
