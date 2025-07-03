import { BigNumber, Contract, utils } from 'ethers'

import { Network } from '@constants/Networks'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { IPool, PoolType } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { lockService } from '@libs/services/lock.service'
import { ITokenWithChainId } from '@store/khala/tokens/tokens.types'

import InvestService from '../invest/invest.service'
import TradeService from '../trade/trade.service'
import { SwapType } from '../trade/types'
import {
  ComposableStablePoolJoinArguments,
  ComposableStablePoolService,
} from './ComposableStablePool'
import { IPoolServiceProvider } from './types'

type CrossChainComposableStablePoolJoinArguments = {
  account: string
  pool: IPool
  amountsIn: BigNumber[]
  tokensIn: ITokenWithChainId[]
}

export class CrossChainComposableStablePoolService extends ComposableStablePoolService {
  constructor(
    public readonly investService: InvestService,
    public readonly tradeService: TradeService,
    public readonly router: Contract,
  ) {
    super(investService, tradeService)
  }

  async crossChainQueryJoin({
    account,
    pool,
    amountsIn,
    tokensIn,
  }: CrossChainComposableStablePoolJoinArguments) {
    if (tokensIn.length !== 1 || amountsIn.length !== 1) {
      throw new Error(
        'Only single-sided (1 token) join is supported at this moment in "crossChainQueryJoin()"',
      )
    }

    const balancerPoolTokensIn = await this.originChainToBalancerChainTokens(
      tokensIn,
    )

    return this.queryJoin({
      account,
      pool,
      amountsIn,
      tokensIn: balancerPoolTokensIn,
    })
  }

  async crossChainJoin({
    account,
    pool,
    amountsIn,
    tokensIn,
  }: CrossChainComposableStablePoolJoinArguments): Promise<TransactionResponse> {
    if (tokensIn.length !== 1 || amountsIn.length !== 1) {
      throw new Error(
        'Only single-sided (1 token) join is supported at this moment in "crossChainJoin()"',
      )
    }

    const balancerPoolTokensIn = await this.originChainToBalancerChainTokens(
      tokensIn,
    )

    const innerCallData = await this.encodeJoinABI({
      account,
      pool,
      amountsIn,
      tokensIn: balancerPoolTokensIn,
    })

    return this.router.depositTokenAndCall(
      tokensIn[0].address,
      amountsIn[0],
      tokensIn[0].symbol.includes('PAN'),
      utils.hexZeroPad(pool.address, 32),
      innerCallData,
    )
  }

  async encodeCrossChainJoinABI({
    account,
    pool,
    amountsIn,
    tokensIn,
  }: CrossChainComposableStablePoolJoinArguments): Promise<string> {
    if (tokensIn.length !== 1 || amountsIn.length !== 1) {
      throw new Error(
        'Only single-sided (1 token) join is supported at this moment in "crossChainJoin()"',
      )
    }

    const balancerPoolTokensIn = await this.originChainToBalancerChainTokens(
      tokensIn,
    )

    const innerCallData = await this.encodeJoinABI({
      account,
      pool,
      amountsIn,
      tokensIn: balancerPoolTokensIn,
    })

    return this.router.interface.encodeFunctionData('depositTokenAndCall', [
      tokensIn[0].address,
      amountsIn[0],
      tokensIn[0].symbol.includes('PAN'),
      utils.hexZeroPad(pool.address, 32),
      innerCallData,
    ])
  }

  async encodeJoinABI({
    account,
    pool,
    amountsIn,
    tokensIn,
  }: ComposableStablePoolJoinArguments): Promise<string> {
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

    return this.tradeService.encodeBatchSwapABI(
      assets,
      swaps,
      limit,
      SwapType.SwapExactIn,
      funds,
    )
  }

  async originChainToBalancerChainTokens(
    tokens: ITokenWithChainId[],
  ): Promise<IToken[]> {
    if (tokens.length !== 1) {
      throw new Error(
        `Currently "originChainToBalancerChainTokens()" supports passing only single token`,
      )
    }

    const MOCK_TOKENS: ITokenWithChainId[] = await lockService.getTokens()

    const token = tokens[0]
    if (token.chainId === Network.Goerli) {
      const balancerChainToken = MOCK_TOKENS.find(
        (i) => i.chainId === Network.Axon && i.symbol === 'USDCeth',
      )

      if (!balancerChainToken) {
        throw new Error(
          `Can't find respective token in "originChainToBalancerChainTokens()"`,
        )
      }

      return [balancerChainToken]
    }

    if (token.chainId === Network.AvalancheTestnet) {
      const balancerChainToken = MOCK_TOKENS.find(
        (i) => i.chainId === Network.Axon && i.symbol === 'USDCavax',
      )

      if (!balancerChainToken) {
        throw new Error(
          `Can't find respective token in "originChainToBalancerChainTokens()"`,
        )
      }

      return [balancerChainToken]
    }

    return []
  }
}

export class CrossChainComposableStablePoolServiceProvider
  implements IPoolServiceProvider {
  poolService: CrossChainComposableStablePoolService

  constructor(
    public readonly investService: InvestService,
    public readonly tradeService: TradeService,
    public readonly router: Contract,
  ) {
    this.poolService = new CrossChainComposableStablePoolService(
      investService,
      tradeService,
      router,
    )
  }

  public provide(pool: IPool): CrossChainComposableStablePoolService | null {
    if (pool.poolType === PoolType.ComposableStable) {
      return this.poolService
    }

    return null
  }
}
