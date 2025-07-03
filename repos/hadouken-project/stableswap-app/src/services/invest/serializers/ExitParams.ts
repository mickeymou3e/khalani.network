import { BigNumber, BigNumberish } from 'ethers'

import { IPool, PoolType } from '@interfaces/pool'
import { IToken } from '@interfaces/token'

import { encodeExitComposableStablePool } from '../encoder/StableComposablePool'
import { encodeExitStablePool, ExitKind } from '../encoder/StablePool'
import { ExitPoolRequest } from './types'

export default class ExitParams {
  private readonly dataEncodeFn: (data: unknown) => string

  constructor(private readonly pool: IPool) {
    switch (pool.poolType) {
      case PoolType.ComposableStable: {
        this.dataEncodeFn = encodeExitComposableStablePool
        break
      }
      case PoolType.Stable: {
        this.dataEncodeFn = encodeExitStablePool
        break
      }
      default: {
        this.dataEncodeFn = encodeExitStablePool
      }
    }
  }

  public serialize(
    amountsOut: BigNumber[],
    tokensOutAddresses: IToken['address'][],
    amountIn: BigNumber,
    exitTokenIndex: number | null,
    exactOut: boolean,
    toInternalBalance: boolean,
  ): ExitPoolRequest {
    const encodedExitPoolUserData = this.encodeData(
      amountsOut,
      amountIn,
      exitTokenIndex,
      exactOut,
    )

    const minAmountsOut = amountsOut
    const exitPoolRequest: ExitPoolRequest = {
      assets: tokensOutAddresses,
      // This is a hack to get around rounding issues for MetaStable pools
      // TODO: do this more elegantly
      minAmountsOut: minAmountsOut.map((amount) =>
        amount.gt(0) ? amount.sub(1) : amount,
      ),
      userData: encodedExitPoolUserData,
      toInternalBalance: toInternalBalance,
    }

    return exitPoolRequest
  }

  private encodeData = (
    amountsOut: BigNumberish[],
    amountIn: BigNumberish,
    exitTokenIndex: number | null,
    exactOut: boolean,
  ): string => {
    const isSingleAssetOut = exitTokenIndex !== null

    if (isSingleAssetOut) {
      return this.dataEncodeFn({
        kind: ExitKind.ExactInOneOut,
        bptAmountIn: amountIn,
        exitTokenIndex,
      })
    } else if (exactOut) {
      return this.dataEncodeFn({
        kind: ExitKind.ExactOut,
        amountsOut,
        maxBPTAmountIn: amountIn,
      })
    } else {
      return this.dataEncodeFn({
        kind: ExitKind.ExactIn,
        bptAmountIn: amountIn,
      })
    }
  }
}
