import { BigNumberish } from '@ethersproject/bignumber'

import {
  JoinKind,
  JoinStablePoolExactTokensInForBPTOut,
  JoinStablePoolInit,
  JoinStablePoolTokenInForExactBPTOut,
} from '../types'
import { ComposableStablePoolEncoder } from './encoder'

export function encodeJoinComposableStablePool(
  joinData:
    | JoinStablePoolInit
    | JoinStablePoolExactTokensInForBPTOut
    | JoinStablePoolTokenInForExactBPTOut,
): string {
  if (joinData.kind == JoinKind.Init) {
    return ComposableStablePoolEncoder.joinInit(joinData.amountsIn)
  } else if (joinData.kind == JoinKind.ExactIn) {
    return ComposableStablePoolEncoder.joinExactTokensInForBPTOut(
      joinData.amountsIn,
      joinData.minimumBPT,
    )
  } else {
    return ComposableStablePoolEncoder.joinTokenInForExactBPTOut(
      joinData.bptAmountOut,
      joinData.enterTokenIndex,
    )
  }
}

export type ExitStablePoolExactBPTInForOneTokenOut = {
  kind: 'ExactBPTInForOneTokenOut'
  bptAmountIn: BigNumberish
  exitTokenIndex: number
}

export type ExitStablePoolBPTInForExactTokensOut = {
  kind: 'BPTInForExactTokensOut'
  amountsOut: BigNumberish[]
  maxBPTAmountIn: BigNumberish
}

export function encodeExitComposableStablePool(
  exitData:
    | ExitStablePoolExactBPTInForOneTokenOut
    | ExitStablePoolBPTInForExactTokensOut,
): string {
  if (exitData.kind == 'ExactBPTInForOneTokenOut') {
    return ComposableStablePoolEncoder.exitExactBPTInForOneTokenOut(
      exitData.bptAmountIn,
      exitData.exitTokenIndex,
    )
  }

  return ComposableStablePoolEncoder.exitBPTInForExactTokensOut(
    exitData.amountsOut,
    exitData.maxBPTAmountIn,
  )
}
