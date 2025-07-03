import { BigNumber, constants } from 'ethers'

import { TransactionResponse } from '@ethersproject/abstract-provider'
import { IPool } from '@interfaces/pool'
import { ONE_PERCENT, removeSlippageFromValue } from '@utils/math'
import { findWrapEthWithAmount, replaceWrapEthToken } from '@utils/token/wEth'

import InvestService from '../invest/invest.service'
import TradeService from '../trade/trade.service'
import { SwapV2 } from '../trade/types'
import {
  ExitTokenInParams,
  ExitTokensOutParams,
  IPoolService,
  IPoolServiceProvider,
  JoinParams,
  QueryExitTokenInParams,
  QueryExitTokenInResult,
  QueryExitTokensOutParams,
  QueryExitTokensOutResult,
  QueryJoinParams,
  QueryJoinResult,
} from './types'

export class BasePoolService implements IPoolService {
  constructor(
    public readonly investService: InvestService,
    public readonly tradeService: TradeService,
  ) {}

  async queryJoin({
    account,
    pool,
    amountsIn,
    tokensIn,
    chainId,
  }: QueryJoinParams): Promise<QueryJoinResult> {
    const { isWEth, ethAmount } = findWrapEthWithAmount(
      chainId,
      tokensIn,
      amountsIn,
    )

    const tokens = replaceWrapEthToken(chainId, tokensIn)

    const { amountTokenOut } = await this.investService.queryJoin(
      account,
      pool,
      amountsIn,
      tokens,
      BigNumber.from(0),
      false,
    )

    return {
      amountsIn,
      amountOut: amountTokenOut,
      isWEth,
      ethAmount: ethAmount,
    }
  }

  async join({
    account,
    pool,
    allPools,
    allTokens,
    amountsIn,
    tokensIn,
    chainId,
    slippage = ONE_PERCENT,
  }: JoinParams): Promise<TransactionResponse> {
    const { amountOut, ethAmount } = await this.queryJoin({
      account,
      pool,
      allPools,
      allTokens,
      amountsIn,
      tokensIn,
      chainId,
    })

    const lpAmountOut = removeSlippageFromValue(amountOut, slippage)

    const tokens = replaceWrapEthToken(chainId, tokensIn)

    const joinTransaction = await this.investService.join(
      account,
      pool,
      amountsIn,
      tokens,
      lpAmountOut,
      false,
      ethAmount,
    )

    return joinTransaction
  }

  async queryExitTokenIn({
    account,
    pool,
    tokenInAddress,
    amountsIn,
    tokensOutAddresses,
    chainId,
  }: QueryExitTokenInParams): Promise<QueryExitTokenInResult> {
    const amountIn = amountsIn[0]
    const tokensAddresses = pool.tokens.map(({ address }) => address)
    const tokensOut = replaceWrapEthToken(
      chainId,
      pool.tokens.map(({ address }) => address),
    )

    const exitTokenIndex =
      tokensOutAddresses.length > 1
        ? null
        : tokensAddresses.findIndex(
            (address) => address === tokensOutAddresses[0],
          )

    const queryExitResult = await this.investService.queryExit(
      account,
      pool,
      [],
      tokensOut,
      amountIn,
      exitTokenIndex,
      false,
      false,
    )

    const amountsOut = queryExitResult.amountsOut

    if (amountIn.eq(BigNumber.from(0))) {
      throw Error('Lp tokens to burn equal 0')
    }

    const assets = [tokenInAddress, ...tokensOutAddresses]

    const amountOutResult = assets.map((address) => {
      const tokenOutIndex = tokensOutAddresses.indexOf(address)
      if (tokenOutIndex === -1) {
        return BigNumber.from(0)
      }
      return amountsOut[tokenOutIndex]
    })

    const amountInResult = assets.map((address) => {
      const tokenOutIndex = tokensOut.indexOf(address)
      if (tokenOutIndex === -1) {
        return queryExitResult.bptIn
      }
      return BigNumber.from(0)
    })
    return {
      amountsOut: amountOutResult,
      amountsIn: amountInResult,
      swaps: [] as SwapV2[],
      assets: assets,
    }
  }

