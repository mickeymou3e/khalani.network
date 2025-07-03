import { IInitializeSaga } from '@interfaces/data'

export interface IContractOperation {
  id: string
  title: string
  description: string
  status: OperationStatus
  timeStamp: number
  type: OperationType
}

export enum TransactionType {
  Deposit,
  BackstopDeposit,
  Withdraw,
  Swap,
  Mint,
  Lock,
  Claim,
  Unlock,
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

export enum OperationType {
  Approve,
  BlockConfirmation,
  DepositToPool,
  WithdrawFromPool,
  Swap,
  Mint,
  Lock,
  Claim,
  Unlock,
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
  showBadge: boolean
  showHistoryDropdown: boolean
}
