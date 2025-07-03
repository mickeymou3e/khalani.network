import { OperationStatus } from '@store/history/history.types'
import { ETransactionStatus } from '@tvl-labs/khalani-ui'
import { RequestStatus } from '@tvl-labs/sdk'

export interface IDisplayValue {
  value: bigint
  displayValue: string
  decimals?: number
}

export interface IInitializeSaga {
  status: RequestStatus
}

export interface IHistoryTransaction {
  title: string
  status: ETransactionStatus
  date: Date
  operations: IOperation[]
}

export interface IOperation {
  id: string
  title: string
  description: string
  status: OperationStatus
}
