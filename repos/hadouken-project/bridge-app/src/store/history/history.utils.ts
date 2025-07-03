import { v4 as uuid } from 'uuid'

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

export const createWithdrawOperation = (
  token: ITokenValue,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.WITHDRAW_TITLE,
  description: messages.WITHDRAW_DESCRIPTION(token),
  status: OperationStatus.Waiting,
})

export const getTransactionTypeName = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.Deposit:
      return 'Deposit'

    case TransactionType.Withdraw:
      return 'Withdraw'

    default:
      return 'Error'
  }
}
