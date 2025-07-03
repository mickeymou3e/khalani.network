import { v4 as uuid } from 'uuid'

import { ETransactionStatus } from '@tvl-labs/khalani-ui'
import {
  TokenModelBalanceWithChain,
  TokenModel,
  BigDecimal,
} from '@tvl-labs/sdk'

import { messages } from './history.messages'
import {
  IContractOperation,
  ITransaction,
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
  tokens: TokenModelBalanceWithChain[],
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

export const createRemoveFromPoolOperation = (
  inToken: TokenModel,
  inTokenAmount: BigDecimal,
  outTokens: TokenModel[],
  outTokensAmounts: BigDecimal[],
): IContractOperation => ({
  id: uuid(),
  title: messages.REMOVE_TITLE,
  description: messages.REMOVE_DESCRIPTION_AMOUNT(
    inToken,
    inTokenAmount,
    outTokens,
    outTokensAmounts,
  ),
  status: OperationStatus.Waiting,
  timeStamp: Date.now(),
})

export const createSafeDeploymentOperation = (): IContractOperation => ({
  id: uuid(),
  title: 'Create Khalani account',
  description: '',
  status: OperationStatus.Waiting,
  timeStamp: Date.now(),
})

export const createBridgeOperation = (
  baseSymbol: string,
  baseTokenValue: string,
): IContractOperation => ({
  id: uuid(),
  title: messages.DEPOSIT_TOKEN_AND_CALL,
  description: messages.LOCK_DESCRIPTION(baseSymbol, baseTokenValue),
  status: OperationStatus.Waiting,
  timeStamp: Date.now(),
})

export const getTransactionTypeName = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.Deposit:
      return 'Deposit'
    case TransactionType.Withdraw:
      return 'Withdraw'
    case TransactionType.Approve:
      return 'Approve'
    case TransactionType.BridgeDeposit:
      return 'Bridge'
    case TransactionType.CreateSafe:
      return 'Create Account'
    default:
      return 'Error'
  }
}

export const getPendingOperations = (
  allPendingTransactions: ITransaction[],
): number =>
  allPendingTransactions.reduce((allPendingOperations, transaction) => {
    const pendingOperations = transaction.operations.filter(
      (operation) =>
        operation.status === OperationStatus.Pending ||
        operation.status === OperationStatus.Waiting,
    ).length
    return allPendingOperations + pendingOperations
  }, 0)

export const checkIfIsInProgress = (transactions: ITransaction[]): boolean =>
  transactions.filter((transaction) =>
    transaction.operations.some(
      (operation) =>
        operation.status === OperationStatus.Pending ||
        operation.status === OperationStatus.Waiting,
    ),
  ).length > 0

export const findPendingOrLastTransaction = (
  transactions: ITransaction[],
): ITransaction =>
  transactions.find(
    (transaction) => transaction.status === ETransactionStatus.Pending,
  ) || transactions.slice(-1)[0]
