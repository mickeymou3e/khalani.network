import { BigNumber } from 'ethers'

import { TransactionResponse } from '@ethersproject/abstract-provider'
import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'

import { SwapV2 } from '../trade/types'

export interface IPoolServiceProvider {
  provide(pool: IPool): IPoolService | null
}

export interface IPoolService {
  queryJoin({
    account,
    pool,
    amountsIn,
    tokensIn,
  }: {
    account: string
    pool: IPool
    amountsIn: BigNumber[]
    tokensIn: IToken[]
  }): Promise<{
    amountOut: BigNumber
    amountsIn: BigNumber[]
  }>

  join({
    account,
    pool,
    amountsIn,
    tokensIn,
  }: {
    account: string
    pool: IPool
    amountsIn: BigNumber[]
    tokensIn: IToken[]
  }): Promise<TransactionResponse>

  queryExitTokenIn({
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
  }): Promise<{
    amountsOut: BigNumber[]
    amountsIn: BigNumber[]
    swaps: SwapV2[]
    assets: string[]
  }>

  exitTokenIn({
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
  }): Promise<TransactionResponse>

  queryExitTokensOut({
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
  }): Promise<{
    amountsOut: BigNumber[]
    amountsIn: BigNumber[]
    swaps: SwapV2[]
    assets: string[]
  }>

  exitTokensOut({
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
  }): Promise<TransactionResponse>
}
