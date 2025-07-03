import { BigNumber } from 'ethers'

import { IInitializeSaga } from '@interfaces/data'

export interface ByTokenId<T> {
  [key: string]: T
}

export type ITokensSagaState = IInitializeSaga & {
  isFetching: boolean
  isMintingToken: boolean
}

export type MintTokenPayload = {
  address: string
  amount: BigNumber
}
