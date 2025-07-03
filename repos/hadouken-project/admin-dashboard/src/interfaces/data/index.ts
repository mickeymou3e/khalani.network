import { BigNumber } from 'ethers'

import { RequestStatus } from '@constants/Request'

export type Address = string

export interface IBackstopPool {
  id: string
  address: string
  symbol: string
  decimals: number
  totalBalance: BigNumber
  userBalance: BigNumber
}

export interface IInitializeSaga {
  status: RequestStatus
}
