import { RequestStatus } from '@constants/Request'
import { IOperation } from '@hadouken-project/ui'
import { TransactionStatus } from '@store/history/history.types'

export interface IInitializeSaga {
  status: RequestStatus
}

export interface IHistoryTransaction {
  title: string
  status: TransactionStatus
  date: Date
  operations: IOperation[]
}
