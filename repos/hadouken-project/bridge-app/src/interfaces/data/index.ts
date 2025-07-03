import { BigNumber } from 'ethers'

import { RequestStatus } from '@constants/Request'

export type Address = string

export interface IInitializeSaga {
  status: RequestStatus
}

export interface IDisplayValue {
  value: BigNumber
  displayValue: string
  decimals?: number
}
