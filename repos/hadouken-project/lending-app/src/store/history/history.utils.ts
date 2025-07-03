import { v4 as uuid } from 'uuid'

import { BorrowType } from '@constants/Lending'
import { IContractOperation, OperationStatus } from '@interfaces/history'
import { ITokenValue } from '@interfaces/tokens'

import { messages } from './history.messages'
import { TransactionType } from './history.types'

export const createApproveOperation = (
  token: ITokenValue,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.APPROVE_TOKEN_TITLE,
  description: messages.APPROVE_TOKEN_DESCRIPTION(token),
  status: OperationStatus.Waiting,
})

export const createDepositOperation = (
  token: ITokenValue,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.DEPOSIT_TITLE,
  description: messages.DEPOSIT_DESCRIPTION(token),
  status: OperationStatus.Waiting,
})

export const createBackstopDepositOperation = (
  token: ITokenValue,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.BACKSTOP_DEPOSIT_TITLE,
  description: messages.BACKSTOP_DEPOSIT_DESCRIPTION(token),
  status: OperationStatus.Waiting,
})

export const createWithdrawOperation = (
  token: ITokenValue,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.WITHDRAW_TITLE,
  description: messages.WITHDRAW_DESCRIPTION(token),
  status: OperationStatus.Waiting,
})

export const createBackstopWithdrawOperation = (
  token: ITokenValue,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.BACKSTOP_WITHDRAW_TITLE,
  description: messages.BACKSTOP_WITHDRAW_DESCRIPTION(token),
  status: OperationStatus.Waiting,
})

export const createCollateralOperation = (
  token: ITokenValue,
  useAsCollateral: boolean,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.COLLATERAL_TITLE,
  description: messages.COLLATERAL_DESCRIPTION(token, useAsCollateral),
  status: OperationStatus.Waiting,
})

export const createBorrowOperation = (
  token: ITokenValue,
  borrowType: BorrowType,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.BORROW_TITLE,
  description: messages.BORROW_DESCRIPTION(token, borrowType),
  status: OperationStatus.Waiting,
})

export const createRepayOperation = (
  token: ITokenValue,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.REPAY_TITLE,
  description: messages.REPAY_DESCRIPTION(token),
  status: OperationStatus.Waiting,
})

export const createSwapBorrowModeOperation = (
  token: ITokenValue,
  borrowType: BorrowType,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.SWAP_BORROW_MODE_TITLE,
  description: messages.SWAP_BORROW_MODE_DESCRIPTION(token, borrowType),
  status: OperationStatus.Waiting,
})

export const createMintOperation = (
  token: ITokenValue,
  chainId: string,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.MINT_TITLE,
  description: messages.MINT_DESCRIPTION(token, chainId),
  status: OperationStatus.Waiting,
})

export const getTransactionTypeName = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.BackstopDeposit:
      return 'Backstop deposit'
    case TransactionType.BackstopWithdraw:
      return 'Backstop withdraw'
    case TransactionType.Deposit:
      return 'Deposit'
    case TransactionType.Withdraw:
      return 'Withdraw'

    case TransactionType.Borrow:
      return 'Borrow'

    case TransactionType.Repay:
      return 'Repay'

    case TransactionType.SwapBorrowMode:
      return 'Swap Borrow Mode'

    case TransactionType.Collateral:
      return 'Collateral'

    case TransactionType.Mint:
      return 'Mint'

    default:
      return 'Error'
  }
}
