import { Network } from '@constants/Networks'
import { RequestStatus } from '@constants/Request'

export type ITransactionHistorySagaState = {
  status: RequestStatus
  isFetching: boolean
}

export interface TransactionHistory {
  id: string
  type: TransactionType
  time: string
  sourceTokens: TransactionHistoryToken[]
  amounts: bigint[]
  hash: string
  destinationToken?: TransactionHistoryToken
}

export interface TransactionHistoryToken {
  symbol: string
  network: Network
  decimals?: number
}

export enum TransactionType {
  BRIDGE = 'Bridge',
  APPROVE = 'Approve',
  PROVIDE_LIQUIDITY = 'Provide liquidity',
  WITHDRAW_LIQUIDITY = 'Withdraw liquidity',
}
