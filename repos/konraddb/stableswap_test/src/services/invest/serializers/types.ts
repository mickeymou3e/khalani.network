import { BigNumberish, BytesLike } from 'ethers'

import { Address } from '@interfaces/data'

export enum JoinKind {
  INIT,
  EXACT_TOKENS_IN_FOR_BPT_OUT,
  TOKEN_IN_FOR_EXACT_BPT_OUT,
}

export interface JoinPoolRequest {
  assets: Address[]
  maxAmountsIn: BigNumberish[]
  userData: BytesLike
  fromInternalBalance: boolean
}

export interface ExitPoolRequest {
  assets: Address[]
  minAmountsOut: BigNumberish[]
  userData: BytesLike
  toInternalBalance: boolean
}
