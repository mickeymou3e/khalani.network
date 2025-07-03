import { IOperation, TransactionStatus } from '@hadouken-project/ui'

export interface IHistoryTransaction {
  title: string
  status: TransactionStatus
  date: Date
  operations: IOperation[]
}
