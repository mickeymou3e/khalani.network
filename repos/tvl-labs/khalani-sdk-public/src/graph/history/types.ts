export interface IntentEntity {
  id: string
  transactionHash: string
  blockNumber: number
  blockTimestamp: string
  gasLimit: string
  gasPrice: string
  callData: string
  author: string
  srcMToken: string
  srcAmount: bigint
  mTokens: string[]
  mAmounts: bigint[]
  status: string
}
