import { IInitializeSaga } from '@interfaces/data'
import { IContractOperation, TransactionStatus } from '@interfaces/history'

export interface IHistorySagaState extends IInitializeSaga {
  pendingQueue: string[]
}

export enum TransactionType {
  BackstopDeposit,
  Deposit,
  Withdraw,
  BackstopWithdraw,
  Borrow,
  Repay,
  Collateral,
  SwapBorrowMode,
  Mint,
}

export interface ITransaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  operations: IContractOperation[]
}
