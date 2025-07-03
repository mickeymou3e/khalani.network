import { v4 as uuid } from 'uuid'

import { IToken } from '@interfaces/token'
import { BigDecimal } from '@utils/math'

import { messages } from './history.messages'
import {
  IContractOperation,
  OperationStatus,
  TransactionType,
} from './history.types'

export const createApproveOperation = (
  symbol: string,
  value: string,
  contractName: string,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.APPROVE_TOKEN_TITLE,
  description: messages.APPROVE_TOKEN_DESCRIPTION(symbol, value, contractName),
  status: OperationStatus.Waiting,
})

export const createBlockConfirmation = (): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.BLOCK_FINALIZATION_TITLE,
  description: messages.BLOCK_FINALIZATION_DESCRIPTION,
  status: OperationStatus.Waiting,
})

export const createDepositToPoolOperation = (
  tokens: IToken[],
  amounts: BigDecimal[],
  contractName: string,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.DEPOSIT_TO_POOL_TITLE,
  description: messages.DEPOSIT_TO_POOL_DESCRIPTION(
    tokens,
    amounts,
    contractName,
  ),
  status: OperationStatus.Waiting,
})

export const createWithdrawFromPoolOperation = (
  inToken: IToken,
  inTokenAmount: BigDecimal,
  outTokens: IToken[],
  outTokensAmounts: BigDecimal[],
): IContractOperation => ({
  id: uuid(),
  title: messages.WITHDRAW_TITLE,
  description: messages.WITHDRAW_DESCRIPTION_AMOUNT(
    inToken,
    inTokenAmount,
    outTokens,
    outTokensAmounts,
  ),
  status: OperationStatus.Waiting,
  timeStamp: Date.now(),
})

export const createSwapOperation = (
  baseSymbol: string,
  baseTokenValue: string,
  quoteTokenSymbol: string,
): IContractOperation => ({
  id: uuid(),
  title: messages.SWAP_TITLE,
  description: messages.SWAP_DESCRIPTION(
    baseSymbol,
    quoteTokenSymbol,
    baseTokenValue,
  ),
  status: OperationStatus.Waiting,
  timeStamp: Date.now(),
})

export const createLockOperation = (
  baseSymbol: string,
  baseTokenValue: string,
): IContractOperation => ({
  id: uuid(),
  title: messages.SWAP_TITLE,
  description: messages.LOCK_DESCRIPTION(baseSymbol, baseTokenValue),
  status: OperationStatus.Waiting,
  timeStamp: Date.now(),
})

export const getTransactionTypeName = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.Deposit:
      return 'Deposit'
    case TransactionType.Swap:
      return 'Swap'
    case TransactionType.Withdraw:
      return 'Withdraw'
    case TransactionType.Approve:
      return 'Approve'
    default:
      return 'Error'
  }
}
