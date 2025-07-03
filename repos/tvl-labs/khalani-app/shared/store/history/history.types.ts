import { IInitializeSaga } from '@interfaces/index'
import { ETransactionStatus } from '@tvl-labs/khalani-ui'

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
  BridgeDeposit,
  Lock,
  Approve,
  CreateSafe,
}

export enum TransactionStatus {
  Pending = 0,
  Success = 1,
  Fail = 2,
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
  status: ETransactionStatus
  operations: IContractOperation[]
}

export interface IHistorySagaState extends IInitializeSaga {
  pendingQueue: string[]
  lastTx: string | null
}
