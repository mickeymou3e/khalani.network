import { BigNumber } from 'ethers'

import { IInitializeSaga } from '@interfaces/data'

export interface ByTokenAddress<T> {
  [key: string]: T
}

export type IBalanceSagaState = IInitializeSaga

export interface IBalance {
  id: string
  balances: {
    [key: string]: BigNumber
  }
}
