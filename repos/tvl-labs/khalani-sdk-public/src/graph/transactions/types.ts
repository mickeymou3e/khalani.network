import { ApolloQueryResult } from '@apollo/client/core'

export type BridgeProcessedMessage = {
  id: string
  transactionHash: string
  blockNumber: number
  blockTimestamp: string
  gasLimit: string
  gasPrice: string
}

export interface ITransactionRequestGraphEntity {
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
  bridgeRequestEntities: ITransactionRequestGraphEntity[]
}

export type IApolloBridgeRequestsQueryResult =
  ApolloQueryResult<IBridgeRequestsQueryResult>

export type ILiquidityWithdrawnQueryResult = {
  liquidityWithdrawnEntities: ITransactionRequestGraphEntity[]
}

export type IApolloLiquidityWithdrawnQueryResult =
  ApolloQueryResult<ILiquidityWithdrawnQueryResult>