  async exitTokenIn({
    account,
    pool,
    allPools,
    tokenInAddress,
    amountsIn,
    tokensOutAddresses,
    chainId,
    slippage = ONE_PERCENT,
  }: ExitTokenInParams): Promise<TransactionResponse> {
    const amountIn = amountsIn[0]
    const tokensAddresses = pool.tokens.map(({ address }) => address)

    const exitTokenInPreview = await this.queryExitTokenIn({
      account,
      pool,
      allPools,
      tokenInAddress,
      amountsIn,
      tokensOutAddresses,
      chainId,
    })

    const exitTokenIndex =
      tokensOutAddresses.length > 1
        ? null
        : tokensAddresses.findIndex(
            (address) => address === tokensOutAddresses[0],
          )

    const amountsOut = tokensAddresses.map((tokenAddress) => {
      const tokenOutIndex = exitTokenInPreview.assets.findIndex(
        (address) => address === tokenAddress,
      )
      const amountOut = exitTokenInPreview.amountsOut[tokenOutIndex]

      const amountOutWithSlippage = removeSlippageFromValue(amountOut, slippage)

      return amountOutWithSlippage
    })

    const tokensWithEth = replaceWrapEthToken(chainId, tokensOutAddresses)
    const exitTransaction = await this.investService.exit(
      account,
      pool,
      amountsOut,
      tokensWithEth,
      amountIn,
      exitTokenIndex,
      false,
      false,
    )

    return exitTransaction
  }

  async queryExitTokensOut({
    account,
    pool,
    tokenInAddress,
    amountsOut,
    tokensOutAddresses,
    chainId,
  }: QueryExitTokensOutParams): Promise<QueryExitTokensOutResult> {
    const tokensWithEth = replaceWrapEthToken(chainId, tokensOutAddresses)

    const queryExitResult = await this.investService.queryExit(
      account,
      pool,
      amountsOut,
      tokensWithEth,
      constants.MaxUint256,
      null,
      true,
      false,
    )

    const amountIn = queryExitResult.bptIn

    if (amountIn.eq(BigNumber.from(0))) {
      throw Error('Lp tokens to burn equal 0')
    }

    const assets = [tokenInAddress, ...tokensOutAddresses]
    const amountOutResult = assets.map((address) => {
      const tokenOutIndex = tokensOutAddresses.indexOf(address)
      if (tokenOutIndex === -1) {
        return BigNumber.from(0)
      }
      return amountsOut[tokenOutIndex]
    })
    const amountInResult = assets.map((address) => {
      const tokenOutIndex = tokensWithEth.indexOf(address)
      if (tokenOutIndex === -1) {
        return queryExitResult.bptIn
      }
      return BigNumber.from(0)
    })
    return {
      amountsOut: amountOutResult,
      amountsIn: amountInResult,
      swaps: [] as SwapV2[],
      assets: assets,
    }
  }

  async exitTokensOut({
    account,
    pool,
    tokenInAddress,
    amountsOut,
    tokensOutAddresses,
    fullUserLpTokenBalance,
    isMaxAmount,
    tokenIndex,
    chainId,
    slippage = ONE_PERCENT,
  }: ExitTokensOutParams): Promise<TransactionResponse> {
    const tokensWithEth = replaceWrapEthToken(chainId, tokensOutAddresses)

    const exitTokensOutPreview = await this.queryExitTokensOut({
      account,
      pool,
      tokenInAddress,
      amountsOut,
      tokensOutAddresses: tokensWithEth,
      chainId,
    })

    const tokenInIndex = exitTokensOutPreview.assets.findIndex(
      (address) => address === pool.address,
    )

    const amountIn =
      fullUserLpTokenBalance &&
      exitTokensOutPreview.amountsIn[tokenInIndex].gt(fullUserLpTokenBalance)
        ? fullUserLpTokenBalance
        : exitTokensOutPreview.amountsIn[tokenInIndex]

    const exactOut = !isMaxAmount

    const exitTokenIndex = tokenIndex ?? null

    const amountsOutWithSlippage = amountsOut.map((amountOut) =>
      removeSlippageFromValue(amountOut, slippage),
    )

    const exitTransaction = await this.investService.exit(
      account,
      pool,
      amountsOutWithSlippage,
      tokensWithEth,
      amountIn,
      exitTokenIndex,
      exactOut,
      false,
    )

    return exitTransaction
  }
}

export class BasePoolServiceProvider implements IPoolServiceProvider {
  poolService: BasePoolService

  constructor(
    public readonly investService: InvestService,
    public readonly tradeService: TradeService,
  ) {
    this.poolService = new BasePoolService(investService, tradeService)
  }

  public provide(_: IPool): BasePoolService {
    return this.poolService
  }
}
