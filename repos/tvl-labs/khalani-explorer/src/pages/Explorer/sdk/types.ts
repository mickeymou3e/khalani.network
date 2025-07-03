import { ApolloQueryResult } from '@apollo/client'

import { Network } from '../../../constants/Networks'

export interface ISwapGraphEntity {
  id: string
  tokenAmountIn: string
  tokenAmountOut: string
  tokenInSym: string
  tokenOutSym: string
  tokenIn: string
  tokenOut: string
  poolId: {
    id: string
  }
  tx: string
}

export interface IBalancerSwapsQueryResult {
  swaps: ISwapGraphEntity[]
}

export type IApolloBalancerSwapsQueryResult = ApolloQueryResult<IBalancerSwapsQueryResult>

export type BridgeProcessedMessage = {
  id: string
  transactionHash: string
  blockNumber: number
  blockTimestamp: string
  gasLimit: string
  gasPrice: string
}

export interface IBridgeRequestGraphEntity {
  id: string
  amounts: string[]
  blockNumber: number
  blockTimestamp: string
  destinationChainId: string
  gasLimit: string
  gasPrice: string
  tokens: string[]
  transactionHash: string
  user: string
  callData: string
}
export type IBridgeRequestsQueryResult = {
  bridgeRequestEntities: IBridgeRequestGraphEntity[]
}
export type IApolloBridgeRequestsQueryResult = ApolloQueryResult<IBridgeRequestsQueryResult>

export type MessageProcessedEntity = {
  id: string
  amounts: string[]
  blockNumber: number
  tokens: string[]
  transactionHash: string
  user: string
}

export type IMessagesProcessedQueryResult = {
  messageProcessedEntities: MessageProcessedEntity[]
}
export type IApolloIMessagesProcessedQueryResult = ApolloQueryResult<IMessagesProcessedQueryResult>

export interface KhalaniTransactionDetailed {
  sourceNetwork: Network
  sourceTransaction: IBridgeRequestGraphEntity
  destinationChain: Network | null
  intermediateChainMessage: BridgeProcessedMessage | undefined
  destinationChainProcessedMessage: BridgeProcessedMessage | undefined
  swaps: ISwapGraphEntity[]
  withdrawEvents: IBridgeRequestGraphEntity[]
}
