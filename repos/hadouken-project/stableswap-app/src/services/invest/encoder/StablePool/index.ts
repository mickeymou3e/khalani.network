import { BigNumberish } from '@ethersproject/bignumber'

import {
  JoinKind,
  JoinStablePoolExactTokensInForBPTOut,
  JoinStablePoolInit,
  JoinStablePoolTokenInForExactBPTOut,
} from '../types'
import { StablePoolEncoder } from './encoder'

export type JoinStablePoolData =
  | JoinStablePoolInit
  | JoinStablePoolExactTokensInForBPTOut
  | JoinStablePoolTokenInForExactBPTOut

export function encodeJoinStablePool(joinData: JoinStablePoolData): string {
  if (joinData.kind == JoinKind.Init) {
    return StablePoolEncoder.joinInit(joinData.amountsIn)
  } else if (joinData.kind == JoinKind.ExactIn) {
    return StablePoolEncoder.joinExactTokensInForBPTOut(
      joinData.amountsIn,
      joinData.minimumBPT,
    )
  } else {
    return StablePoolEncoder.joinTokenInForExactBPTOut(
      joinData.bptAmountOut,
      joinData.enterTokenIndex,
    )
  }
}

export enum ExitKind {
  ExactInOneOut = 'ExactBPTInForOneTokenOut',
  ExactIn = 'ExactBPTInForTokensOut',
  ExactOut = 'BPTInForExactTokensOut',
}

export type ExitStablePoolExactBPTInForOneTokenOut = {
  kind: ExitKind.ExactInOneOut
  bptAmountIn: BigNumberish
  exitTokenIndex: number
}

export type ExitStablePoolExactBPTInForTokensOut = {
  kind: ExitKind.ExactIn
  bptAmountIn: BigNumberish
}

export type ExitStablePoolBPTInForExactTokensOut = {
  kind: ExitKind.ExactOut
  amountsOut: BigNumberish[]
  maxBPTAmountIn: BigNumberish
}

export type ExitStablePoolData =
  | ExitStablePoolExactBPTInForOneTokenOut
  | ExitStablePoolExactBPTInForTokensOut
  | ExitStablePoolBPTInForExactTokensOut

export function encodeExitStablePool(exitData: ExitStablePoolData): string {
  if (exitData.kind == ExitKind.ExactInOneOut) {
    return StablePoolEncoder.exitExactBPTInForOneTokenOut(
      exitData.bptAmountIn,
      exitData.exitTokenIndex,
    )
  } else if (exitData.kind == ExitKind.ExactIn) {
    return StablePoolEncoder.exitExactBPTInForTokensOut(exitData.bptAmountIn)
  } else {
    return StablePoolEncoder.exitBPTInForExactTokensOut(
      exitData.amountsOut,
      exitData.maxBPTAmountIn,
    )
  }
}
