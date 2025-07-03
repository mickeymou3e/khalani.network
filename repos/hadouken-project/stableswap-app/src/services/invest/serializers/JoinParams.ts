import { BigNumber, BigNumberish } from 'ethers'

import { IPool, PoolType } from '@interfaces/pool'

import { encodeJoinComposableStablePool } from '../encoder/StableComposablePool'
import { encodeJoinStablePool } from '../encoder/StablePool'
import { JoinKind } from '../encoder/types'
import { JoinPoolRequest } from './types'

export default class JoinParams {
  private readonly dataEncodeFn: (data: unknown) => string

  constructor(private readonly pool: IPool) {
    switch (pool.poolType) {
      case PoolType.ComposableStable: {
        this.dataEncodeFn = encodeJoinComposableStablePool
        break
      }
      case PoolType.Stable: {
        this.dataEncodeFn = encodeJoinStablePool
        break
      }
      default: {
        this.dataEncodeFn = encodeJoinStablePool
      }
    }
  }

  public serialize(
    amountsIn: BigNumber[],
    tokensIn: string[],
    lpAmountOut: BigNumber,
    fromInternalBalance: boolean,
  ): JoinPoolRequest {
    let dataAmountsIn = amountsIn
    if (this.pool.poolType === PoolType.ComposableStable) {
      const lpIndex = tokensIn.findIndex(
        (address) => address === this.pool.address,
      )
      dataAmountsIn = amountsIn.filter((amountIn, index) => index !== lpIndex)
    }

    const encodedJoinPoolUserData = this.encodeData(
      dataAmountsIn,
      lpAmountOut,
      false,
    )

    const joinPoolRequest: JoinPoolRequest = {
      assets: tokensIn,
      maxAmountsIn: amountsIn,
      userData: encodedJoinPoolUserData,
      fromInternalBalance: fromInternalBalance,
    }

    return joinPoolRequest
  }

  private encodeData = (
    amountsIn: BigNumberish[],
    minimumBPT: BigNumberish,
    isInit: boolean,
  ): string => {
    if (isInit) {
      return this.dataEncodeFn({ kind: JoinKind.Init, amountsIn })
    } else {
      return this.dataEncodeFn({
        kind: JoinKind.ExactIn,
        amountsIn,
        minimumBPT,
      })
    }
  }
}
