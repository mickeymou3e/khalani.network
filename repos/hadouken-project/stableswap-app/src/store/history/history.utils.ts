import { v4 as uuid } from 'uuid'

import { IToken } from '@interfaces/token'
import { BigDecimal } from '@utils/math'

import { messages } from './history.messages'
import {
  IContractOperation,
  OperationStatus,
  OperationType,
  TransactionType,
} from './history.types'

export const createBatchRelayerApproveOperation = (): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.APPROVE_BATCH_RELAYER_TITLE,
  description: messages.APPROVE_BATCH_RELAYER_DESCRIPTION,
  status: OperationStatus.Waiting,
  type: OperationType.Approve,
})

export const createApproveOperation = (
  symbol: string,
  value: string,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.APPROVE_TOKEN_TITLE,
  description: messages.APPROVE_TOKEN_DESCRIPTION(symbol, value),
  status: OperationStatus.Waiting,
  type: OperationType.Approve,
})

export const createDepositToPoolOperation = (
  tokens: IToken[],
  amounts: BigDecimal[],
  contractName: string,
  stakeToBackstop: boolean,
): IContractOperation => {
  if (stakeToBackstop) {
    return {
      id: uuid(),
      timeStamp: Date.now(),
      title:
        messages.DEPOSIT_TO_POOL_TITLE +
        ' + ' +
        messages.STAKE_TO_BACKSTOP_TITLE,
      description:
        messages.DEPOSIT_TO_POOL_DESCRIPTION(tokens, amounts, contractName) +
        messages.STAKE_TO_BACKSTOP_DESCRIPTION,
      status: OperationStatus.Waiting,
      type: OperationType.DepositToPool,
    }
  } else {
    return {
      id: uuid(),
      timeStamp: Date.now(),
      title: messages.DEPOSIT_TO_POOL_TITLE,
      description: messages.DEPOSIT_TO_POOL_DESCRIPTION(
        tokens,
        amounts,
        contractName,
      ),
      status: OperationStatus.Waiting,
      type: OperationType.DepositToPool,
    }
  }
}

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
  type: OperationType.WithdrawFromPool,
})

export const createSwapOperation = (
  baseSymbol: string,
  quoteTokenSymbol: string,
  baseTokenValue: string,
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
  type: OperationType.Swap,
})

export const createMintOperation = (
  tokenName: string,
  amount: BigDecimal,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.MINT_TOKEN_TITLE,
  description: messages.MINT_TOKEN_DESCRIPTION(tokenName, amount),
  status: OperationStatus.Waiting,
  type: OperationType.Mint,
})

export const createLockOperation = (
  tokenName: string,
  amount: BigDecimal,
): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.LOCK_TITLE,
  description: messages.LOCK_DESCRIPTION(amount, tokenName),
  status: OperationStatus.Waiting,
  type: OperationType.Lock,
})

export const createClaimOperation = (): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.CLAIM_TITLE,
  description: messages.CLAIM_DESCRIPTION,
  status: OperationStatus.Waiting,
  type: OperationType.Claim,
})

export const createUnlockOperation = (): IContractOperation => ({
  id: uuid(),
  timeStamp: Date.now(),
  title: messages.UNLOCK_TITLE,
  description: messages.UNLOCK_DESCRIPTION,
  status: OperationStatus.Waiting,
  type: OperationType.Unlock,
})

export const getTransactionTypeName = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.Deposit:
      return 'Deposit'
    case TransactionType.Swap:
      return 'Swap'
    case TransactionType.Withdraw:
      return 'Withdraw'
    case TransactionType.Mint:
      return 'Mint'
    case TransactionType.Lock:
      return 'Lock'
    case TransactionType.Claim:
      return 'Claim'
    case TransactionType.Unlock:
      return 'Unlock'

    default:
      return 'Error'
  }
}
