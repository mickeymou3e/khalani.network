export enum TransactionStatus {
  Pending,
  Success,
  Fail,
}

export enum OperationStatus {
  Waiting,
  Pending,
  Success,
  Fail,
  Aborted,
}

export interface IContractOperation {
  id: string
  title: string
  description: string
  status: OperationStatus
  timeStamp: number
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
