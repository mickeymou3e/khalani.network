import { BigNumberish } from '@ethersproject/bignumber'

export enum JoinKind {
  Init = 'Init',
  ExactIn = 'ExactTokensInForBPTOut',
  ExactOut = 'TokenInForExactBPTOut',
}

export enum StablePoolJoinKind {
  INIT = 0,
  EXACT_TOKENS_IN_FOR_BPT_OUT,
  TOKEN_IN_FOR_EXACT_BPT_OUT,
}

export enum StablePoolExitKind {
  EXACT_BPT_IN_FOR_ONE_TOKEN_OUT = 0,
  EXACT_BPT_IN_FOR_TOKENS_OUT,
  BPT_IN_FOR_EXACT_TOKENS_OUT,
}

export enum StablePhantomPoolJoinKind {
  INIT = 0,
  COLLECT_PROTOCOL_FEES,
}

export enum ComposableStablePoolJoinKind {
  INIT = 0,
  EXACT_TOKENS_IN_FOR_BPT_OUT,
  TOKEN_IN_FOR_EXACT_BPT_OUT,
}

export enum ComposableStablePoolExitKind {
  EXACT_BPT_IN_FOR_ONE_TOKEN_OUT = 0,
  BPT_IN_FOR_EXACT_TOKENS_OUT,
}

export type JoinStablePoolInit = {
  kind: JoinKind.Init
  amountsIn: BigNumberish[]
}

export type JoinStablePoolExactTokensInForBPTOut = {
  kind: JoinKind.ExactIn
  amountsIn: BigNumberish[]
  minimumBPT: BigNumberish
}

export type JoinStablePoolTokenInForExactBPTOut = {
  kind: JoinKind.ExactOut
  bptAmountOut: BigNumberish
  enterTokenIndex: number
}
