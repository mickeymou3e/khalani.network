import { BigNumberish, BytesLike } from 'ethers'

export enum JoinKind {
  INIT,
  EXACT_TOKENS_IN_FOR_BPT_OUT,
  TOKEN_IN_FOR_EXACT_BPT_OUT,
}

export interface JoinPoolRequest {
  assets: string[]
  maxAmountsIn: BigNumberish[]
  userData: BytesLike
  fromInternalBalance: boolean
}

export interface ExitPoolRequest {
  assets: string[]
  minAmountsOut: BigNumberish[]
  userData: BytesLike
  toInternalBalance: boolean
}
