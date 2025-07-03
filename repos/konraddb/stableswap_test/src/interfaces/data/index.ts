import { BigNumber } from 'ethers'

import { RequestStatus } from '@constants/Request'
import {
  OperationStatus,
  TransactionStatus,
} from '@store/history/history.types'

export type Address = string
export type Id = string

export type amount = {
  id: string
  value: BigNumber
}

export interface IDisplayValue {
  value: BigNumber
  displayValue: string
  decimals?: number
}

export interface IInitializeSaga {
  status: RequestStatus
}

export interface IHistoryTransaction {
  title: string
  status: TransactionStatus
  date: Date
  operations: IOperation[]
}

export interface IOperation {
  id: string
  title: string
  description: string
  status: OperationStatus
}

export interface IRouteNode {
  id: string
  name: string
  tokens: { id: string; symbol: string }[]
}
