import { BigNumber, constants } from 'ethers'

import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'

import InvestService from '../invest/invest.service'
import TradeService from '../trade/trade.service'
import { SwapV2 } from '../trade/types'
import { IPoolService, IPoolServiceProvider } from './types'

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
  }: {
    account: string
    pool: IPool
    amountsIn: BigNumber[]
    tokensIn: IToken[]
  }): Promise<{ amountsIn: BigNumber[]; amountOut: BigNumber }> {
    const { amountTokenOut } = await this.investService.queryJoin(
      account,
      pool,
      amountsIn,
      tokensIn.map((tokenIn) => tokenIn),
    )

    return {
      amountsIn,
      amountOut: amountTokenOut,
    }
  }

  async join({
    account,
    pool,
    amountsIn,
    tokensIn,
  }: {
    account: string
    pool: IPool
    amountsIn: BigNumber[]
    tokensIn: IToken[]
  }) {
    const joinTransaction = await this.investService.join(
      account,
      pool,
      amountsIn,
      tokensIn,
    )

    return joinTransaction
  }

  async queryExitTokenIn({
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
    const tokensAddresses = pool.tokens.map(({ address }) => address)
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
      tokensAddresses,
      amountIn,
      exitTokenIndex,
      false,
      false,
    )

    const amountsOut = queryExitResult.amountsOut

    if (amountIn.eq(BigNumber.from(0))) {
      throw Error('Lp tokens to burn equal 0')
    }

    const assets = [
      tokenInAddress,
      ...pool.tokens.map(({ address }) => address),
    ]
    const amountOutResult = assets.map((address) => {
      const tokenOutIndex = tokensAddresses.indexOf(address)
      if (tokenOutIndex === -1) {
        return BigNumber.from(0)
      }
      return amountsOut[tokenOutIndex]
    })
    const amountInResult = assets.map((address) => {
      const tokenOutIndex = tokensOutAddresses.indexOf(address)
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
    const tokensAddresses = pool.tokens.map(({ address }) => address)

    const exitTokenInPreview = await this.queryExitTokenIn({
      account,
      pool,
      tokenInAddress,
      amountIn,
      tokensOutAddresses,
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
      return amountOut
    })

    const exitTransaction = await this.investService.exit(
      account,
      pool,
      amountsOut,
      tokensOutAddresses,
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
  }: {
    account: string
    pool: IPool
    tokenInAddress: IToken['address']
    amountsOut: BigNumber[]
    tokensOutAddresses: IToken['address'][]
  }) {
    const queryExitResult = await this.investService.queryExit(
      account,
      pool,
      amountsOut,
      tokensOutAddresses,
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
      const tokenOutIndex = tokensOutAddresses.indexOf(address)
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
      (address) => address === pool.address,
    )
    const amountIn = exitTokensOutPreview.amountsIn[tokenInIndex]
    const exitTransaction = await this.investService.exit(
      account,
      pool,
      amountsOut,
      tokensOutAddresses,
      amountIn,
      null,
      true,
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
