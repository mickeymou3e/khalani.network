import { IInitializeSaga } from '@interfaces/data'

export interface IContractOperation {
  id: string
  title: string
  description: string
  status: OperationStatus
  timeStamp: number
}

export enum TransactionType {
  Deposit,
  Withdraw,
  Swap,
  BridgeDeposit,
  Lock,
  Approve,
}

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

export interface ITransaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  operations: IContractOperation[]
}

export interface IHistorySagaState extends IInitializeSaga {
  pendingQueue: string[]
  lastSubgraphSyncedBlock: number
}
